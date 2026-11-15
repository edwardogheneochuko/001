import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";

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
    aria-hidden="true"
  >
    <path d="M12 2C9 5 5 6 5 12s4 10 7 10 7-4 7-10-4-7-7-10z" />
    <path d="M12 2v4" />
    <path d="M8 12h8" />
  </svg>
);

const TITLE = "WELCOME";

const Page1 = () => {
  const navigate = useNavigate();

  return (
    <section
      id="abyss"
      className="relative min-h-dvh w-full overflow-hidden bg-linear-to-br from-black via-gray-950 to-red-950"
    >
      <div className="absolute inset-0 bg-radial from-red-900/20 via-transparent to-black pointer-events-none" />

      {/* Two slow, transform-only orbs (cheap to animate) */}
      <div className="absolute top-1/4 left-[8%] w-56 h-56 rounded-full bg-red-800/25 blur-3xl animate-float will-change-transform pointer-events-none" />
      <div
        className="absolute bottom-1/4 right-[10%] w-44 h-44 rounded-full bg-red-900/25 blur-3xl animate-float will-change-transform pointer-events-none"
        style={{ animationDelay: "-3.5s", animationDuration: "9s" }}
      />

      <div className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: EASE_OUT }}
          className="mb-10 text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.6)]"
        >
          <PumpkinIcon className="w-24 h-24 sm:w-32 sm:h-32 animate-float" />
        </motion.div>

        {/* Letters rise in once, then stay still */}
        <h1
          aria-label={TITLE}
          className="flex text-6xl sm:text-8xl font-black tracking-[0.12em] text-red-500 text-glow mb-6"
        >
          {TITLE.split("").map((char, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.8, ease: EASE_OUT }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: EASE_OUT }}
          className="text-xl sm:text-3xl text-gray-300 italic font-light mb-12 max-w-xl"
        >
          Project 001: A Journey into the Void
        </motion.p>

        <motion.button
          type="button"
          onClick={() => navigate("/login")}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.8, ease: EASE_OUT }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
          className="group relative px-12 py-4 rounded-lg border border-red-600/70 bg-red-950/50 font-bold tracking-[0.3em]
          text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:shadow-[0_0_40px_rgba(239,68,68,0.55)]
          hover:border-red-400 hover:text-white hover:bg-red-900/60 transition-[box-shadow,background-color,border-color,color] duration-300 cursor-pointer"
        >
          PROCEED
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-14 font-mono text-xs sm:text-sm tracking-[0.3em] text-red-500/90"
        >
          <span className="animate-breathe inline-block">⚠ BEWARE OF WHAT LIES AHEAD ⚠</span>
        </motion.p>
      </div>

      {/* Scroll cue */}
      <motion.button
        type="button"
        aria-label="Scroll to the next section"
        onClick={() => document.getElementById("whispers")?.scrollIntoView({ behavior: "smooth" })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-red-400/70 hover:text-red-300 cursor-pointer"
      >
        <ChevronDown className="w-8 h-8 animate-float" />
      </motion.button>
    </section>
  );
};

export default Page1;
