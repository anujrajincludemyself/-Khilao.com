import React, { useEffect, useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { BsStopwatchFill } from "react-icons/bs"
import { FaHeart } from "react-icons/fa6"
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import axios from 'axios'
import BASE_URL from '../config'
import { motion, AnimatePresence } from 'framer-motion'

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

  const onDelete = async (id, e) => {
    if (e) {
      e.stopPropagation()
    }
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

  const favRecipe = (item, e) => {
    if (e) {
       e.stopPropagation()
    }
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

  const handleCardClick = (id) => {
     navigate(`/recipe/${id}`)
  }

  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  // Show loading state with skeletons
  if (isLoading) {
    return (
      <div className="w-[95%] max-w-7xl mx-auto my-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {[1,2,3,4].map((i) => (
            <div key={i} className="rounded-[2rem] overflow-hidden bg-white border border-slate-100 shadow-sm animate-pulse">
               <div className="w-full aspect-4/3 bg-slate-200"></div>
               <div className="p-5 space-y-4">
                  <div className="h-6 bg-slate-200 rounded-md w-3/4"></div>
                  <div className="flex justify-between">
                     <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
                     <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
                  </div>
               </div>
            </div>
         ))}
      </div>
    )
  }

  // Show empty state
  if (!allRecipes || allRecipes.length === 0) {
    return (
      <div className="w-[95%] max-w-7xl mx-auto my-12 text-center py-32 rounded-[3rem] border-2 border-dashed border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-blue-50/50 -z-10"></div>
        <p className="text-black text-2xl font-black mb-2">No recipes found</p>
        <p className="text-slate-500 font-medium">Be the first to share an amazing recipe!</p>
      </div>
    )
  }

  return (
    <motion.div 
      variants={gridVariants}
      initial="hidden"
      animate="show"
      className="w-[95%] max-w-7xl mx-auto my-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-0"
    >
      <AnimatePresence>
      {
        allRecipes.map((item, index) => (
          <motion.div
            layout
            variants={itemVariants}
            exit={{ opacity: 0, scale: 0.9 }}
            key={item._id}
            onClick={() => handleCardClick(item._id)}
            className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
          >
            {/* Image section */}
            <div className="relative w-full aspect-[4/3] bg-slate-50 overflow-hidden">
              {!imageErrors[item._id] ? (
                <img
                  src={item.coverImage.startsWith('http') ? item.coverImage : `${BASE_URL}/images/${item.coverImage}`}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out"
                  onError={() => handleImageError(item._id)}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                  <div className="text-center">
                    <svg className="w-10 h-10 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                    <p className="text-xs font-semibold">No Image</p>
                  </div>
                </div>
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Top badges/actions floating */}
              <div className="absolute top-4 right-4 flex gap-2">
                 {/* Fav icon overlaid on image */}
                 {!path && (
                   <button 
                     onClick={(e) => favRecipe(item, e)}
                     className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center hover:bg-white hover:scale-110 transition"
                   >
                     <FaHeart
                       className={favItems.some(res => res._id === item._id) ? "text-orange-500 text-lg" : "text-slate-300 text-lg hover:text-orange-500"}
                     />
                   </button>
                 )}
              </div>
            </div>

            {/* Content section */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-black leading-tight mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>
              </div>

              <div className="flex items-center justify-between text-sm font-semibold">
                <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                  <BsStopwatchFill />
                  <span>{item.time}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {!path ? (
                    <>
                      {/* Delete button for all recipes if admin, else standard */}
                      {deletingId === item._id ? (
                        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <button 
                           onClick={(e) => onDelete(item._id, e)}
                           className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition cursor-pointer"
                           title="Delete recipe"
                        >
                           <MdDelete size={18} />
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <Link
                        to={`/editRecipe/${item._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-xl transition"
                      >
                        <FaEdit size={18} />
                      </Link>
                      {deletingId === item._id ? (
                        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <button 
                           onClick={(e) => onDelete(item._id, e)}
                           className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition cursor-pointer"
                        >
                           <MdDelete size={18} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))
      }
      </AnimatePresence>
    </motion.div>
  )
}
