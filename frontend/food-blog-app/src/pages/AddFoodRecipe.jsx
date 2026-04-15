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
      formData.append('title', recipeData.title.trim())
      formData.append('time', recipeData.time.trim())
      formData.append('instructions', recipeData.instructions.trim())
      formData.append('file', recipeData.file)
      
      // Send ingredients as comma-separated string
      const ingredientsString = recipeData.ingredients
        .filter(ing => ing && ing.trim())
        .map(ing => ing.trim())
        .join(',')
      formData.append('ingredients', ingredientsString)
      
      console.log('Submitting recipe data:', {
        title: recipeData.title,
        time: recipeData.time,
        ingredients: ingredientsString,
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
    <div className="w-[95%] max-w-4xl mx-auto mt-8 md:mt-10 mb-8 px-0">
      <form
        onSubmit={onHandleSubmit}
        className="bg-white text-slate-900 p-6 md:p-8 rounded-4xl shadow-[0_24px_70px_rgba(15,23,42,0.10)] space-y-5 border border-blue-100"
      >
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-600 font-semibold">Recipe Creator</p>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">Add New Recipe</h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">Share a polished recipe card with image, ingredients, cooking time, and clear instructions.</p>
        </div>

        {/* Title */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            type="text"
            name="title"
            onChange={onHandleChange}
            className="bg-white border border-slate-300 rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          </div>

        {/* Time */}
          <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Time</label>
          <input
            type="text"
            name="time"
            onChange={onHandleChange}
            className="bg-white border border-slate-300 rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          </div>
        </div>

        {/* Ingredients */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Ingredients</label>
          <textarea
            name="ingredients"
            rows="4"
            onChange={onHandleChange}
            placeholder="Enter ingredients separated by commas"
            className="bg-white border border-slate-300 rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-sm"
          />
        </div>

        {/* Instructions */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Instructions</label>
          <textarea
            name="instructions"
            rows="4"
            onChange={onHandleChange}
            placeholder="Explain the recipe clearly"
            className="bg-white border border-slate-300 rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-sm"
          />
        </div>

        {/* Image */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Recipe Image</label>
          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={onHandleChange}
            disabled={isSubmitting}
            className="text-sm text-slate-500 file:bg-blue-600 file:border-0 file:rounded-xl file:px-4 file:py-2 file:text-white file:cursor-pointer disabled:opacity-50 file:font-semibold"
          />
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-2">
              <p className="text-xs text-slate-500 mb-2">Preview:</p>
              <div className="relative w-full h-56 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
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
                  className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs transition shadow"
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
          className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-300 disabled:to-blue-300 disabled:cursor-not-allowed transition py-3 rounded-xl font-semibold mt-2 flex items-center justify-center text-white shadow-lg shadow-blue-200"
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
