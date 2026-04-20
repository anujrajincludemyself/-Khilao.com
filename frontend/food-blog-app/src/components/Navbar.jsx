import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import InputForm from './InputForm'
import { NavLink, useLocation } from 'react-router-dom'
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  let token = localStorage.getItem("token")
  const [isLogin, setIsLogin] = useState(token ? false : true)
  let user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    setIsLogin(token ? false : true)
  }, [token])

  useEffect(() => {
    const handleOpenLogin = () => setIsOpen(true)
    window.addEventListener('open-login-modal', handleOpenLogin)
    return () => window.removeEventListener('open-login-modal', handleOpenLogin)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-in-out ${scrolled
            ? 'py-3'
            : 'py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`flex items-center justify-between h-16 px-6 transition-all duration-300 rounded-[2rem] border border-white/20 ${scrolled ? 'glass shadow-[0_8px_32px_rgba(15,23,42,0.08)]' : 'bg-white/50 backdrop-blur-md shadow-sm'}`}>

            {/* Logo */}
            <NavLink to="/" className="flex items-center shrink-0 group" onClick={() => setMenuOpen(false)}>
              <img
                src="/logo.png"
                alt="Khilao logo"
                className="h-11 sm:h-12 w-auto object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </NavLink>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen(prev => !prev)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50/50 text-orange-600 hover:bg-orange-100 transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                    <HiOutlineX className="text-2xl" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
                    <HiOutlineMenuAlt3 className="text-2xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <NavItems isLogin={isLogin} setIsOpen={setIsOpen} onAction={checkLogin} />
            </nav>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden px-4 sm:px-6 absolute w-full top-full mt-2 overflow-hidden"
            >
              <div className="glass rounded-[2rem] p-4 flex flex-col gap-2 shadow-xl shadow-slate-200/50">
                <NavItems isLogin={isLogin} setIsOpen={setIsOpen} onAction={checkLogin} mobile onNavigate={() => setMenuOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacing for fixed header */}
      <div className="h-28"></div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <Modal onClose={() => setIsOpen(false)}>
            <InputForm setIsOpen={() => setIsOpen(false)} />
          </Modal>
        )}
      </AnimatePresence>
    </>
  )
}

function NavItems({ isLogin, setIsOpen, onAction, mobile = false, onNavigate }) {
  const location = useLocation();

  const base = mobile
    ? 'w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition relative z-10'
    : 'px-5 py-2.5 rounded-full text-sm font-bold transition relative z-10 flex items-center justify-center overflow-hidden'

  const linkClass = ({ isActive }) =>
    `${base} ${isActive
      ? (mobile ? 'text-orange-600 bg-orange-50' : 'text-white')
      : 'text-slate-600 hover:text-slate-900'
    }`

  const gatedTo = (path) => (isLogin ? '/' : path)

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'My Recipe', path: '/myRecipe', gated: true },
    { name: 'Favourites', path: '/favRecipe', gated: true },
    { name: 'AI Recipe', path: '/aiRecipe', gated: true }
  ];

  return (
    <>
      {navLinks.map((link) => {
        const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
        const finalPath = link.gated ? gatedTo(link.path) : link.path;
        return (
          <NavLink
            key={link.name}
            to={finalPath}
            className={linkClass}
            onClick={link.gated && isLogin ? (e) => { e.preventDefault(); setIsOpen(true); } : onNavigate}
          >
            {link.name}
            {!mobile && isActive && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-black rounded-full -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {!mobile && !isActive && (
              <span className="absolute inset-0 bg-slate-100 rounded-full scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all -z-10"></span>
            )}
          </NavLink>
        )
      })}

      <div className={`h-4 w-px bg-slate-200 mx-2 hidden lg:block`}></div>

      <button
        type="button"
        onClick={() => {
          onAction()
          if (onNavigate) onNavigate()
        }}
        className={`relative inline-flex items-center justify-center rounded-full px-7 py-2.5 text-sm font-bold transition overflow-hidden group ${mobile
            ? 'mt-2 w-full bg-orange-500 text-white shadow-lg shadow-orange-200'
            : 'bg-black text-white hover:shadow-lg hover:-translate-y-0.5'
          }`}
      >
        <span className="relative z-10">{isLogin ? 'Login' : 'Logout'}</span>
        {!mobile && <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>}
      </button>
    </>
  )
}
