import React from 'react'
import profileImg from '../assets/profile.png'
import food from '../assets/foodRecipe.png'
import { useLoaderData } from 'react-router-dom'
import BASE_URL from '../config'

export default function RecipeDetails() {
  const recipe = useLoaderData()
  console.log(recipe)

  // Handle both old and new format
  const userEmail = recipe.createdBy?.email || recipe.email

  return (
    <div className="w-[95%] max-w-6xl mx-auto mt-8 md:mt-10 mb-8">
      <div className="rounded-4xl overflow-hidden border border-blue-100 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="p-6 md:p-8 bg-linear-to-br from-blue-50 via-white to-slate-50 border-b lg:border-b-0 lg:border-r border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={profileImg}
                alt="profile"
                className="w-12 h-12 rounded-full object-cover ring-4 ring-white shadow"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-semibold">Created by</p>
                <h5 className="text-sm font-medium text-slate-700">{userEmail}</h5>
              </div>
            </div>

            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              {recipe.title}
            </h3>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="px-3 py-1.5 rounded-full bg-blue-600 text-white">Recipe details</span>
              <span className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-800">Responsive layout</span>
            </div>

            <div className="mt-6 rounded-[28px] overflow-hidden border border-blue-100 shadow-lg bg-white">
              <img
                src={recipe.coverImage.startsWith('http') ? recipe.coverImage : `${BASE_URL}/images/${recipe.coverImage}`}
                alt={recipe.title}
                className="w-full aspect-4/3 object-cover"
              />
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Ingredients</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  {recipe.ingredients.map(item => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Quick facts</h4>
                <div className="space-y-2 text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-900">Time:</span> {recipe.time || 'N/A'}</p>
                  <p><span className="font-semibold text-slate-900">Source:</span> {recipe.createdBy?.email || 'Community'}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-4 md:p-5">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Instructions</h4>
              <p className="text-slate-600 leading-8 whitespace-pre-line">
                {recipe.instructions}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
