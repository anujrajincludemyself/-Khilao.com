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
  const [allRecipes, setAllRecipes] = useState()
  const [deletingId, setDeletingId] = useState(null)
  const [imageErrors, setImageErrors] = useState({})
  let path = window.location.pathname === "/myRecipe"
  let favItems = JSON.parse(localStorage.getItem("fav")) ?? []
  const [isFavRecipe, setIsFavRecipe] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setAllRecipes(recipes)
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

  return (
    <div className="w-[85%] mx-auto my-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {
        allRecipes?.map((item, index) => (
          <div
            key={index}
            onDoubleClick={() => navigate(`/recipe/${item._id}`)}
            className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
          >
            {/* Image */}
            <div className="relative w-full h-36 bg-slate-700">
              {!imageErrors[item._id] ? (
                <img
                  src={`${BASE_URL}/images/${item.coverImage}`}
                  alt={item.title}
                  className="w-full h-36 object-cover"
                  onError={() => handleImageError(item._id)}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-36 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                    <p className="text-xs">Image not found</p>
                  </div>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              <h3 className="text-sm font-semibold text-white truncate">
                {item.title}
              </h3>

              <div className="flex items-center justify-between text-gray-400 text-xs">
                <div className="flex items-center gap-2">
                  <BsStopwatchFill />
                  <span>{item.time}</span>
                </div>

                {/* Fav / Actions */}
                {
                  !path ? (
                    <FaHeart
                      onClick={() => favRecipe(item)}
                      className={`cursor-pointer transition ${
                        favItems.some(res => res._id === item._id)
                          ? "text-red-500"
                          : "hover:text-red-400"
                      }`}
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/editRecipe/${item._id}`}
                        className="text-gray-300 hover:text-blue-400 transition"
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
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}
