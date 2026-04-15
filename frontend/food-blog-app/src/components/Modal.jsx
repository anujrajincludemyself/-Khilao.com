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
          className="bg-white text-slate-900 rounded-[28px] shadow-[0_30px_80px_rgba(15,23,42,0.18)] p-6 w-[92vw] max-w-lg animate-fadeIn border border-blue-100"
        >
          {children}
        </div>
      </div>
    </>
  )
}
