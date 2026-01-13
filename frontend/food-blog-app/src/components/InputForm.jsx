import React, { useState, useCallback } from 'react'
import axios from 'axios'
import BASE_URL from '../config'

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
    if (error) setError("") // Clear error when user starts typing
    if (success) setSuccess("") // Clear success when user starts typing
  }, [error, success])

  const handleOnSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    if (isLoading) return // Prevent multiple submissions
    
    // Client-side validation
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
        timeout: 15000, // 15 second timeout for better reliability
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      // Handle successful response
      if (response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        
        setSuccess(isSignUp ? "Account created successfully!" : "Login successful!")
        
        // Reset form
        setFormData({ email: "", password: "" })
        
        // Close modal after short delay to show success message
        setTimeout(() => {
          setIsOpen()
          window.location.reload() // Refresh to update navbar state
        }, 1000)
      } else {
        setError("Invalid response from server")
      }
    } catch (error) {
      console.error('Auth error:', error)
      
      // Handle different types of errors
      if (error.code === 'ECONNABORTED') {
        setError("Request timeout. Please check your internet connection.")
      } else if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.error || 
                           error.response.data?.message || 
                           "Authentication failed"
        setError(errorMessage)
      } else if (error.request) {
        // Network error
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
    setFormData({ email: "", password: "" }) // Reset form when switching modes
  }, [])

  return (
    <form
      onSubmit={handleOnSubmit}
      className="w-full text-white space-y-5"
    >
      <h2 className="text-xl font-semibold text-center">
        {isSignUp ? "Create Account" : "Welcome Back"}
      </h2>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-400">Email</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={handleInputChange('email')}
          disabled={isLoading}
          className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-400">Password</label>
        <input
          type="password"
          required
          minLength={6}
          value={formData.password}
          onChange={handleInputChange('password')}
          disabled={isLoading}
          className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {isSignUp && (
          <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}
      
      {success && (
        <p className="text-sm text-green-400 text-center">{success}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition py-2 rounded-md font-semibold flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </>
        ) : (
          isSignUp ? "Sign Up" : "Login"
        )}
      </button>

      <p
        onClick={toggleMode}
        className="text-sm text-blue-400 text-center cursor-pointer hover:underline"
      >
        {isSignUp ? "Already have an account? Login" : "Create new account"}
      </p>
    </form>
  )
}