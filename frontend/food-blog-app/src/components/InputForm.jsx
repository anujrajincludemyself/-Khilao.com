import React, { useState } from 'react'
import axios from 'axios'

const BASE_URL = "https://khilao-com.onrender.com"

export default function InputForm({ setIsOpen }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")

  const handleOnSubmit = async (e) => {
    e.preventDefault()

    let endpoint = isSignUp ? "signUp" : "login"

    await axios.post(`${BASE_URL}/${endpoint}`, { email, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("user", JSON.stringify(res.data.user))
        setIsOpen()
      })
      .catch(data => setError(data.response?.data?.error))
  }

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
          onChange={(e) => setEmail(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-400">Password</label>
        <input
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded-md font-semibold"
      >
        {isSignUp ? "Sign Up" : "Login"}
      </button>

      <p
        onClick={() => setIsSignUp(prev => !prev)}
        className="text-sm text-blue-400 text-center cursor-pointer hover:underline"
      >
        {isSignUp ? "Already have an account? Login" : "Create new account"}
      </p>
    </form>
  )
}

//aise he