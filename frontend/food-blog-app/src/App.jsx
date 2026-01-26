import React, { lazy, Suspense } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import axios from 'axios'

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const MainNavigation = lazy(() => import('./components/MainNavigation'))
const AddFoodRecipe = lazy(() => import('./pages/AddFoodRecipe'))
const EditRecipe = lazy(() => import('./pages/EditRecipe'))
const RecipeDetails = lazy(() => import('./pages/RecipeDetails'))

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-100">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-600">Loading...</p>
    </div>
  </div>
)


const BASE_URL = "https://khilao-com.onrender.com";

const getAllRecipes = async () => {
  let allRecipes = []
  await axios.get(`${BASE_URL}/recipe`).then(res => {
    allRecipes = res.data
  })
  return allRecipes
}

const getMyRecipes = async () => {
  let user = JSON.parse(localStorage.getItem("user"))
  let allRecipes = await getAllRecipes()
  return allRecipes.filter(item => item.createdBy === user._id)
}

const getFavRecipes = () => {
  return JSON.parse(localStorage.getItem("fav"))
}

const getRecipe = async ({ params }) => {
  try {
    // Now gets recipe with user data in single API call (optimized)
    const response = await axios.get(`${BASE_URL}/recipe/${params.id}`)
    return response.data // Already includes createdBy.email from populate
  } catch (error) {
    console.error('Error fetching recipe:', error)
    throw new Error('Failed to load recipe')
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipe", element: <Home />, loader: getMyRecipes },
      { path: "/favRecipe", element: <Home />, loader: getFavRecipes },
      { path: "/addRecipe", element: <AddFoodRecipe /> },
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
