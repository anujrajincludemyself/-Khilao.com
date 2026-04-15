import React, { useEffect, useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { BsStopwatchFill } from "react-icons/bs"
import { FaHeart } from "react-icons/fa6"
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import axios from 'axios'
import BASE_URL from '../config'

export default function RecipeItems() {
  const recipes = useLoaderData()
  const [allRecipes, setAllRecipes] = useState(recipes)
  const [deletingId, setDeletingId] = useState(null)
  const [imageErrors, setImageErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  let path = window.location.pathname === "/myRecipe"
  let favItems = JSON.parse(localStorage.getItem("fav")) ?? []
  const [isFavRecipe, setIsFavRecipe] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (recipes) {
      setAllRecipes(recipes)
      setIsLoading(false)
    }
  }, [recipes])

  const onDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return
    }
    
    setDeletingId(id)
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${BASE_URL}/recipe/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setAllRecipes(recipes => recipes.filter(recipe => recipe._id !== id))
      let filterItem = favItems.filter(recipe => recipe._id !== id)
      localStorage.setItem("fav", JSON.stringify(filterItem))
    } catch (error) {
      console.error('Failed to delete recipe:', error)
      alert('Failed to delete recipe. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const favRecipe = (item) => {
    let filterItem = favItems.filter(recipe => recipe._id !== item._id)
    favItems = favItems.some(recipe => recipe._id === item._id)
      ? filterItem
      : [...favItems, item]

    localStorage.setItem("fav", JSON.stringify(favItems))
    setIsFavRecipe(pre => !pre)
  }

  const handleImageError = (itemId) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }))
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-[95%] max-w-7xl mx-auto my-12 text-center py-20">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Loading recipes...</p>
      </div>
    )
  }

  // Show empty state
  if (!allRecipes || allRecipes.length === 0) {
    return (
      <div className="w-[95%] max-w-7xl mx-auto my-12 text-center py-20 rounded-[28px] border border-dashed border-blue-200 bg-white/90 shadow-sm">
        <p className="text-slate-700 text-lg font-semibold">No recipes found</p>
        <p className="text-slate-500 text-sm mt-2">Be the first to share a recipe!</p>
      </div>
    )
  }

  return (
    <div className="w-[95%] max-w-7xl mx-auto my-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {
        allRecipes.map((item, index) => (
          <div
            key={index}
            onDoubleClick={() => navigate(`/recipe/${item._id}`)}
            className="group bg-white rounded-[28px] overflow-hidden border border-slate-200 shadow-[0_18px_45px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(37,99,235,0.16)] transition-all duration-300 cursor-pointer"
          >
            {/* Image */}
            <div className="relative w-full aspect-4/3 bg-slate-100 overflow-hidden">
              {!imageErrors[item._id] ? (
                <img
                  src={item.coverImage.startsWith('http') ? item.coverImage : `${BASE_URL}/images/${item.coverImage}`}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={() => handleImageError(item._id)}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                    <p className="text-xs">Image not found</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-slate-900/50 to-transparent"></div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <h3 className="text-base font-bold text-slate-900 leading-6 min-h-12">
                {item.title}
              </h3>

              <div className="flex items-center justify-between text-slate-500 text-xs">
                <div className="flex items-center gap-2 font-medium">
                  <BsStopwatchFill className="text-blue-600" />
                  <span>{item.time}</span>
                </div>

                {/* Fav / Actions */}
                <div className="flex items-center gap-3">
                  {!path ? (
                    <>
                      <FaHeart
                        onClick={() => favRecipe(item)}
                        className={`cursor-pointer transition ${
                          favItems.some(res => res._id === item._id)
                            ? "text-red-500"
                            : "text-slate-400 hover:text-red-500"
                        }`}
                      />
                      {/* Delete button for all recipes */}
                      {deletingId === item._id ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <MdDelete
                          onClick={() => onDelete(item._id)}
                          className="text-slate-400 hover:text-red-500 transition cursor-pointer"
                          title="Delete recipe"
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <Link
                        to={`/editRecipe/${item._id}`}
                        className="text-slate-400 hover:text-blue-600 transition"
                      >
                        <FaEdit />
                      </Link>
                      {deletingId === item._id ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <MdDelete
                          onClick={() => onDelete(item._id)}
                          className="text-red-500 hover:text-red-600 transition cursor-pointer"
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}
