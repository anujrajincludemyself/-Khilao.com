import React, { lazy, Suspense } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import axios from 'axios'
import BASE_URL from './config'

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
const getAllRecipes = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/recipe`, { timeout: 12000 })
    return Array.isArray(res.data) ? res.data : []
  } catch (error) {
    console.error('Error fetching recipes:', error)
    // Keep homepage usable even when backend is temporarily unreachable.
    return []
  }
}

const getMyRecipes = async () => {
  const user = JSON.parse(localStorage.getItem("user"))
  if (!user?._id) return []

  const allRecipes = await getAllRecipes()
  return allRecipes.filter(item => item.createdBy === user._id)
}

const getFavRecipes = () => {
  const fav = JSON.parse(localStorage.getItem("fav"))
  return Array.isArray(fav) ? fav : []
}

const getRecipe = async ({ params }) => {
  try {
    // Now gets recipe with user data in single API call (optimized)
    const response = await axios.get(`${BASE_URL}/recipe/${params.id}`, { timeout: 12000 })
    return response.data // Already includes createdBy.email from populate
  } catch (error) {
    console.error('Error fetching recipe:', error)
    if (error?.code === 'ERR_NETWORK') {
      throw new Error('Backend is not reachable. Start backend server and retry.')
    }
    throw new Error('Failed to load recipe')
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
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
