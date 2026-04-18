import React, { useState, useCallback } from 'react'
import axios from 'axios'
import BASE_URL from '../config'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineX } from 'react-icons/hi'

export default function InputForm({ setIsOpen }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")

  const handleInputChange = useCallback((field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    if (error) setError("")
    if (success) setSuccess("")
  }, [error, success])

  const handleOnSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    if (isLoading) return
    
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Email and password are required")
      return
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }
    
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const endpoint = isSignUp ? "signUp" : "login"
      const response = await axios.post(`${BASE_URL}/${endpoint}`, formData, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        
        setSuccess(isSignUp ? "Account created successfully!" : "Login successful!")
        
        setFormData({ email: "", password: "" })
        
        setTimeout(() => {
          setIsOpen()
          window.location.reload()
        }, 1000)
      } else {
        setError("Invalid response from server")
      }
    } catch (error) {
      console.error('Auth error:', error)
      if (error.code === 'ECONNABORTED') {
        setError("Request timeout. Please check your internet connection.")
      } else if (error.response) {
        const errorMessage = error.response.data?.error || 
                           error.response.data?.message || 
                           "Authentication failed"
        setError(errorMessage)
      } else if (error.request) {
        setError("Network error. Please check your connection.")
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }, [formData, isSignUp, isLoading, setIsOpen])

  const toggleMode = useCallback(() => {
    setIsSignUp(prev => !prev)
    setError("")
    setSuccess("")
    setFormData({ email: "", password: "" })
  }, [])

  return (
    <div className="relative p-8 md:p-10 w-full text-slate-900 bg-white">
      {/* Close Button placed absolutely relative to container in Modal if needed. We put it here for simplicity. */}
      <button 
         type="button" 
         onClick={setIsOpen} 
         className="absolute top-6 right-6 p-2 rounded-full bg-slate-50 text-slate-400 hover:text-black hover:bg-slate-100 transition"
      >
         <HiOutlineX size={20} />
      </button>

      <form onSubmit={handleOnSubmit} className="space-y-6 mt-2">
         <motion.div 
            key={isSignUp ? "signup" : "login"}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
         >
           <h2 className="text-3xl font-black tracking-tight text-black">
             {isSignUp ? "Join Us" : "Welcome Back"}
           </h2>
           <p className="text-sm font-medium text-slate-500">
             {isSignUp ? "Create an account to save your AI recipes." : "Sign in to access your personal recipe studio."}
           </p>
         </motion.div>

         <div className="flex flex-col gap-4">
           {/* Email Input */}
           <div className="relative group">
             <input
               type="email"
               required
               value={formData.email}
               onChange={handleInputChange('email')}
               disabled={isLoading}
               placeholder=" "
               className="peer w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 pt-6 pb-2 text-sm outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 disabled:opacity-50 transition-all shadow-sm"
             />
             <label className="absolute left-4 top-4 text-slate-400 text-sm transition-all peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-orange-600 peer-[&:not(:placeholder-shown)]:-translate-y-2.5 peer-[&:not(:placeholder-shown)]:scale-75 pointer-events-none origin-left font-medium">
               Email address
             </label>
           </div>

           {/* Password Input */}
           <div className="relative group">
             <input
               type="password"
               required
               minLength={6}
               value={formData.password}
               onChange={handleInputChange('password')}
               disabled={isLoading}
               placeholder=" "
               className="peer w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 pt-6 pb-2 text-sm outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 disabled:opacity-50 transition-all shadow-sm"
             />
             <label className="absolute left-4 top-4 text-slate-400 text-sm transition-all peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-orange-600 peer-[&:not(:placeholder-shown)]:-translate-y-2.5 peer-[&:not(:placeholder-shown)]:scale-75 pointer-events-none origin-left font-medium">
               Password
             </label>
             {isSignUp && (
               <p className="text-xs text-slate-400 mt-2 ml-1 font-medium">At least 6 characters</p>
             )}
           </div>
         </div>

         <AnimatePresence>
            {error && (
               <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-sm font-semibold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">{error}</motion.p>
            )}
            {success && (
               <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-sm font-semibold text-green-600 bg-green-50 p-3 rounded-xl border border-green-100">{success}</motion.p>
            )}
         </AnimatePresence>

         <button
           type="submit"
           disabled={isLoading}
           className="group relative w-full overflow-hidden rounded-2xl bg-black py-4 font-bold text-white transition-all hover:scale-[1.02] shadow-[0_10px_40px_rgba(0,0,0,0.15)] disabled:opacity-70 disabled:hover:scale-100"
         >
           <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
           <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                isSignUp ? "Sign Up" : "Login"
              )}
           </span>
         </button>

         <div className="text-center pt-2 gap-2 flex flex-col">
            <span className="h-px w-full bg-slate-100 my-2"></span>
            <p className="text-sm text-slate-500 font-medium">
               {isSignUp ? "Already a member?" : "New to Khilao?"}
               <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-1 text-orange-600 hover:text-orange-700 font-bold outline-none underline-offset-4 hover:underline transition"
               >
                  {isSignUp ? "Login instead" : "Create account"}
               </button>
            </p>
         </div>
      </form>
    </div>
  )
}