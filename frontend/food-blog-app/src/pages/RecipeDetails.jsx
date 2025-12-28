import React from 'react'
import profileImg from '../assets/profile.png'
import food from '../assets/foodRecipe.png'
import { useLoaderData } from 'react-router-dom'

// ✅ add this line
const BASE_URL = "https://khilao-com.onrender.com";

export default function RecipeDetails() {
  const recipe = useLoaderData()
  console.log(recipe)

  return (
    <div className="w-[70%] mx-auto mt-24 space-y-6">

      {/* Profile */}
      <div className="flex items-center gap-3">
        <img
          src={profileImg}
          alt="profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <h5 className="text-slate-600 text-sm">
          {recipe.email}
        </h5>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-slate-800">
        {recipe.title}
      </h3>

      {/* Image */}
      <img
        src={`${BASE_URL}/images/${recipe.coverImage}`}
        alt={recipe.title}
        className="w-[220px] h-[200px] object-cover rounded-lg shadow-md"
      />

      {/* Details */}
      <div className="flex flex-col md:flex-row gap-10">

        {/* Ingredients */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-slate-700 mb-2">
            Ingredients
          </h4>
          <ul className="list-disc list-inside text-slate-600 space-y-1">
            {recipe.ingredients.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-slate-700 mb-2">
            Instructions
          </h4>
          <p className="text-slate-600 leading-relaxed">
            {recipe.instructions}
          </p>
        </div>

      </div>
    </div>
  )
}
