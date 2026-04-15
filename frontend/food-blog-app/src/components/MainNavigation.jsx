import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'

export default function MainNavigation() {
  return (
    <div className="app-shell min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-8 pb-24">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
