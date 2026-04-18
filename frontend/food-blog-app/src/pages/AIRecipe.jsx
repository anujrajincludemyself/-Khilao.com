import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Navigate } from 'react-router-dom'
import BASE_URL from '../config'
import { motion, AnimatePresence } from 'framer-motion'

const defaultForm = {
  dishDescription: '',
  dietary: '',
  servings: '2'
}

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString()
}

export default function AIRecipe() {
  const token = localStorage.getItem('token')

  const [formData, setFormData] = useState(defaultForm)
  const [isLoading, setIsLoading] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(true)
  const [error, setError] = useState('')
  const [recipe, setRecipe] = useState(null)
  const [history, setHistory] = useState([])
  const [activeHistoryId, setActiveHistoryId] = useState('')

  const canSubmit = useMemo(() => formData.dishDescription.trim().length > 3, [formData.dishDescription])

  if (!token) {
    return <Navigate to="/" replace />
  }

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }

  const loadHistory = async () => {
    setIsHistoryLoading(true)
    try {
      const response = await axios.get(`${BASE_URL}/recipe/ai-history`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 15000
      })
      const items = Array.isArray(response.data) ? response.data : []
      setHistory(items)
    } catch (err) {
      console.error('Failed to load AI history:', err)
      const message = err.response?.data?.error || 'Could not load your AI recipe history right now.'
      setError(message)
    } finally {
      setIsHistoryLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const onChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (error) setError('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit || isLoading) return

    setIsLoading(true)
    setError('')

    try {
      const response = await axios.post(
        `${BASE_URL}/recipe/ai-generate`,
        {
          dishDescription: formData.dishDescription.trim(),
          dietary: formData.dietary.trim(),
          servings: formData.servings.trim() || '2'
        },
        {
          headers: authHeaders,
          timeout: 30000
        }
      )

      setRecipe(response.data.recipe)
      if (response.data.historyId) {
        setActiveHistoryId(String(response.data.historyId))
      }
      await loadHistory()
    } catch (err) {
      let message = err.response?.data?.error || 'Unable to generate recipe right now. Please try again.'

      if (err?.code === 'ERR_NETWORK') {
        message = 'Backend is not reachable. Start backend server and retry.'
      }

      if (err?.code === 'ECONNABORTED') {
        message = 'AI request timed out. Please retry with a shorter prompt.'
      }

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const openHistoryItem = (item) => {
    setRecipe(item.recipe)
    setActiveHistoryId(String(item._id))
  }

  const deleteHistoryItem = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/recipe/ai-history/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 15000
      })
      setHistory((prev) => prev.filter((item) => item._id !== id))
      if (activeHistoryId === String(id)) {
        setActiveHistoryId('')
      }
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to delete this recipe history item.'
      setError(message)
    }
  }

  return (
    <motion.div 
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.6 }}
       className="w-[95%] max-w-[1400px] mx-auto mt-6 mb-12"
    >
      <div className="rounded-[3rem] overflow-hidden border border-slate-100 shadow-[0_30px_80px_rgba(15,23,42,0.08)] bg-white relative">
        
        {/* Header */}
        <div className="px-8 md:px-12 py-10 border-b border-slate-100 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-[100px] -z-10 opacity-60 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-[100px] -z-10 opacity-60 -translate-x-1/2 translate-y-1/2"></div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black mb-3">AI Recipe <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">Studio</span></h1>
          <p className="text-slate-500 max-w-3xl text-lg font-medium">
            Describe your ideal dish and let AI craft a detailed recipe instantly. 
            All creations are saved securely to your private workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr_340px] gap-0">
          
          {/* Left Column: Form */}
          <section className="p-8 border-b xl:border-b-0 xl:border-r border-slate-100 bg-slate-50/50">
            <div className="xl:sticky xl:top-24">
              <h2 className="text-xl font-bold text-black mb-1">Generate Recipe</h2>
              <p className="text-sm text-slate-500 mb-6 font-medium">
                Add your cravings and dietary needs.
              </p>

              <form onSubmit={onSubmit} className="space-y-5 flex flex-col h-full">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Dish Description</label>
                  <textarea
                    value={formData.dishDescription}
                    onChange={onChange('dishDescription')}
                    rows={5}
                    required
                    placeholder="E.g., Authentic biryani with smoked flavor..."
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 bg-white shadow-sm transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Dietary Preferences</label>
                  <input
                    type="text"
                    value={formData.dietary}
                    onChange={onChange('dietary')}
                    placeholder="gluten-free, high-protein"
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 bg-white shadow-sm transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Servings</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.servings}
                    onChange={onChange('servings')}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 bg-white shadow-sm transition-all"
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="text-sm font-semibold text-red-500 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={!canSubmit || isLoading}
                  className="w-full group relative overflow-hidden rounded-2xl bg-black py-4 font-bold text-white transition-all hover:scale-[1.02] shadow-lg shadow-black/10 disabled:opacity-70 disabled:hover:scale-100 mt-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                     {isLoading ? (
                       <>
                         <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                         Generating Magic...
                       </>
                     ) : (
                       'Generate Recipe'
                     )}
                  </span>
                </button>
              </form>
            </div>
          </section>

          {/* Middle Column: Results */}
          <section className="p-8 bg-white min-h-[600px] xl:border-r border-slate-100">
            <AnimatePresence mode="wait">
               {!recipe ? (
                 <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex items-center justify-center text-center p-8 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50"
                 >
                   <div>
                     <p className="text-2xl font-black text-black mb-2">Workspace Empty</p>
                     <p className="text-slate-500 font-medium">Describe a dish on the left, or select history on the right.</p>
                   </div>
                 </motion.div>
               ) : (
                 <motion.div 
                    key={recipe.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                 >
                   <div>
                     <h3 className="text-4xl font-black text-black leading-tight mb-3">{recipe.title}</h3>
                     {recipe.description && <p className="text-slate-600 font-medium text-lg border-l-4 border-orange-500 pl-4">{recipe.description}</p>}
                     
                     <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
                       <span className="px-3 py-1.5 rounded-lg bg-orange-100 text-orange-800 border border-orange-200">Total: {recipe.totalTime}</span>
                       {recipe.prepTime && <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800">Prep: {recipe.prepTime}</span>}
                       {recipe.cookTime && <span className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800">Cook: {recipe.cookTime}</span>}
                       <span className="px-3 py-1.5 rounded-lg bg-black text-white">Serves {recipe.servings}</span>
                     </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-6">
                     <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                       <h4 className="font-black text-black text-lg mb-4">Ingredients</h4>
                       <ul className="space-y-3">
                         {recipe.ingredients?.map((ing, idx) => (
                           <li key={idx} className="flex gap-3 text-slate-700 font-medium pb-2 border-b border-slate-200/50 last:border-0 last:pb-0">
                             <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                             <div>
                                <span className="text-black font-bold">{ing.item}</span>
                                {ing.quantity ? ` - ${ing.quantity}` : ''}
                                {ing.notes ? <span className="text-slate-500 text-sm ml-1">({ing.notes})</span> : ''}
                             </div>
                           </li>
                         ))}
                       </ul>
                     </div>

                     <div className="space-y-6">
                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                           <h4 className="font-black text-black text-lg mb-4">Equipment</h4>
                           <ul className="space-y-2">
                             {(recipe.equipment || []).map((item, idx) => (
                               <li key={idx} className="flex gap-2 text-slate-700 font-medium">
                                  <span className="text-blue-500">•</span> {item}
                               </li>
                             ))}
                           </ul>
                        </div>
                        <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100">
                           <h4 className="font-black text-orange-900 text-lg mb-4">Nutrition Facts</h4>
                           <ul className="grid grid-cols-2 gap-4">
                             <li className="flex flex-col"><span className="text-orange-900/60 text-xs font-bold uppercase">Calories</span> <span className="font-black text-orange-900 text-xl">{recipe.nutrition?.calories || 'N/A'}</span></li>
                             <li className="flex flex-col"><span className="text-orange-900/60 text-xs font-bold uppercase">Protein</span> <span className="font-black text-orange-900 text-xl">{recipe.nutrition?.protein || 'N/A'}</span></li>
                             <li className="flex flex-col"><span className="text-orange-900/60 text-xs font-bold uppercase">Carbs</span> <span className="font-black text-orange-900 text-xl">{recipe.nutrition?.carbs || 'N/A'}</span></li>
                             <li className="flex flex-col"><span className="text-orange-900/60 text-xs font-bold uppercase">Fats</span> <span className="font-black text-orange-900 text-xl">{recipe.nutrition?.fats || 'N/A'}</span></li>
                           </ul>
                        </div>
                     </div>
                   </div>

                   <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                     <h4 className="font-black text-black text-xl mb-6">Step-by-Step Cooking</h4>
                     <ol className="space-y-6">
                       {recipe.steps?.map((step, idx) => (
                         <li key={idx} className="flex gap-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-bold shrink-0">{idx + 1}</span>
                            <span className="text-slate-700 font-medium leading-relaxed pt-1">{step}</span>
                         </li>
                       ))}
                     </ol>
                   </div>
                 </motion.div>
               )}
            </AnimatePresence>
          </section>

          {/* Right Column: History */}
          <section className="p-6 bg-slate-50/50">
            <div className="xl:sticky xl:top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">History</h2>
                <button
                  onClick={loadHistory}
                  className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                >
                  Refresh
                </button>
              </div>

              {isHistoryLoading ? (
                <div className="text-sm font-medium text-slate-500 animate-pulse">Loading history...</div>
              ) : history.length === 0 ? (
                <div className="text-sm font-medium text-slate-500 p-4 border border-dashed border-slate-300 rounded-2xl bg-white">
                  No history available.
                </div>
              ) : (
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                  {history.map((item) => (
                    <motion.article
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={item._id}
                      className={`relative rounded-2xl border p-4 transition-all group overflow-hidden cursor-pointer ${
                        activeHistoryId === String(item._id)
                          ? 'border-orange-500 bg-white shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                      }`}
                      onClick={() => openHistoryItem(item)}
                    >
                      {activeHistoryId === String(item._id) && (
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-2xl"></div>
                      )}
                      <h3 className="font-bold text-black text-sm mb-1 line-clamp-1 pr-6">
                        {item.recipe?.title || item.query?.dishDescription || 'Untitled Recipe'}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                        {item.query?.dishDescription}
                      </p>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{formatDate(item.createdAt)}</span>
                         <button
                           onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item._id) }}
                           className="text-[10px] font-bold text-red-500 hover:text-white hover:bg-red-500 px-2 py-1 rounded-md transition opacity-0 group-hover:opacity-100"
                         >
                           DELETE
                         </button>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  )
}
