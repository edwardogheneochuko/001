import { useState, useEffect, useRef } from "react"
import pumpkin from "../assets/pumpkin.mp4"
import Navbar from "@/components/Navbar"
import Page1 from "@/pages/Screen1"
import Page2 from "@/pages/Screen2"
import Page3 from "@/pages/Screen3"
import Page4 from "@/pages/Screen4"
import Footer from "@/components/Footer"

const LandingPage = () => {
  const [showContent, setShowContent] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const playVideo = async () => {
      try {
        if (videoRef.current) await videoRef.current.play()
      } catch (error) {
        console.log("Autoplay blocked:", error)
      }
    }

    playVideo()

    const timer = setTimeout(() => setShowContent(true), 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-screen h-screen overflow-y-scroll scrollbar-hide">
      <Navbar isVisible={showContent} />

      <video
        ref={videoRef}
        className={`fixed top-0 left-0 w-full h-full object-cover transition-all duration-1000 ${
          showContent ? "blur-sm" : ""
        }`}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={pumpkin} type="video/mp4" />
      </video>

      {!showContent && (
        <button
          type="button"
          onClick={() => setShowContent(true)}
          className="fixed bottom-8 right-8 z-20 px-4 py-2 rounded-md border border-red-700/70 bg-black/60
          text-red-300 hover:text-red-100 hover:bg-red-900/60 font-mono text-sm tracking-widest cursor-pointer transition"
        >
          SKIP INTRO →
        </button>
      )}

      {showContent && (
        <div className="relative z-10">
          <Page1 />
          <Page2 />
          <Page3 />
          <Page4 />
          <Footer />
        </div>
      )}
    </div>
  )
}

export default LandingPage