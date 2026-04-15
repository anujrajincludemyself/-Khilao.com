import React, { useState } from 'react'
import foodRecipe from '../assets/foodRecipe.png'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RecipeItems from "../components/RecipeItems"
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import InputForm from '../components/InputForm'

export default function Home() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const addRecipe = () => {
    let token = localStorage.getItem("token")
    if (token)
      navigate("/addRecipe")
    else {
      setIsOpen(true)
    }
  }

  const getRecipeWithAI = () => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/aiRecipe')
    } else {
      setIsOpen(true)
    }
  }

  return (
    <>
      <section className="w-[95%] max-w-7xl mx-auto mt-6 md:mt-10">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-center rounded-4xl border border-blue-100 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] overflow-hidden">
          <div className="p-7 md:p-12 lg:p-14 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Thanks for using 
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.05]">
                Discover, create, and share recipes with a polished experience.
              </h1>
              <p className="text-slate-600 text-base sm:text-lg leading-8 max-w-2xl">
                खाओ&lt;=&gt;Khilao.com gives you a clean cooking workspace to publish recipes, save favorites, and generate detailed AI recipes in a private space.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={addRecipe}
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-blue-200"
              >
                Share your recipe
              </button>

              <button
                onClick={getRecipeWithAI}
                className="inline-flex items-center justify-center bg-white hover:bg-blue-50 transition text-blue-700 border border-blue-200 px-6 py-3 rounded-2xl font-semibold shadow-sm"
              >
                Get Recipe With AI
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              {[
                // ['Private AI', 'Saved only to your account'],
                // ['Fast UI', 'Optimized for mobile and desktop'],
                // ['Production grade', 'Clean spacing and blue accents']
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                  <p className="font-semibold text-slate-900 text-sm">{title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-5">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative p-6 md:p-10 lg:p-12 bg-linear-to-br from-blue-50 via-white to-slate-50">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_35%)]"></div>
            <div className="relative max-w-md mx-auto">
              <div className="rounded-[28px] overflow-hidden border border-blue-100 bg-white shadow-[0_30px_60px_rgba(37,99,235,0.12)]">
                <div className="flex items-center justify-center bg-linear-to-b from-white to-blue-50 p-6 sm:p-8 min-h-80 sm:min-h-105">
                <img
                  src={foodRecipe}
                  alt="Food"
                  className="hero-bowl-spin w-full max-w-105 h-auto object-contain drop-shadow-[0_18px_35px_rgba(37,99,235,0.16)]"
                  loading="lazy"
                  decoding="async"
                />
                </div>
                <div className="p-5 space-y-2">
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-600">Recipe Studio</p>
                  <p className="text-lg font-bold text-slate-900">Create. Save. Revisit.</p>
                  <p className="text-sm text-slate-500 leading-6">A minimal, premium workspace built for high-trust recipe sharing and AI cooking exploration.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {[
            ['Share recipes', 'Publish your own ideas with a polished card layout'],
            ['Save favorites', 'Keep the recipes you love handy'],
            ['AI recipe studio', 'Generate detailed private recipes'],
            ['Clean UI', 'Looks great from mobile to desktop']
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-semibold text-slate-900">{title}</p>
              <p className="text-sm text-slate-500 mt-2 leading-6">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}

      {/* Recipes */}
      <div className="mt-10">
        <RecipeItems />
      </div>
    </>
  )
}
