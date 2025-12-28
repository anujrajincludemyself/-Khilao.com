import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import InputForm from './InputForm'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  let token = localStorage.getItem("token")
  const [isLogin, setIsLogin] = useState(token ? false : true)
  let user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    setIsLogin(token ? false : true)
  }, [token])

  const checkLogin = () => {
    if (token) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setIsLogin(true)
    } else {
      setIsOpen(true)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-800 shadow-md">
        {/* ⬆ height increased slightly */}
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <h2 className="text-lg md:text-xl font-bold text-white tracking-wide leading-none ml-1">
  खाओ&lt;=&gt;Khilao.com
          </h2>


          {/* Links */}
          <ul className="flex items-center gap-6 text-white text-sm md:text-base">
            
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `pb-1 border-b-2 transition ${
                    isActive
                      ? "border-white"
                      : "border-transparent hover:border-white"
                  }`
                }
              >
                Home
              </NavLink>
            </li>

            <li onClick={() => isLogin && setIsOpen(true)}>
              <NavLink
                to={!isLogin ? "/myRecipe" : "/"}
                className="pb-1 border-b-2 border-transparent hover:border-white transition"
              >
                My Recipe
              </NavLink>
            </li>

            <li onClick={() => isLogin && setIsOpen(true)}>
              <NavLink
                to={!isLogin ? "/favRecipe" : "/"}
                className="pb-1 border-b-2 border-transparent hover:border-white transition"
              >
                Favourites
              </NavLink>
            </li>

            <li onClick={checkLogin}>
              <span className="cursor-pointer bg-white text-blue-700 px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold hover:bg-blue-100 transition">
                {isLogin ? "Login" : "Logout"}
                {user?.email ? ` (${user.email})` : ""}
              </span>
            </li>

          </ul>
        </div>
      </header>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
    </>
  )
}
