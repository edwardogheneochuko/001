import { motion } from "framer-motion";
import { Award, ArrowDown } from "lucide-react";
import FadeImage from "@/components/FadeImage";
import { EASE_OUT, fadeUp, stagger } from "@/lib/motion";

const Homepage = () => {
  return (
    <section className="relative min-h-dvh overflow-hidden px-6 md:px-16 pt-28 pb-16 flex flex-col md:flex-row items-center gap-12 md:gap-20
    bg-linear-to-b from-gray-50 to-gray-100 dark:from-neutral-950 dark:to-neutral-900">
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-red-500/10 dark:bg-red-700/15 blur-3xl" />

      <motion.div
        variants={stagger(0.12, 0.1)}
        initial="hidden"
        animate="show"
        className="relative md:flex-1 space-y-6 text-center md:text-left"
      >
        <motion.p variants={fadeUp} className="font-mono text-sm tracking-[0.4em] text-red-700 dark:text-red-400">
          001
        </motion.p>
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight text-gray-900 dark:text-white">
          Dark Marketplace
        </motion.h1>
        <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 max-w-md mx-auto md:mx-0">
          Explore forbidden, rare, and mysterious products. Only the brave dare to click below.
        </motion.p>

        <motion.div variants={fadeUp}>
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}
            className="group inline-flex items-center gap-2 cursor-pointer px-7 py-3 bg-red-800 hover:bg-red-700 text-white rounded-full font-semibold
            shadow-lg shadow-red-900/30 hover:shadow-red-700/40 transition-[background-color,box-shadow]"
          >
            Enter the Market
            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.2 }}
        className="relative md:flex-1 w-full max-w-lg group"
      >
        <div className="overflow-hidden rounded-2xl bg-gray-200 dark:bg-neutral-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
          <div className="transition-transform duration-700 ease-out group-hover:scale-[1.03]">
            <FadeImage
              src="https://res.cloudinary.com/direjlzc6/image/upload/v1773788010/npggjaeyushtbjhu0jbo.jpg"
              alt="Featured item"
              loading="eager"
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
        </div>

        <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/75 px-4 py-2 text-sm font-semibold text-amber-300 shadow-lg">
          <Award className="w-4 h-4" />
          Premium
        </div>
      </motion.div>
    </section>
  );
};

export default Homepage;
