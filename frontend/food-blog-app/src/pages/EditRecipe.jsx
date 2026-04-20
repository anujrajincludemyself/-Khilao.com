import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BASE_URL from '../config'

export default function EditRecipe() {
  const [recipeData, setRecipeData] = useState({})
  const [currentImage, setCurrentImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const getData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login first')
        navigate('/')
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(`${BASE_URL}/recipe/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        let res = response.data
        setRecipeData({
          title: res.title,
          ingredients: res.ingredients.join(","),
          instructions: res.instructions,
          time: res.time
        })
        setCurrentImage(res.coverImage)
      } catch (error) {
        console.error('Failed to fetch recipe:', error)
        const errorMessage = error.response?.data?.error || 'Failed to load recipe data'
        alert(errorMessage)
        if (error.response?.status === 401) {
          navigate('/')
        }
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [id])

  const onHandleChange = (e) => {
    let val =
      (e.target.name === "ingredients")
        ? e.target.value.split(",")
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

    setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
  }

  const onHandleSubmit = async (e) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('title', recipeData.title.trim())
      formData.append('time', recipeData.time.trim())
      formData.append('instructions', recipeData.instructions.trim())
      
      // Handle ingredients - convert array to comma-separated string
      const ingredientsString = typeof recipeData.ingredients === 'string'
        ? recipeData.ingredients
        : recipeData.ingredients.join(',')
      formData.append('ingredients', ingredientsString)
      
      // Only append file if a new one is selected
      if (recipeData.file) {
        formData.append('file', recipeData.file)
      }
      
      const token = localStorage.getItem('token')
      await axios.put(
        `${BASE_URL}/recipe/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      )
      window.dispatchEvent(new Event('recipes:invalidate'))
      alert('Recipe updated successfully!')
      navigate("/myRecipe")
    } catch (error) {
      console.error('Failed to update recipe:', error)
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         'Failed to update recipe'
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
        <div className="text-center text-slate-700 bg-white border border-blue-100 rounded-3xl px-8 py-10 shadow-lg">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-medium">Loading recipe...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[95%] max-w-4xl mx-auto mt-8 md:mt-10 mb-8 px-0">
      <form
        onSubmit={onHandleSubmit}
        className="bg-white text-slate-900 p-6 md:p-8 rounded-4xl shadow-[0_24px_70px_rgba(15,23,42,0.10)] space-y-5 border border-blue-100"
      >
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-600 font-semibold">Recipe Editor</p>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">Edit Recipe</h2>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            type="text"
            name="title"
            value={recipeData.title || ""}
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
            value={recipeData.time || ""}
            onChange={onHandleChange}
            className="bg-white border border-slate-300 rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Ingredients */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Ingredients</label>
          <textarea
            name="ingredients"
            rows="4"
            value={recipeData.ingredients || ""}
            onChange={onHandleChange}
            className="bg-white border border-slate-300 rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-sm"
          />
        </div>

        {/* Instructions */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Instructions</label>
          <textarea
            name="instructions"
            rows="4"
            value={recipeData.instructions || ""}
            onChange={onHandleChange}
            className="bg-white border border-slate-300 rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-sm"
          />
        </div>

        {/* Image */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Recipe Image</label>
          
          {/* Current Image */}
          {currentImage && !imagePreview && (
            <div className="mb-2">
              <p className="text-xs text-slate-500 mb-2">Current Image:</p>
              <div className="relative w-full h-56 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                <img
                  src={currentImage.startsWith('http') ? currentImage : `${BASE_URL}/images/${currentImage}`}
                  alt="Current recipe image"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="hidden w-full h-full flex-col items-center justify-center text-slate-400">
                  <svg className="w-12 h-12 mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                  <p className="text-xs">Current image not found</p>
                </div>
              </div>
            </div>
          )}
          
          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={onHandleChange}
            disabled={isSubmitting}
            className="text-sm text-slate-500 file:bg-blue-600 file:border-0 file:rounded-xl file:px-4 file:py-2 file:text-white file:cursor-pointer disabled:opacity-50 file:font-semibold"
          />
          
          {/* New Image Preview */}
          {imagePreview && (
            <div className="mt-2">
              <p className="text-xs text-slate-500 mb-2">New Image Preview:</p>
              <div className="relative w-full h-56 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                <img
                  src={imagePreview}
                  alt="New recipe preview"
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
              Updating Recipe...
            </>
          ) : (
            "Update Recipe"
          )}
        </button>
      </form>
    </div>
  )
}
