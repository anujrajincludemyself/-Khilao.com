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

  return (
    <>
      {/* Hero Section */}
      <section className="w-[90%] mx-auto mt-24 flex flex-col md:flex-row items-center gap-16">
        
        {/* Left */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-bold text-slate-800">
            Food Recipe
          </h1>

          <p className="text-slate-600 leading-relaxed">
            खाओ&lt;=&gt;Khilao.com helps you find and share amazing recipes with ease.
            Whether you are a beginner or a passionate home cook, you can explore new dishes,
            save your favorite recipes, and share your own cooking ideas with others.
            Cook, share, and enjoy food together.
          </p>

          <button
            onClick={addRecipe}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-md font-medium"
          >
            Share your recipe
          </button>
        </div>

        {/* Right */}
        <div className="flex-1 flex justify-center">
          <img
            src={foodRecipe}
            alt="Food"
            className="w-[320px] h-auto"
          />
        </div>
      </section>

      {/* Wave */}
      <div className="mt-16">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#d4f6e8"
            fillOpacity="1"
            d="M0,32L40,32C80,32,160,32,240,58.7C320,85,400,139,480,149.3C560,160,640,128,720,101.3C800,75,880,53,960,80C1040,107,1120,181,1200,213.3C1280,245,1360,235,1400,229.3L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          />
        </svg>
      </div>

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
