import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditRecipe() {
  const [recipeData, setRecipeData] = useState({})
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const getData = async () => {
      await axios.get(`http://localhost:5000/recipe/${id}`)
        .then(response => {
          let res = response.data
          setRecipeData({
            title: res.title,
            ingredients: res.ingredients.join(","),
            instructions: res.instructions,
            time: res.time
          })
        })
    }
    getData()
  }, [])

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
    await axios.put(
      `http://localhost:5000/recipe/${id}`,
      recipeData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': 'bearer ' + localStorage.getItem("token")
        }
      }
    ).then(() => navigate("/myRecipe"))
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
          Edit Recipe
        </button>
      </form>
    </div>
  )
}
