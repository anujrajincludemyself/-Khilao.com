import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Modal({ children, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto cursor-pointer"
      />
      
      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4 pointer-events-auto"
      >
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100">
           {children}
        </div>
      </motion.div>
    </div>
  )
}
