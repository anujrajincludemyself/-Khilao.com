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
      try {
        const response = await axios.get(`${BASE_URL}/recipe/${id}`)
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
        alert('Failed to load recipe data')
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
      await axios.put(
        `${BASE_URL}/recipe/${id}`,
        recipeData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'authorization': 'bearer ' + localStorage.getItem("token")
          }
        }
      )
      navigate("/myRecipe")
    } catch (error) {
      console.error('Failed to update recipe:', error)
      alert('Failed to update recipe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading recipe...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <form
        onSubmit={onHandleSubmit}
        className="w-[420px] max-w-full bg-slate-900 text-white p-6 rounded-xl shadow-2xl space-y-4"
      >
        <h2 className="text-xl font-semibold text-center mb-2">
          Edit Recipe
        </h2>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Title</label>
          <input
            type="text"
            name="title"
            value={recipeData.title || ""}
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
            value={recipeData.time || ""}
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
            value={recipeData.ingredients || ""}
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
            value={recipeData.instructions || ""}
            onChange={onHandleChange}
            className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Image */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Recipe Image</label>
          
          {/* Current Image */}
          {currentImage && !imagePreview && (
            <div className="mb-2">
              <p className="text-xs text-gray-400 mb-2">Current Image:</p>
              <div className="relative w-full h-48 bg-slate-700 rounded-md overflow-hidden">
                <img
                  src={`${BASE_URL}/images/${currentImage}`}
                  alt="Current recipe image"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="hidden w-full h-full flex-col items-center justify-center text-gray-400">
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
            className="text-sm text-gray-300 file:bg-slate-800 file:border-0 file:rounded-md file:px-3 file:py-1 file:text-white file:cursor-pointer disabled:opacity-50"
          />
          
          {/* New Image Preview */}
          {imagePreview && (
            <div className="mt-2">
              <p className="text-xs text-gray-400 mb-2">New Image Preview:</p>
              <div className="relative w-full h-48 bg-slate-700 rounded-md overflow-hidden">
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
