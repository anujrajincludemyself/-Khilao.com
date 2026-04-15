const crypto = require('crypto')
const AIRecipeHistory = require('../models/aiRecipeHistory')
const Recipes = require('../models/recipe')

const TIMEOUT_MS = 20000
const AI_RATE_LIMIT_MAX = parseInt(process.env.AI_RATE_LIMIT_MAX || '8', 10)
const AI_RATE_LIMIT_WINDOW_MS = parseInt(process.env.AI_RATE_LIMIT_WINDOW_MS || '3600000', 10)
const AI_CACHE_TTL_MS = parseInt(process.env.AI_CACHE_TTL_MS || '900000', 10)
const GROQ_BASE_URL = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1'
const DEFAULT_MODEL_CANDIDATES = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768']

const aiCache = new Map()
const aiRateLimit = new Map()

const nowMs = () => Date.now()

const makeCacheKey = ({ dishDescription, dietary, servings }) => {
  const normalized = {
    dishDescription: dishDescription.toLowerCase().trim(),
    dietary: dietary.toLowerCase().trim(),
    servings: servings.toLowerCase().trim()
  }

  return crypto.createHash('sha256').update(JSON.stringify(normalized)).digest('hex')
}

const getCachedRecipe = (key) => {
  const cached = aiCache.get(key)
  if (!cached) return null

  if (cached.expiresAt <= nowMs()) {
    aiCache.delete(key)
    return null
  }

  return cached.recipe
}

const setCachedRecipe = (key, recipe) => {
  if (aiCache.size > 1000) {
    const oldestKey = aiCache.keys().next().value
    if (oldestKey) aiCache.delete(oldestKey)
  }

  aiCache.set(key, {
    recipe,
    expiresAt: nowMs() + AI_CACHE_TTL_MS
  })
}

const checkRateLimit = (userId) => {
  const key = String(userId || 'anonymous')
  const current = nowMs()
  const slot = aiRateLimit.get(key)

  if (!slot || slot.resetAt <= current) {
    aiRateLimit.set(key, {
      count: 1,
      resetAt: current + AI_RATE_LIMIT_WINDOW_MS
    })

    return { allowed: true, remaining: Math.max(AI_RATE_LIMIT_MAX - 1, 0), resetAt: current + AI_RATE_LIMIT_WINDOW_MS }
  }

  if (slot.count >= AI_RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: slot.resetAt }
  }

  slot.count += 1
  aiRateLimit.set(key, slot)
  return { allowed: true, remaining: Math.max(AI_RATE_LIMIT_MAX - slot.count, 0), resetAt: slot.resetAt }
}

const normalizeString = (value, fallback = '') => {
  if (typeof value !== 'string') return fallback
  return value.trim() || fallback
}

const normalizeArray = (value) => {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
}

const normalizeIngredients = (ingredients) => {
  if (!Array.isArray(ingredients)) return []

  return ingredients
    .map((entry) => {
      if (typeof entry === 'string') {
        return {
          item: entry.trim(),
          quantity: '',
          notes: ''
        }
      }

      if (!entry || typeof entry !== 'object') return null

      return {
        item: normalizeString(entry.item),
        quantity: normalizeString(entry.quantity),
        notes: normalizeString(entry.notes)
      }
    })
    .filter((entry) => entry && entry.item)
}

const parseModelContent = (content) => {
  if (typeof content === 'string') {
    try {
      return JSON.parse(content)
    } catch (error) {
      const match = content.match(/\{[\s\S]*\}/)
      if (match) {
        return JSON.parse(match[0])
      }
    }
  }

  if (Array.isArray(content)) {
    const text = content
      .map((part) => (typeof part?.text === 'string' ? part.text : ''))
      .join('')
      .trim()

    if (text) {
      return parseModelContent(text)
    }
  }

  throw new Error('AI response was not valid JSON')
}

const normalizeRecipe = (payload) => {
  const recipe = payload && typeof payload === 'object' ? payload : {}

  return {
    title: normalizeString(recipe.title, 'AI Recipe'),
    description: normalizeString(recipe.description),
    cuisine: normalizeString(recipe.cuisine),
    difficulty: normalizeString(recipe.difficulty),
    servings: normalizeString(recipe.servings, '2'),
    prepTime: normalizeString(recipe.prepTime),
    cookTime: normalizeString(recipe.cookTime),
    totalTime: normalizeString(recipe.totalTime, normalizeString(recipe.time, '45 min')),
    ingredients: normalizeIngredients(recipe.ingredients),
    equipment: normalizeArray(recipe.equipment),
    steps: normalizeArray(recipe.steps),
    tips: normalizeArray(recipe.tips),
    allergens: normalizeArray(recipe.allergens),
    nutrition: {
      calories: normalizeString(recipe.nutrition?.calories),
      protein: normalizeString(recipe.nutrition?.protein),
      carbs: normalizeString(recipe.nutrition?.carbs),
      fats: normalizeString(recipe.nutrition?.fats)
    },
    storage: {
      fridge: normalizeString(recipe.storage?.fridge),
      freezer: normalizeString(recipe.storage?.freezer)
    },
    reheating: normalizeString(recipe.reheating),
    variations: normalizeArray(recipe.variations)
  }
}

const buildPrompt = ({ dishDescription, dietary, servings }) => {
  return {
    system: [
      'You are a senior chef and meal-planning expert.',
      'Return only valid JSON. No markdown, no prose outside JSON.',
      'Generate practical, detailed, home-cook friendly recipes with precise steps.',
      'Keep output consistent and structured.'
    ].join(' '),
    user: {
      task: 'Generate one complete and detailed recipe.',
      input: {
        dishDescription,
        dietary,
        servings
      },
      responseShape: {
        title: 'string',
        description: 'string',
        cuisine: 'string',
        difficulty: 'Easy|Medium|Hard',
        servings: 'string',
        prepTime: 'string',
        cookTime: 'string',
        totalTime: 'string',
        ingredients: [
          {
            item: 'string',
            quantity: 'string',
            notes: 'string optional'
          }
        ],
        equipment: ['string'],
        steps: ['string'],
        tips: ['string'],
        allergens: ['string'],
        nutrition: {
          calories: 'string',
          protein: 'string',
          carbs: 'string',
          fats: 'string'
        },
        storage: {
          fridge: 'string',
          freezer: 'string'
        },
        reheating: 'string',
        variations: ['string']
      },
      constraints: [
        'ingredients and steps must not be empty',
        '8 to 14 steps for detailed guidance',
        'use precise measurements where possible',
        'keep each step clear and actionable',
        'include at least 2 practical tips',
        'keep JSON compact and valid'
      ]
    }
  }
}

const parseProviderResponse = async (response) => {
  const raw = await response.text()

  try {
    return {
      raw,
      body: raw ? JSON.parse(raw) : null
    }
  } catch (error) {
    return {
      raw,
      body: null
    }
  }
}

const createModelCandidates = () => {
  const preferred = normalizeString(process.env.GROQ_MODEL, 'llama-3.3-70b-versatile')
  const extraFallbacks = normalizeString(process.env.GROQ_MODEL_FALLBACKS)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return [...new Set([preferred, ...extraFallbacks, ...DEFAULT_MODEL_CANDIDATES])]
}

const persistGeneratedRecipe = async ({ userId, query, recipe }) => {
  const historyItem = await AIRecipeHistory.create({
    userId,
    query,
    recipe
  })

  // Also save a private recipe record in main Recipes collection for durability.
  await Recipes.create({
    title: recipe.title,
    ingredients: recipe.ingredients.map((item) => `${item.item}${item.quantity ? ` - ${item.quantity}` : ''}${item.notes ? ` (${item.notes})` : ''}`),
    instructions: (recipe.steps || []).join('\n'),
    time: recipe.totalTime || recipe.prepTime || '45 min',
    coverImage: '',
    createdBy: userId,
    isPublic: false,
    isAIGenerated: true
  })

  return historyItem
}

const getAiRecipesHistory = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const items = await AIRecipeHistory.find({ userId: req.user.id })
      .select('query recipe createdAt')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    return res.status(200).json(items)
  } catch (error) {
    console.error('Failed to fetch AI history:', error)
    return res.status(500).json({ error: 'Failed to fetch AI recipe history' })
  }
}

const deleteAiRecipeHistory = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const deleted = await AIRecipeHistory.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    })

    if (!deleted) {
      return res.status(404).json({ error: 'AI recipe history item not found' })
    }

    return res.status(200).json({ status: 'ok', message: 'AI recipe deleted' })
  } catch (error) {
    console.error('Failed to delete AI history:', error)
    return res.status(500).json({ error: 'Failed to delete AI recipe history' })
  }
}

const getAiRecipe = async (req, res) => {
  try {
    const groqApiKey = normalizeString(process.env.GROQ_API_KEY || process.env.GROK_API_KEY)

    if (!groqApiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY is missing on server' })
    }

    if (groqApiKey.includes('...')) {
      return res.status(500).json({ error: 'GROQ_API_KEY appears redacted. Set the full key in backend .env.' })
    }

    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const dishDescription = normalizeString(req.body?.dishDescription)
    const dietary = normalizeString(req.body?.dietary, 'none')
    const servings = normalizeString(req.body?.servings, '2')

    if (!dishDescription) {
      return res.status(400).json({ error: 'dishDescription is required' })
    }

    const cacheKey = makeCacheKey({ dishDescription, dietary, servings })
    const cachedRecipe = getCachedRecipe(cacheKey)

    if (cachedRecipe) {
      const saved = await persistGeneratedRecipe({
        userId: req.user.id,
        query: { dishDescription, dietary, servings },
        recipe: cachedRecipe
      })
      return res.status(200).json({ recipe: cachedRecipe, cached: true, historyId: saved._id })
    }

    const rate = checkRateLimit(req.user.id)
    if (!rate.allowed) {
      const retryAfterSeconds = Math.max(Math.ceil((rate.resetAt - nowMs()) / 1000), 1)
      res.set('Retry-After', String(retryAfterSeconds))
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' })
    }

    res.set('X-RateLimit-Remaining', String(rate.remaining))

    const prompt = buildPrompt({ dishDescription, dietary, servings })
    const modelCandidates = createModelCandidates()
    const triedModels = []
    let aiResponse = null
    let lastProviderError = null

    for (const model of modelCandidates) {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

      try {
        triedModels.push(model)

        const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model,
            temperature: 0.35,
            max_tokens: 1300,
            messages: [
              { role: 'system', content: prompt.system },
              { role: 'user', content: JSON.stringify(prompt.user) }
            ]
          }),
          signal: controller.signal
        })

        const { body, raw } = await parseProviderResponse(response)

        if (!response.ok) {
          const providerMessage =
            body?.error?.message ||
            body?.error ||
            body?.message ||
            `AI provider returned an error (HTTP ${response.status})`

          lastProviderError = providerMessage

          console.error('Groq error:', {
            status: response.status,
            model,
            body: body || raw
          })

          if (typeof providerMessage === 'string' && providerMessage.toLowerCase().includes('model')) {
            continue
          }

          const message = typeof providerMessage === 'string' ? providerMessage : 'AI provider returned an error'
          return res.status(502).json({ error: message })
        }

        const content = body?.choices?.[0]?.message?.content
        const parsed = parseModelContent(content)
        aiResponse = normalizeRecipe(parsed)
        break
      } finally {
        clearTimeout(timeout)
      }
    }

    if (!aiResponse) {
      const modelMsg = `No valid Groq model found. Tried: ${triedModels.join(', ')}`
      const errorMsg = typeof lastProviderError === 'string' ? `${modelMsg}. Last provider error: ${lastProviderError}` : modelMsg
      return res.status(502).json({ error: errorMsg })
    }

    if (!aiResponse.ingredients.length || !aiResponse.steps.length) {
      return res.status(502).json({ error: 'AI response was incomplete. Try again.' })
    }

    setCachedRecipe(cacheKey, aiResponse)

    const saved = await persistGeneratedRecipe({
      userId: req.user.id,
      query: { dishDescription, dietary, servings },
      recipe: aiResponse
    })

    return res.status(200).json({ recipe: aiResponse, cached: false, historyId: saved._id })
  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'AI request timed out. Please retry.' })
    }

    console.error('AI recipe generation error:', error)
    return res.status(500).json({ error: 'Failed to generate AI recipe' })
  }
}

module.exports = { getAiRecipe, getAiRecipesHistory, deleteAiRecipeHistory }
