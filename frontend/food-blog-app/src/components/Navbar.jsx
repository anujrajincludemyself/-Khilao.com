import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import InputForm from './InputForm'
import { NavLink } from 'react-router-dom'
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  let token = localStorage.getItem("token")
  const [isLogin, setIsLogin] = useState(token ? false : true)
  let user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    setIsLogin(token ? false : true)
  }, [token])

  const checkLogin = () => {
    setMenuOpen(false)
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
      <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/85 backdrop-blur-xl shadow-[0_10px_30px_rgba(59,130,246,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-3 shrink-0" onClick={() => setMenuOpen(false)}>
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-black shadow-lg shadow-blue-200">
              K
            </div>
            <div className="leading-tight">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">खाओ&lt;=&gt;Khilao.com</h2>
              <p className="text-[11px] text-slate-500 hidden sm:block">Recipe sharing, AI generation, and discovery</p>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={() => setMenuOpen(prev => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm"
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenuAlt3 className="text-2xl" />}
          </button>

          <nav className="hidden lg:flex items-center gap-2">
            <NavItems isLogin={isLogin} setIsOpen={setIsOpen} onAction={checkLogin} />
          </nav>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-blue-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
              <nav className="flex flex-col gap-2">
                <NavItems isLogin={isLogin} setIsOpen={setIsOpen} onAction={checkLogin} mobile onNavigate={() => setMenuOpen(false)} />
              </nav>
            </div>
          </div>
        )}
      </header>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
    </>
  )
}

function NavItems({ isLogin, setIsOpen, onAction, mobile = false, onNavigate }) {
  const base = mobile
    ? 'w-full flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition'
    : 'px-4 py-2 rounded-full text-sm font-semibold transition'

  const linkClass = ({ isActive }) =>
    `${base} ${
      isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
        : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
    }`

  const gatedTo = (path) => (isLogin ? '/' : path)

  return (
    <>
      <NavLink to="/" className={linkClass} onClick={onNavigate}>
        Home
      </NavLink>

      <NavLink to={gatedTo('/myRecipe')} className={linkClass} onClick={isLogin ? () => setIsOpen(true) : onNavigate}>
        My Recipe
      </NavLink>

      <NavLink to={gatedTo('/favRecipe')} className={linkClass} onClick={isLogin ? () => setIsOpen(true) : onNavigate}>
        Favourites
      </NavLink>

      <NavLink to={gatedTo('/aiRecipe')} className={linkClass} onClick={isLogin ? () => setIsOpen(true) : onNavigate}>
        AI Recipe
      </NavLink>

      <button
        type="button"
        onClick={() => {
          onAction()
          if (onNavigate) onNavigate()
        }}
        className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${
          mobile
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
        }`}
      >
        {isLogin ? 'Login' : 'Logout'}
      </button>
    </>
  )
}
