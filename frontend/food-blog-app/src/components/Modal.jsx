import React from 'react'

export default function Modal({ children, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      ></div>

      {/* Modal */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-900 text-white rounded-xl shadow-2xl p-6 w-[420px] max-w-[90vw] animate-fadeIn"
        >
          {children}
        </div>
      </div>
    </>
  )
}
