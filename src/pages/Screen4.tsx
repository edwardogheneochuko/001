import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import smoke from '../assets/smoke.jpg'
import purple from '../assets/purple.jpg'
import { EASE_OUT, fadeUp, inView, stagger } from '@/lib/motion'

const Page4 = () => {
  const navigate = useNavigate()

  return (
    <section
      id="void"
      className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Slow drifting smoke; transform-only animation keeps it smooth */}
      <img
        src={smoke}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover opacity-40 animate-drift will-change-transform"
      />
      <img
        src={purple}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
      />
      <div className="absolute inset-0 bg-radial from-transparent via-black/50 to-black" />

      <motion.div
        variants={stagger(0.18)}
        {...inView}
        className="relative px-6 text-center"
      >
        <motion.h2
          variants={{
            hidden: { opacity: 0, scale: 0.94, filter: 'blur(10px)' },
            show: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 1.4, ease: EASE_OUT } },
          }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-[0.25em] text-red-600 text-glow mb-6"
        >
          THE VOID
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-base md:text-xl text-gray-400 uppercase tracking-[0.35em] hover:text-red-500 transition-colors duration-500"
        >
          something is watching
        </motion.p>

        <motion.div variants={fadeUp} className="mt-12">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="px-8 py-3 rounded-full border border-red-700/70 bg-black/50 text-red-200 tracking-[0.3em] text-sm
            hover:bg-red-900/60 hover:text-white hover:border-red-400 hover:shadow-[0_0_30px_rgba(239,68,68,0.45)]
            active:scale-95 transition cursor-pointer"
          >
            STEP INSIDE
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 h-px w-1/2 origin-center bg-linear-to-r from-transparent via-red-700 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 0.7 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.4 }}
      />
    </section>
  )
}

export default Page4
