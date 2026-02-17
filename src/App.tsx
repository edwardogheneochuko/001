
import { useState, useEffect } from 'react'
import pumpkin from './assets/pumpkin.mp4'
import Navbar from './components/Navbar'
import Page1 from './pages/Page1'
import Page2 from './pages/Page2'
import Page3 from './pages/Page3'
import Page4 from './pages/Page4'
import './App.css'

const App = () => {
  const [showContent, setShowContent] = useState(false)
  const [blurVideo, setBlurVideo] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
      setBlurVideo(true)
    }, 5000) // 5 seconds

    return () => clearTimeout(timer)
  }, [])


  return (
    <div className="relative w-screen h-screen overflow-y-scroll scrollbar-hide">
      <Navbar isVisible={showContent} />

      <video
        className={`fixed top-0 left-0 w-full h-full object-cover transition-all duration-1000 ${
          blurVideo ? 'blur-sm' : ''
        }`}
        autoPlay
        loop
        muted
      >
        <source src={pumpkin} type="video/mp4" />
      </video>

      {showContent && (
        <div className="relative z-10">
          <Page1 />
          <Page2 />
          <Page3 />
          <Page4 />
        </div>
      )}
    </div>
  )
}

export default App