import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-blue-100 bg-white/90 backdrop-blur-xl text-sm text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          Crafted with <span className="font-semibold text-blue-700">Love</span> by <span className="font-semibold text-slate-900"> byAnujraj</span>
        </p>
        <p className="text-xs text-slate-400"></p>
      </div>
    </footer>
  )
}
