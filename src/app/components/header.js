"use client"

import { motion } from "framer-motion"
import { ThemeToggle } from "./theme-toggle"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 left-4 right-4 z-50"
    >
      <div className="mx-auto max-w-5xl">
        <div className="backdrop-blur-md bg-white/30 dark:bg-gray-900/30 rounded-2xl shadow-lg border border-white/20 dark:border-gray-800/20">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/logo.png" 
                  alt="TrendGenie AI Logo" 
                  width={250} 
                  height={100} 
                  className="h-auto"
                />
                
              </Link>
            </div>
            
            {/* Right side - Theme Toggle */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
} 