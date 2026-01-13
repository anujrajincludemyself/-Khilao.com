import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BASE_URL from '../config'

export default function AddFoodRecipe() {
  const [recipeData, setRecipeData] = useState({})
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  
  // Debug current recipe data
  console.log('Current recipe data:', recipeData)

  const onHandleChange = (e) => {
    let val =
      (e.target.name === "ingredients")
        ? e.target.value.split(",").map(item => item.trim()).filter(item => item)
        : (e.target.name === "file")
          ? e.target.files[0]
          : e.target.value

    // Handle image preview
    if (e.target.name === "file" && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }

    console.log(`Field ${e.target.name} updated:`, val)
    setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
  }

  const onHandleSubmit = async (e) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    // Validate required fields
    if (!recipeData.title?.trim()) {
      alert('Please enter a recipe title')
      return
    }
    
    if (!recipeData.time?.trim()) {
      alert('Please enter cooking time')
      return
    }
    
    if (!recipeData.ingredients?.length || !recipeData.ingredients[0]?.trim()) {
      alert('Please enter ingredients')
      return
    }
    
    if (!recipeData.instructions?.trim()) {
      alert('Please enter cooking instructions')
      return
    }
    
    if (!recipeData.file) {
      alert('Please select a recipe image')
      return
    }
    
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login to add a recipe')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('title', recipeData.title)
      formData.append('time', recipeData.time)
      formData.append('instructions', recipeData.instructions)
      formData.append('file', recipeData.file)
      
      // Handle ingredients array
      recipeData.ingredients.forEach((ingredient, index) => {
        if (ingredient.trim()) {
          formData.append(`ingredients[${index}]`, ingredient.trim())
        }
      })
      
      console.log('Submitting recipe data:', {
        title: recipeData.title,
        time: recipeData.time,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
        file: recipeData.file?.name
      })
      
      const response = await axios.post(
        `${BASE_URL}/recipe`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          timeout: 30000 // 30 second timeout for file upload
        }
      )
      
      console.log('Recipe added successfully:', response.data)
      alert('Recipe added successfully!')
      navigate("/")
    } catch (error) {
      console.error('Failed to add recipe:', error)
      
      if (error.code === 'ECONNABORTED') {
        alert('Upload timeout. Please check your internet connection and try again.')
      } else if (error.response) {
        const errorMessage = error.response.data?.error || 
                           error.response.data?.message || 
                           'Failed to add recipe'
        alert(`Error: ${errorMessage}`)
        console.error('Server error:', error.response.data)
      } else if (error.request) {
        alert('Network error. Please check your internet connection.')
      } else {
        alert('Failed to add recipe. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <form
        onSubmit={onHandleSubmit}
        className="w-[420px] max-w-full bg-slate-900 text-white p-6 rounded-xl shadow-2xl space-y-4"
      >
        <h2 className="text-xl font-semibold text-center mb-2">
          Add New Recipe
        </h2>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Title</label>
          <input
            type="text"
            name="title"
            onChange={onHandleChange}
            className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Time */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Time</label>
          <input
            type="text"
            name="time"
            onChange={onHandleChange}
            className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Ingredients */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Ingredients</label>
          <textarea
            name="ingredients"
            rows="4"
            onChange={onHandleChange}
            className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Instructions */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Instructions</label>
          <textarea
            name="instructions"
            rows="4"
            onChange={onHandleChange}
            className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Image */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Recipe Image</label>
          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={onHandleChange}
            disabled={isSubmitting}
            className="text-sm text-gray-300 file:bg-slate-800 file:border-0 file:rounded-md file:px-3 file:py-1 file:text-white file:cursor-pointer disabled:opacity-50"
          />
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-2">
              <p className="text-xs text-gray-400 mb-2">Preview:</p>
              <div className="relative w-full h-48 bg-slate-700 rounded-md overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Recipe preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null)
                    setRecipeData(prev => ({ ...prev, file: null }))
                    // Reset file input
                    const fileInput = document.querySelector('input[name="file"]')
                    if (fileInput) fileInput.value = ''
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition py-2 rounded-md font-semibold mt-2 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding Recipe...
            </>
          ) : (
            "Add Recipe"
          )}
        </button>
      </form>
    </div>
  )
}
