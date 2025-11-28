"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateVideoContent } from "./services/api";
import { ThemeToggle } from "./components/theme-toggle";
import { YouTubeLoader } from "./components/youtube-loader";
import { CopyButton } from "./components/copy-button";
import { HashtagBadges } from "./components/hashtag-badges";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Header } from "./components/header";

// Define niche options
const nicheOptions = [
  { value: "default", label: "General (Default)" },
  { value: "sports", label: "Sports" },
  { value: "news", label: "News & Current Events" },
  { value: "music", label: "Music" },
  { value: "gaming", label: "Gaming" },
  { value: "fashion", label: "Fashion & Beauty" },
  { value: "tech", label: "Technology" },
  { value: "travel", label: "Travel" },
  { value: "food", label: "Food & Cooking" },
  { value: "fitness", label: "Fitness & Health" },
  { value: "education", label: "Education" },
  { value: "business", label: "Business & Finance" },
  { value: "entertainment", label: "Entertainment" },
  { value: "diy", label: "DIY & Crafts" },
  { value: "science", label: "Science" },
];

export default function Home() {
  const [videoTopic, setVideoTopic] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("default");
  const [contentOptions, setContentOptions] = useState([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef(null);

  // Use useEffect to set mounted state after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle video loading and autoplay
  useEffect(() => {
    if (isMounted && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, [isMounted]);

  const handleGenerate = async () => {
    if (!videoTopic.trim()) {
      setError("Please enter a video topic");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result = await generateVideoContent(videoTopic, selectedNiche);
      setContentOptions(result.contentOptions || []);
      setActiveTabIndex(0); // Reset to first tab when new content is generated
    } catch (err) {
      console.error("Error generating content:", err);
      setError(err.message || "Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Only render the client-side content after mounting
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent align-[-0.125em]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Loading application...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video with rounded bottom corners */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 rounded-bl-[40px] rounded-br-[40px]">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute min-w-full min-h-full object-cover w-auto h-auto"
          preload
        >
          <source src="/bgVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Fixed Header */}
      <Header />

      {/* Main Content - Add padding-top to account for fixed header */}
      <div className="relative z-20 py-8 px-4 pt-28">
        <div className="max-w-4xl mx-auto">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Topic Input */}
                  <div>
                    <label
                      htmlFor="videoTopic"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      {`What's your video about?`}
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="videoTopic"
                        value={videoTopic}
                        onChange={(e) => setVideoTopic(e.target.value)}
                        placeholder="Enter a topic for your video"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            videoTopic.trim() &&
                            !isLoading
                          ) {
                            handleGenerate();
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Niche Selection */}
                  <div>
                    <label
                      htmlFor="videoNiche"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Select your content niche
                    </label>
                    <Select
                      id="videoNiche"
                      value={selectedNiche}
                      onChange={(e) => setSelectedNiche(e.target.value)}
                      options={nicheOptions}
                      className="w-full"
                    />
                  </div>

                  {/* Generate Button */}
                  <div className="pt-2">
                    <Button
                      onClick={handleGenerate}
                      disabled={isLoading || !videoTopic.trim()}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Generate Content
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg my-6"
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-red-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Animation */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="my-6"
              >
                <YouTubeLoader />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generated Content with Tabs */}
          <AnimatePresence>
            {!isLoading && contentOptions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                {/* Tabs Navigation */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-t-lg overflow-x-auto">
                  {contentOptions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTabIndex(index)}
                      className={`py-3 px-6 font-medium text-sm transition-colors duration-200 ${
                        activeTabIndex === index
                          ? "border-b-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                    >
                      Option {index + 1}
                    </button>
                  ))}
                </div>

                {/* Active Content */}
                {contentOptions[activeTabIndex] && (
                  <Card className="overflow-hidden border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl md:text-2xl text-purple-700 dark:text-purple-400">
                          {contentOptions[activeTabIndex].title}
                        </CardTitle>
                        <CopyButton
                          text={contentOptions[activeTabIndex].title}
                          label="title"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Description */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Description
                        </h3>
                        <div className="relative bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {contentOptions[activeTabIndex].description}
                          </p>
                          <div className="absolute top-2 right-2">
                            <CopyButton
                              text={contentOptions[activeTabIndex].description}
                              label="description"
                            />
                          </div>
                        </div>
                      </div>

                    {/* Hashtags */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Hashtags
                      </h3>
                      <div className="relative bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                        <HashtagBadges
                          hashtags={contentOptions[activeTabIndex].hashtags}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>

          {/* Footer */}
          <motion.div
            className="mt-8 text-center text-sm text-white drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p>Generated by Gemini AI • Made with ❤️ by {`<Sumit-Timori/>`}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
