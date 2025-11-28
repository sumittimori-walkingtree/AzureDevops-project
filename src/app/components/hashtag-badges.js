"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

// Array of creative color combinations for the badges
const BADGE_COLORS = [
  "bg-gradient-to-r from-pink-500 to-purple-500 text-white",
  "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
  "bg-gradient-to-r from-green-400 to-teal-500 text-white",
  "bg-gradient-to-r from-blue-400 to-indigo-500 text-white",
  "bg-gradient-to-r from-red-400 to-pink-500 text-white",
  "bg-gradient-to-r from-purple-400 to-indigo-500 text-white",
  "bg-gradient-to-r from-teal-400 to-cyan-500 text-white",
  "bg-gradient-to-r from-amber-400 to-yellow-500 text-white",
]

export function HashtagBadges({ hashtags }) {
  const [copied, setCopied] = useState(false)
  
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false)
      }, 2000)
      
      return () => clearTimeout(timeout)
    }
  }, [copied])
  
  const copyAllHashtags = async () => {
    try { 
      const hashtagsText = hashtags.map(tag => `#${tag}`).join(" • ")
      await navigator.clipboard.writeText(hashtagsText)
      setCopied(true)
    } catch (err) {
      console.error("Failed to copy hashtags: ", err)
    }
  }
  
  // Get a color based on the hashtag text to ensure consistency
  const getColorForHashtag = (hashtag) => {
    const index = hashtag.length % BADGE_COLORS.length
    return BADGE_COLORS[index]
  }
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Trending Hashtags
        </h3>
        <motion.button
          onClick={copyAllHashtags}
          className="relative flex items-center gap-1 px-3 py-1 text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-md transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? (
            <>
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                viewBox="0 0 20 20" 
                fill="currentColor"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </motion.svg>
              Copied!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              Copy All
            </>
          )}
        </motion.button>
      </div>
      
      <motion.div 
        className="flex flex-wrap gap-2"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {hashtags.map((hashtag, index) => (
          <motion.span 
            key={index} 
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium shadow-sm ${getColorForHashtag(hashtag)}`}
            variants={item}
            whileHover={{ scale: 1.1, rotate: [-1, 1, -1, 0], transition: { duration: 0.3 } }}
          >
            #{hashtag}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
} 