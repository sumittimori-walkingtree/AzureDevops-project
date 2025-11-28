"use client"

import { motion } from "framer-motion"

export function YouTubeLoader() {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const dotVariants = {
    initial: { y: 0 },
    animate: { 
      y: [0, -15, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const dotColors = [
    "bg-purple-600",
    "bg-blue-600",
    "bg-indigo-600",
    "bg-pink-600",
  ];

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        className="flex space-x-4 items-center justify-center"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {dotColors.map((color, index) => (
          <motion.div
            key={index}
            className={`w-4 h-4 rounded-full ${color}`}
            variants={dotVariants}
            custom={index}
          />
        ))}
      </motion.div>
      <motion.p 
        className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        Generating creative content...
      </motion.p>
    </div>
  )
} 