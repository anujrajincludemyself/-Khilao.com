import React, { useState } from 'react'
import profileImg from '../assets/profile.png'
import { useLoaderData } from 'react-router-dom'
import BASE_URL from '../config'
import { motion } from 'framer-motion'
import { BsStopwatchFill } from "react-icons/bs"
import { FaHeart } from "react-icons/fa6"

export default function RecipeDetails() {
  const recipe = useLoaderData()
  const userEmail = recipe.createdBy?.email || recipe.email || 'Community Chef'
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div 
       initial={{ opacity: 0, y: 30 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.6, ease: "easeOut" }}
       className="w-[95%] max-w-5xl mx-auto mt-4 md:mt-8 mb-12"
    >
       {/* Hero Cover */}
       <div className="relative w-full h-[50vh] min-h-[400px] rounded-[3rem] bg-black overflow-hidden shadow-2xl shadow-orange-500/10 mb-8 border border-slate-100">
          {!imgError ? (
             <motion.img
               initial={{ scale: 1.1 }}
               animate={{ scale: 1 }}
               transition={{ duration: 1.5, ease: "easeOut" }}
               src={recipe.coverImage.startsWith('http') ? recipe.coverImage : `${BASE_URL}/images/${recipe.coverImage}`}
               alt={recipe.title}
               className="w-full h-full object-cover opacity-80"
               onError={() => setImgError(true)}
             />
          ) : (
             <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                <span className="text-white/50">No cover image available</span>
             </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-14">
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 mb-4"
             >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-lg border-2 border-white shadow-lg">
                   {userEmail.charAt(0).toUpperCase()}
                </div>
                <div className="text-white/80 text-sm font-semibold tracking-wide uppercase">
                   Recipe by <span className="text-white">{userEmail.split('@')[0]}</span>
                </div>
             </motion.div>

             <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-6xl font-black text-white leading-tight max-w-3xl drop-shadow-xl"
             >
                {recipe.title}
             </motion.h1>
          </div>
       </div>

       {/* Content Grid */}
       <div className="grid lg:grid-cols-[1fr_2fr] gap-8 md:gap-12 pl-2">
          
          {/* Left Sidebar: Ingredients & Info */}
          <div className="space-y-8">
             <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-sm"
             >
                <div className="flex items-center gap-3 mb-6 text-slate-900">
                   <BsStopwatchFill size={24} className="text-orange-500"/>
                   <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Time</p>
                      <p className="text-lg font-black">{recipe.time || 'N/A'}</p>
                   </div>
                </div>

                <div className="flex items-center gap-3 mb-6 text-slate-900">
                   <FaHeart size={24} className="text-orange-500"/>
                   <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Likes</p>
                      <p className="text-lg font-black">{recipe.likesCount || 0}</p>
                   </div>
                </div>
                
                <h3 className="text-xl font-black text-black mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
                   Ingredients
                   <span className="text-orange-500 bg-orange-50 px-2 py-1 rounded-lg text-sm">{recipe.ingredients.length} items</span>
                </h3>
                
                <ul className="space-y-4">
                   {recipe.ingredients.map((item, idx) => (
                      <li key={idx} className="flex gap-4 items-start group">
                         <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-orange-500 group-hover:bg-orange-50 transition-colors">
                            <span className="w-2 h-2 rounded-full bg-transparent group-hover:bg-orange-500 transition-colors"></span>
                         </div>
                         <span className="text-slate-700 font-medium leading-relaxed">{item}</span>
                      </li>
                   ))}
                </ul>
             </motion.div>
          </div>

          {/* Right Main: Instructions */}
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.6 }}
             className="pt-2"
          >
             <h2 className="text-3xl font-black text-black mb-8 border-b-4 border-black inline-block pb-2 pr-4">Instructions</h2>
             <div className="prose prose-lg max-w-none text-slate-700 font-medium leading-loose prose-p:mb-6 prose-strong:text-black marker:text-orange-500 prose-ol:space-y-4 whitespace-pre-line text-[1.05rem]">
                {recipe.instructions}
             </div>
          </motion.div>
          
       </div>
    </motion.div>
  )
}
