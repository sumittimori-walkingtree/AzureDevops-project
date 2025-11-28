"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false)
  
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false)
      }, 2000)
      
      return () => clearTimeout(timeout)
    }
  }, [copied])
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }
  
  return (
    <motion.button
      onClick={handleCopy}
      className="relative inline-flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors"
      aria-label={`Copy ${label}`}
      title={`Copy ${label}`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      {copied ? (
        <>
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-green-500" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </motion.svg>
          <motion.span 
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-80"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            Copied!
          </motion.span>
        </>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
        </svg>
      )}
    </motion.button>
  )
} 