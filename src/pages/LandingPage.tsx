import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import pumpkin from "../assets/pumpkin.mp4"
import Navbar from "@/components/Navbar"
import Page1 from "@/pages/Screen1"
import Page2 from "@/pages/Screen2"
import Page3 from "@/pages/Screen3"
import Page4 from "@/pages/Screen4"
import Footer from "@/components/Footer"
import { EASE_OUT } from "@/lib/motion"

const INTRO_MS = 5000

const LandingPage = () => {
  const [showContent, setShowContent] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), INTRO_MS)
    return () => clearTimeout(timer)
  }, [])

  // Any key skips the intro too
  useEffect(() => {
    if (showContent) return
    const skip = () => setShowContent(true)
    window.addEventListener("keydown", skip)
    return () => window.removeEventListener("keydown", skip)
  }, [showContent])

  return (
    <div
      ref={scrollRef}
      className="relative h-dvh w-full overflow-y-auto overflow-x-hidden scrollbar-hide bg-black text-white"
    >
      <Navbar isVisible={showContent} scrollRoot={scrollRef} />

      {/* Intro: the video is removed once it ends, so it stops decoding behind the page */}
      <AnimatePresence>
        {!showContent && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-30 bg-black"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: EASE_OUT }}
          >
            <video
              // Explicit play() as a fallback for browsers (notably iOS) that ignore autoPlay
              ref={(el) => {
                el?.play().catch(() => {
                  /* autoplay blocked: the intro still ends on its timer or via Skip */
                })
              }}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              src={pumpkin}
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/80" />

            <motion.p
              className="absolute bottom-24 left-1/2 -translate-x-1/2 font-mono text-xs sm:text-sm tracking-[0.5em] text-red-300/80 whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1.5 }}
            >
              PROJECT 001
            </motion.p>

            {/* Intro progress */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-red-600/80"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: INTRO_MS / 1000, ease: "linear" }}
            />

            <motion.button
              type="button"
              onClick={() => setShowContent(true)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute bottom-8 right-6 sm:right-8 px-4 py-2 rounded-full border border-red-700/70 bg-black/50
              text-red-200 hover:text-white hover:bg-red-900/60 font-mono text-xs sm:text-sm tracking-widest cursor-pointer transition-colors"
            >
              SKIP INTRO →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {showContent && (
        <motion.main
          className="relative md:pr-56"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE_OUT }}
        >
          <Page1 />
          <Page2 />
          <Page3 />
          <Page4 />
          <Footer />
        </motion.main>
      )}
    </div>
  )
}

export default LandingPage
