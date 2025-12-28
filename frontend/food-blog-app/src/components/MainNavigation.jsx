import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'

export default function MainNavigation() {
  return (
<div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-10">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

    </div>
  )
}
