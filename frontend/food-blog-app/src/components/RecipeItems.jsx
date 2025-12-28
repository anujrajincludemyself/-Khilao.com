import React, { useEffect, useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { BsStopwatchFill } from "react-icons/bs"
import { FaHeart } from "react-icons/fa6"
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import axios from 'axios'

export default function RecipeItems() {
  const recipes = useLoaderData()
  const [allRecipes, setAllRecipes] = useState()
  let path = window.location.pathname === "/myRecipe"
  let favItems = JSON.parse(localStorage.getItem("fav")) ?? []
  const [isFavRecipe, setIsFavRecipe] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setAllRecipes(recipes)
  }, [recipes])

  const onDelete = async (id) => {
    await axios.delete(`http://localhost:5000/recipe/${id}`)
    setAllRecipes(recipes => recipes.filter(recipe => recipe._id !== id))
    let filterItem = favItems.filter(recipe => recipe._id !== id)
    localStorage.setItem("fav", JSON.stringify(filterItem))
  }

  const favRecipe = (item) => {
    let filterItem = favItems.filter(recipe => recipe._id !== item._id)
    favItems = favItems.some(recipe => recipe._id === item._id)
      ? filterItem
      : [...favItems, item]

    localStorage.setItem("fav", JSON.stringify(favItems))
    setIsFavRecipe(pre => !pre)
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
            <img
              src={`http://localhost:5000/images/${item.coverImage}`}
              alt={item.title}
              className="w-full h-36 object-cover"
            />

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
                      <MdDelete
                        onClick={() => onDelete(item._id)}
                        className="text-red-500 hover:text-red-600 transition cursor-pointer"
                      />
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
