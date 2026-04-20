import React, { lazy, Suspense, useEffect } from 'react'
import './App.css'
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom"
import axios from 'axios'
import BASE_URL from './config'

const RECIPE_CACHE_TTL_MS = 45 * 1000
const recipeListCache = new Map()
const recipeDetailCache = new Map()
const inFlightListRequests = new Map()
const inFlightDetailRequests = new Map()

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const MainNavigation = lazy(() => import('./components/MainNavigation'))
const AddFoodRecipe = lazy(() => import('./pages/AddFoodRecipe'))
const EditRecipe = lazy(() => import('./pages/EditRecipe'))
const RecipeDetails = lazy(() => import('./pages/RecipeDetails'))
const AIRecipe = lazy(() => import('./pages/AIRecipe'))
const RouteError = lazy(() => import('./pages/RouteError'))

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-100">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-600">Loading...</p>
    </div>
  </div>
)

const getAuthToken = () => localStorage.getItem('token')

const getCurrentUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    return user?._id ? String(user._id) : 'anonymous'
  } catch {
    return 'anonymous'
  }
}

const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const getCreatorId = (recipe) => {
  if (!recipe?.createdBy) return null
  return typeof recipe.createdBy === 'object' ? recipe.createdBy?._id : recipe.createdBy
}

const getListCacheKey = (userId) => `list:${userId}`
const getDetailCacheKey = (userId, recipeId) => `detail:${userId}:${recipeId}`

const getFreshCacheValue = (cacheMap, key) => {
  const entry = cacheMap.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > RECIPE_CACHE_TTL_MS) {
    cacheMap.delete(key)
    return null
  }
  return entry.data
}

const setCacheValue = (cacheMap, key, data) => {
  cacheMap.set(key, {
    timestamp: Date.now(),
    data
  })
}

const invalidateRecipeCaches = () => {
  recipeListCache.clear()
  recipeDetailCache.clear()
  inFlightListRequests.clear()
  inFlightDetailRequests.clear()
}

if (typeof window !== 'undefined' && !window.__recipesInvalidateHooked) {
  window.__recipesInvalidateHooked = true
  window.addEventListener('recipes:invalidate', invalidateRecipeCaches)
}

const getAllRecipes = async () => {
  const token = getAuthToken()
  if (!token) return []

  const userId = getCurrentUserId()
  const cacheKey = getListCacheKey(userId)
  const cached = getFreshCacheValue(recipeListCache, cacheKey)
  if (cached) return cached

  const inFlight = inFlightListRequests.get(cacheKey)
  if (inFlight) return inFlight

  try {
    const requestPromise = axios.get(`${BASE_URL}/recipe`, {
      headers: getAuthHeaders(),
      timeout: 12000
    })

    inFlightListRequests.set(cacheKey, requestPromise)
    const res = await requestPromise
    const normalized = Array.isArray(res.data) ? res.data : []
    setCacheValue(recipeListCache, cacheKey, normalized)
    return normalized
  } catch (error) {
    console.error('Error fetching recipes:', error)
    if (error.response?.status === 401) return []
    return []
  } finally {
    inFlightListRequests.delete(cacheKey)
  }
}

const getMyRecipes = async () => {
  const user = JSON.parse(localStorage.getItem("user"))
  if (!user?._id) return []

  const allRecipes = await getAllRecipes()
  return allRecipes.filter(item => String(getCreatorId(item)) === String(user._id))
}

const getFavRecipes = () => {
  return getAllRecipes().then((recipes) =>
    recipes.filter((item) => item.isLikedByCurrentUser)
  )
}

const getRecipe = async ({ params }) => {
  const token = getAuthToken()
  if (!token) return redirect('/')

  const userId = getCurrentUserId()
  const cacheKey = getDetailCacheKey(userId, params.id)
  const cached = getFreshCacheValue(recipeDetailCache, cacheKey)
  if (cached) return cached

  const inFlight = inFlightDetailRequests.get(cacheKey)
  if (inFlight) {
    const response = await inFlight
    return response
  }

  try {
    const requestPromise = axios.get(`${BASE_URL}/recipe/${params.id}`, {
      headers: getAuthHeaders(),
      timeout: 12000
    })

    inFlightDetailRequests.set(cacheKey, requestPromise)
    const response = await requestPromise
    setCacheValue(recipeDetailCache, cacheKey, response.data)
    return response.data // Already includes createdBy.email from populate
  } catch (error) {
    console.error('Error fetching recipe:', error)
    if (error.response?.status === 401) {
      return redirect('/')
    }
    if (error?.code === 'ERR_NETWORK') {
      throw new Error('Backend is not reachable. Start backend server and retry.')
    }
    throw new Error('Failed to load recipe')
  } finally {
    inFlightDetailRequests.delete(cacheKey)
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    errorElement: <RouteError />,
    children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipe", element: <Home />, loader: getMyRecipes },
      { path: "/favRecipe", element: <Home />, loader: getFavRecipes },
      { path: "/addRecipe", element: <AddFoodRecipe /> },
      { path: '/aiRecipe', element: <AIRecipe /> },
      { path: "/editRecipe/:id", element: <EditRecipe /> },
      { path: "/recipe/:id", element: <RecipeDetails />, loader: getRecipe }
    ]
  }
])

export default function App() {
  useEffect(() => {
    const warmRoutes = () => {
      import('./pages/Home')
      import('./pages/AddFoodRecipe')
      import('./pages/EditRecipe')
      import('./pages/RecipeDetails')
      import('./pages/AIRecipe')
      import('./components/MainNavigation')
    }

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(warmRoutes, { timeout: 1200 })
      return () => window.cancelIdleCallback(id)
    }

    const timeoutId = setTimeout(warmRoutes, 300)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
