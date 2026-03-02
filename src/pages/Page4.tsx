import smoke from '../assets/smoke.jpg'
import purple from '../assets/purple.jpg'

const Page4 = () => {
  return (
    <div
      id="void"
      className="w-screen h-screen relative flex items-center justify-center overflow-hidden"
    >
      {/* Background Layers */}
      <img
        src={smoke}
        alt="smoke"
        className="absolute inset-0 w-full h-full object-cover opacity-40 animate-pulse"
      />

      <img
        src={purple}
        alt="purple texture"
        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
      />

      {/* Dark overlay without background color */}
      <div className="absolute inset-0 backdrop-brightness-50"></div>

      {/* Content */}
      <div className="relative text-center text-gray-200 tracking-[0.3em]">
        <h2 className="text-6xl md:text-7xl font-extrabold mb-6 
                       text-red-700 
                       drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]
                       animate-pulse">
          THE VOID
        </h2>

        <p className="text-lg md:text-xl text-gray-400 
                      uppercase 
                      tracking-widest 
                      hover:text-red-600 
                      transition duration-500">
          something is watching
        </p>
      </div>

      {/* Subtle glitch line */}
      <div className="absolute bottom-10 w-1/2 h-[1px] 
                      bg-red-800 
                      opacity-40 
                      animate-ping">
      </div>
    </div>
  )
}

export default Page4