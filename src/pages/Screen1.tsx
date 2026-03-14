import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PumpkinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C9 5 5 6 5 12s4 10 7 10 7-4 7-10-4-7-7-10z" />
    <path d="M12 2v4" />
    <path d="M8 12h8" />
  </svg>
);

const Page1 = () => {
  const navigate = useNavigate();

  return (
    <div id="abyss" className="w-screen h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-950 to-red-950">
      <div className="absolute inset-0 bg-gradient-radial from-red-900/15 via-transparent to-black pointer-events-none" />
      <motion.div
        className="absolute w-full h-full bg-gradient-to-br from-black/80 via-red-950/10 to-black/80"
        animate={{ opacity: [0.7, 0.9, 0.6, 0.9] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <motion.div
        className="relative flex flex-col items-center justify-center text-center px-4 h-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <motion.div
          className="mb-12 text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]"
          animate={{ 
            rotate: [0, 15, -15, 0], 
            scale: [1, 1.3, 0.95, 1.2],
            filter: ["brightness(1)", "brightness(1.5)", "brightness(0.8)", "brightness(1.2)"]
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <PumpkinIcon className="w-32 h-32" />
        </motion.div>

        <motion.h1
        onClick={() => navigate('/login')}
          className="text-7xl sm:text-8xl font-black mb-6 tracking-widest text-red-500"
          animate={{ 
            scale: [1, 1.15, 0.95, 1.1],
            letterSpacing: ["3px", "5px", "3px", "4px"]
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ 
            textShadow: '0 0 40px rgba(239, 68, 68, 0.9), 0 0 80px rgba(0, 0, 0, 0.8), 0 20px 60px rgba(0,0,0,0.7)' 
          }}
        >
          WELCOME
       </motion.h1>

        <motion.p
          className="text-2xl sm:text-3xl text-gray-300 drop-shadow-lg mb-12 italic font-light"
          animate={{ opacity: [0.6, 1, 0.4, 1], scale: [1, 1.05, 0.98, 1.02] }}
          transition={{ duration: 3.5, repeat: Infinity }}
          style={{ textShadow: '0 0 20px rgba(0, 0, 0, 0.9)' }}
        >
          Project 001: A Journey into the Void
        </motion.p>

        <motion.button
          onClick={() => navigate('/login')}
          className="px-12 py-4 bg-gradient-to-r from-red-900/60 to-red-950/60 hover:from-red-700 hover:to-red-900
          border-2 border-red-600/70 hover:border-red-400 rounded-lg font-bold text-red-300 hover:text-red-100
          transition-all duration-300 text-lg drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]
          hover:drop-shadow-[0_0_30px_rgba(239,68,68,0.8)] cursor-pointer"
          animate={{ 
            boxShadow: [
              "0 0 10px rgba(239, 68, 68, 0.3)",
              "0 0 30px rgba(239, 68, 68, 0.6)",
              "0 0 10px rgba(239, 68, 68, 0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.1, rotateZ: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          • PROCEED •
        </motion.button>

        {/* Warning text */}
        <motion.div
          className="mt-16 text-red-600/90 font-mono tracking-[3px] text-sm sm:text-base"
          animate={{ opacity: [0.5, 1, 0.3, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          ⚠ BEWARE OF WHAT LIES AHEAD ⚠
        </motion.div>
      </motion.div>

      {/* Floating haunting orbs - enhanced */}
      <motion.div
        className="absolute w-40 h-40 bg-gradient-to-br from-red-900/20 to-red-950/10 rounded-full blur-3xl top-1/4 left-10"
        animate={{ 
          y: [0, 40, 0], 
          x: [0, 20, -10, 0],
          scale: [1, 1.3, 1, 1.2]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-32 h-32 bg-gradient-to-tl from-red-900/15 to-transparent rounded-full blur-3xl bottom-1/3 right-20"
        animate={{ 
          y: [0, -30, 0], 
          x: [0, -15, 10, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Decorative corner glows */}
      <motion.div
        className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-red-900/10 via-transparent to-transparent rounded-full blur-2xl"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-red-900/10 via-transparent to-transparent rounded-full blur-2xl"
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </div>
  );
};

export default Page1;
