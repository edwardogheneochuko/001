import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { EASE_OUT } from '@/lib/motion'

interface NavbarProps {
  isVisible: boolean
  scrollRoot: RefObject<HTMLElement | null>
}

const navItems = [
  { label: 'THE ABYSS', id: 'abyss' },
  { label: 'WHISPERS', id: 'whispers' },
  { label: 'NIGHTMARES', id: 'nightmares' },
  { label: 'THE VOID', id: 'void' },
]

/** Tracks which section is in the middle of the scroll container. */
const useActiveSection = (enabled: boolean, scrollRoot: RefObject<HTMLElement | null>) => {
  const [active, setActive] = useState(navItems[0].id)

  useEffect(() => {
    if (!enabled) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      // A thin band across the middle of the screen decides the active section
      { root: scrollRoot.current, rootMargin: '-45% 0px -45% 0px' },
    )
    // Sections mount with the content, so wait a frame for them to exist
    const frame = requestAnimationFrame(() => {
      navItems.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    })
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [enabled, scrollRoot])

  return active
}

const Navbar = ({ isVisible, scrollRoot }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const active = useActiveSection(isVisible, scrollRoot)

  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileMenuOpen])

  const handleNavClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop side rail */}
      <nav
        aria-label="Sections"
        className={`hidden md:flex fixed top-0 right-0 h-dvh w-56 z-20 flex-col items-center justify-center gap-12
        bg-linear-to-b from-black via-red-950/60 to-black border-l border-red-900/50
        transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="text-red-500 text-2xl font-black tracking-[0.25em] text-glow">HAUNTED</div>

        <ul className="flex flex-col gap-2 w-full px-6">
          {navItems.map((item) => {
            const isActive = active === item.id
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative w-full text-left px-4 py-3 text-sm tracking-widest cursor-pointer transition-colors duration-300
                  ${isActive ? 'text-red-100' : 'text-red-300/70 hover:text-red-100'}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-md bg-red-900/40 border-l-2 border-red-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Mobile menu button */}
      <div
        className={`md:hidden fixed top-5 right-5 z-40 transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          type="button"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="grid place-items-center w-12 h-12 rounded-full bg-black/60 border border-red-900/60 text-red-400
          hover:text-red-200 active:scale-95 transition cursor-pointer"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mobileMenuOpen ? 'close' : 'open'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && isVisible && (
          <>
            <motion.div
              key="backdrop"
              className="md:hidden fixed inset-0 z-20 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              key="drawer"
              aria-label="Sections"
              className="md:hidden fixed top-0 right-0 h-dvh w-64 z-30 pt-24 px-6
              bg-linear-to-b from-black via-red-950/80 to-black border-l border-red-900/60"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
            >
              <div className="text-red-500 font-black tracking-[0.25em] text-glow mb-8 px-4">HAUNTED</div>
              <ul className="flex flex-col gap-1">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + index * 0.05, duration: 0.3 }}
                  >
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-md text-sm tracking-widest border-l-2 cursor-pointer transition-colors
                      ${active === item.id
                        ? 'border-red-500 bg-red-900/40 text-red-100'
                        : 'border-transparent text-red-300/80 hover:bg-red-900/20 hover:text-red-100'}`}
                    >
                      {item.label}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
