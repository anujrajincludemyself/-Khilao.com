import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Navigate } from 'react-router-dom'
import BASE_URL from '../config'

const defaultForm = {
  dishDescription: '',
  dietary: '',
  servings: '2'
}

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString()
}

export default function AIRecipe() {
  const token = localStorage.getItem('token')

  const [formData, setFormData] = useState(defaultForm)
  const [isLoading, setIsLoading] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(true)
  const [error, setError] = useState('')
  const [recipe, setRecipe] = useState(null)
  const [history, setHistory] = useState([])
  const [activeHistoryId, setActiveHistoryId] = useState('')

  const canSubmit = useMemo(() => formData.dishDescription.trim().length > 3, [formData.dishDescription])

  if (!token) {
    return <Navigate to="/" replace />
  }

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }

  const loadHistory = async () => {
    setIsHistoryLoading(true)
    try {
      const response = await axios.get(`${BASE_URL}/recipe/ai-history`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 15000
      })
      const items = Array.isArray(response.data) ? response.data : []
      setHistory(items)
    } catch (err) {
      console.error('Failed to load AI history:', err)
      const message = err.response?.data?.error || 'Could not load your AI recipe history right now.'
      setError(message)
    } finally {
      setIsHistoryLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const onChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (error) setError('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit || isLoading) return

    setIsLoading(true)
    setError('')

    try {
      const response = await axios.post(
        `${BASE_URL}/recipe/ai-generate`,
        {
          dishDescription: formData.dishDescription.trim(),
          dietary: formData.dietary.trim(),
          servings: formData.servings.trim() || '2'
        },
        {
          headers: authHeaders,
          timeout: 30000
        }
      )

      setRecipe(response.data.recipe)
      if (response.data.historyId) {
        setActiveHistoryId(String(response.data.historyId))
      }
      await loadHistory()
    } catch (err) {
      let message = err.response?.data?.error || 'Unable to generate recipe right now. Please try again.'

      if (err?.code === 'ERR_NETWORK') {
        message = 'Backend is not reachable on localhost:5000. Start backend server and retry.'
      }

      if (err?.code === 'ECONNABORTED') {
        message = 'AI request timed out. Please retry with a shorter prompt.'
      }

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const openHistoryItem = (item) => {
    setRecipe(item.recipe)
    setActiveHistoryId(String(item._id))
  }

  const deleteHistoryItem = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/recipe/ai-history/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 15000
      })
      setHistory((prev) => prev.filter((item) => item._id !== id))
      if (activeHistoryId === String(id)) {
        setActiveHistoryId('')
      }
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to delete this recipe history item.'
      setError(message)
    }
  }

  return (
    <div className="w-[95%] max-w-400 mx-auto mt-20 mb-10">
      <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-linear-to-br from-white via-slate-50 to-emerald-50">
        <div className="px-6 md:px-10 py-8 border-b border-slate-200 bg-white/70 backdrop-blur">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">AI Recipe Studio</h1>
          <p className="text-slate-600 mt-2 max-w-4xl">
            Generate detailed recipes, save your personal AI recipe history, and revisit or delete any generated item anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr_360px] gap-0">
          <section className="p-6 md:p-8 border-b xl:border-b-0 xl:border-r border-slate-200 bg-white/80">
            <div className="xl:sticky xl:top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Generate Detailed Recipe</h2>
              <p className="text-sm text-slate-600 mb-5">
                Add dish goals and preferences for richer step-by-step outputs.
              </p>

              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Dish Description</label>
                  <textarea
                    value={formData.dishDescription}
                    onChange={onChange('dishDescription')}
                    rows={6}
                    required
                    placeholder="Example: Spicy paneer tikka masala, restaurant style, smoky flavor, detailed instructions"
                    className="w-full border border-slate-300 rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Dietary Preferences</label>
                  <input
                    type="text"
                    value={formData.dietary}
                    onChange={onChange('dietary')}
                    placeholder="high protein, no nuts, low oil"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Servings</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.servings}
                    onChange={onChange('servings')}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit || isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white py-3 rounded-xl font-bold tracking-wide transition"
                >
                  {isLoading ? 'Generating...' : 'Generate Recipe'}
                </button>
              </form>
            </div>
          </section>

          <section className="p-6 md:p-8 border-b xl:border-b-0 xl:border-r border-slate-200 bg-slate-50/70">
            {!recipe ? (
              <div className="min-h-130 h-full flex items-center justify-center text-center text-slate-500">
                <div>
                  <p className="text-2xl font-bold text-slate-700 mb-2">No recipe selected</p>
                  <p className="text-sm">Generate a recipe or pick one from your history column.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-7">
                <div>
                  <h3 className="text-3xl font-extrabold text-slate-900 leading-tight">{recipe.title}</h3>
                  {recipe.description && <p className="text-slate-600 mt-2 text-sm md:text-base">{recipe.description}</p>}
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">Total: {recipe.totalTime}</span>
                    {recipe.prepTime && <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800">Prep: {recipe.prepTime}</span>}
                    {recipe.cookTime && <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800">Cook: {recipe.cookTime}</span>}
                    <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-800">Serves {recipe.servings}</span>
                    {recipe.difficulty && <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-800">{recipe.difficulty}</span>}
                    {recipe.cuisine && <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800">{recipe.cuisine}</span>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4">
                    <h4 className="font-bold text-slate-900 mb-3">Ingredients</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {recipe.ingredients?.map((ing, idx) => (
                        <li key={`${ing.item}-${idx}`} className="border-b border-slate-100 pb-2">
                          <span className="font-semibold">{ing.item}</span>
                          {ing.quantity ? ` - ${ing.quantity}` : ''}
                          {ing.notes ? ` (${ing.notes})` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4">
                    <h4 className="font-bold text-slate-900 mb-3">Equipment</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                      {(recipe.equipment || []).map((item, idx) => (
                        <li key={`eq-${idx}`}>{item}</li>
                      ))}
                    </ul>

                    <h4 className="font-bold text-slate-900 mt-5 mb-3">Nutrition (Approx)</h4>
                    <ul className="space-y-1 text-sm text-slate-700">
                      <li>Calories: {recipe.nutrition?.calories || 'N/A'}</li>
                      <li>Protein: {recipe.nutrition?.protein || 'N/A'}</li>
                      <li>Carbs: {recipe.nutrition?.carbs || 'N/A'}</li>
                      <li>Fats: {recipe.nutrition?.fats || 'N/A'}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  <h4 className="font-bold text-slate-900 mb-3">Step-by-Step Cooking</h4>
                  <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-700">
                    {recipe.steps?.map((step, idx) => (
                      <li key={`step-${idx}`}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4">
                    <h4 className="font-bold text-slate-900 mb-3">Tips</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                      {(recipe.tips || []).map((tip, idx) => (
                        <li key={`tip-${idx}`}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4">
                    <h4 className="font-bold text-slate-900 mb-3">Storage and Reheat</h4>
                    <ul className="space-y-1 text-sm text-slate-700">
                      <li>Fridge: {recipe.storage?.fridge || 'N/A'}</li>
                      <li>Freezer: {recipe.storage?.freezer || 'N/A'}</li>
                      <li>Reheating: {recipe.reheating || 'N/A'}</li>
                    </ul>

                    <h4 className="font-bold text-slate-900 mt-5 mb-3">Variations</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                      {(recipe.variations || []).map((item, idx) => (
                        <li key={`var-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {(recipe.allergens || []).length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                    <h4 className="font-bold text-red-900 mb-2">Potential Allergens</h4>
                    <div className="flex flex-wrap gap-2">
                      {recipe.allergens.map((item, idx) => (
                        <span key={`${item}-${idx}`} className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-semibold">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="p-6 md:p-8 bg-white/90">
            <div className="xl:sticky xl:top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">My AI Recipes</h2>
                <button
                  onClick={loadHistory}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  Refresh
                </button>
              </div>

              {isHistoryLoading ? (
                <div className="text-sm text-slate-500">Loading your history...</div>
              ) : history.length === 0 ? (
                <div className="text-sm text-slate-500 border border-dashed border-slate-300 rounded-xl p-4">
                  No saved AI recipes yet. Generate one to see it here.
                </div>
              ) : (
                <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
                  {history.map((item) => (
                    <article
                      key={item._id}
                      className={`rounded-xl border p-3 transition ${
                        activeHistoryId === String(item._id)
                          ? 'border-emerald-400 bg-emerald-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <button
                        onClick={() => openHistoryItem(item)}
                        className="w-full text-left"
                      >
                        <h3 className="font-bold text-slate-900 text-sm">
                          {item.recipe?.title || item.query?.dishDescription || 'Untitled Recipe'}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {item.query?.dishDescription}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-2">{formatDate(item.createdAt)}</p>
                      </button>

                      <button
                        onClick={() => deleteHistoryItem(item._id)}
                        className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
