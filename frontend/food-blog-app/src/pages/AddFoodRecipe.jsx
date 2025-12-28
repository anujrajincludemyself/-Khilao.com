import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ✅ add this one line
const BASE_URL = "https://khilao-com.onrender.com";

export default function AddFoodRecipe() {
  const [recipeData, setRecipeData] = useState({})
  const navigate = useNavigate()

  const onHandleChange = (e) => {
    let val =
      (e.target.name === "ingredients")
        ? e.target.value.split(",")
        : (e.target.name === "file")
          ? e.target.files[0]
          : e.target.value

    setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
  }

  const onHandleSubmit = async (e) => {
    e.preventDefault()
    console.log(recipeData)

    await axios.post(
      `${BASE_URL}/recipe`,
      recipeData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': 'bearer ' + localStorage.getItem("token")
        }
      }
    ).then(() => navigate("/"))
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
            onChange={onHandleChange}
            className="text-sm text-gray-300 file:bg-slate-800 file:border-0 file:rounded-md file:px-3 file:py-1 file:text-white file:cursor-pointer"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded-md font-semibold mt-2"
        >
          Add Recipe
        </button>
      </form>
    </div>
  )
}
