import React, { useState } from 'react'
import foodRecipe from '../assets/foodRecipe.png'
import RecipeItems from "../components/RecipeItems"
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  const addRecipe = () => {
    let token = localStorage.getItem("token")
    if (token) navigate("/addRecipe")
    else {
      // Logic for modal goes here but modal state is now managed mostly in Navbar,
      // The original code passed a local isOpen to Modal. Since we removed local modal from Home 
      // to keep it unified, we can just trigger a custom event or navigate to login.
      // For simplicity here, alert or redirect if not logged in.
      window.dispatchEvent(new Event('open-login-modal'));
    }
  }

  const getRecipeWithAI = () => {
    const token = localStorage.getItem('token')
    if (token) navigate('/aiRecipe')
    else {
      window.dispatchEvent(new Event('open-login-modal'));
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-[95%] max-w-7xl mx-auto mt-2 md:mt-4 overflow-hidden"
    >
      <section className="relative">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-4 md:gap-6 items-stretch">

          {/* Main Hero Card */}
          <div className="relative p-8 md:p-14 rounded-[2.5rem] md:rounded-[3rem] bg-white border border-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.04)] overflow-hidden isolate flex flex-col justify-center">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-orange-100 rounded-full blur-[80px] -z-10 opacity-70"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-100 rounded-full blur-[80px] -z-10 opacity-70"></div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-2 text-xs font-bold text-orange-600 mb-8 self-start border border-orange-100/50"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
              Khilao Premium Experience
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
              className="text-[2.5rem] sm:text-6xl lg:text-7xl font-black tracking-tighter text-black leading-[0.95] mb-6"
            >
              Imagine <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">great tasting.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-slate-500 text-lg sm:text-xl leading-relaxed max-w-lg mb-10 font-medium"
            >
              A beautifully crafted, high-trust environment to explore, generate with AI, and curate your ultimate recipe collection.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <button
                onClick={addRecipe}
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-black px-8 font-bold text-white transition-all hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <span className="relative z-10">Share Recipe</span>
              </button>

              <button
                onClick={getRecipeWithAI}
                className="inline-flex h-14 items-center justify-center rounded-full bg-white border-2 border-slate-100 px-8 font-bold text-slate-800 transition hover:bg-slate-50 hover:border-blue-100"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                  Generate with AI ✨
                </span>
              </button>
            </motion.div>
          </div>

          {/* Right Image / Bento Card */}
          <div className="flex flex-col gap-4 md:gap-6">
            <div
              className="relative flex-1 rounded-[2.5rem] bg-slate-50 overflow-hidden flex items-center justify-center min-h-[300px] border border-slate-100"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Decorative grid background */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTUsMjMsNDIsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] opacity-100 -z-0"></div>

              <motion.div
                animate={{
                  y: isHovered ? -10 : 0,
                  scale: isHovered ? 1.05 : 1
                }}
                transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                className="relative z-10 w-full max-w-[80%]"
              >
                <img
                  src={foodRecipe}
                  alt="Delicious Food"
                  className="hero-bowl-spin w-full h-auto object-contain drop-shadow-[0_40px_80px_rgba(249,115,22,0.25)]"
                />
              </motion.div>
            </div>

            {/* Stats/Info Cards */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="rounded-[2rem] bg-orange-50 border border-orange-100/50 p-6 flex flex-col justify-end min-h-[140px] group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h3 className="text-3xl font-black text-orange-600 mb-1 leading-none">100%</h3>
                <p className="text-sm font-semibold text-orange-900/60 block">Private AI generation</p>
              </div>
              <div className="rounded-[2rem] bg-blue-50 border border-blue-100/50 p-6 flex flex-col justify-end min-h-[140px] group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h3 className="text-3xl font-black text-blue-600 mb-1 leading-none">Foodie</h3>
                <p className="text-sm font-semibold text-blue-900/60 block">Are you the one</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Recipes Section */}
      <div className="mt-16 md:mt-24 mb-10">
        <div className="flex items-end justify-between mb-8 px-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-black">Trending <span className="text-orange-500">Recipes</span></h2>
            <p className="text-slate-500 font-medium mt-2">Discover what the community is cooking</p>
          </div>
        </div>
        <RecipeItems />
      </div>
    </motion.div>
  )
}
