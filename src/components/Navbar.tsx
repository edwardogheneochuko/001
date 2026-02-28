import { useState } from 'react'
import { Menu, X } from 'lucide-react'

interface NavbarProps {
  isVisible: boolean
}

const Navbar = ({ isVisible }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'THE ABYSS', id: 'abyss' },
    { label: 'WHISPERS', id: 'whispers' },
    { label: 'NIGHTMARES', id: 'nightmares' },
    { label: 'THE VOID', id: 'void' },
  ]

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`hidden md:fixed md:top-0 md:right-0 md:h-screen md:w-56 md:z-20 md:flex md:flex-col md:items-center md:justify-center md:gap-8 md:transition-all md:duration-1000 md:backdrop-blur-lg
        md:bg-gradient-to-b md:from-black/90 md:via-red-950/40 md:to-black/90 
        md:border-l-4 md:border-red-900/60 md:shadow-2xl md:shadow-red-900/20
        ${isVisible ? 'md:opacity-100' : 'md:opacity-0 md:pointer-events-none'}`}
      >
        {/* Decorative top glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-red-900/20 via-red-900/5 to-transparent pointer-events-none md:rounded-b-3xl"/>
        
        {/* Logo with glow */}
        <div 
          className="text-red-500 text-2xl font-black mb-12 drop-shadow-2xl tracking-wider relative z-10 animate-pulse"
          style={{ textShadow: '0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(0, 0, 0, 0.6)' }}
        >
          HAUNTED
        </div>

        {/* Navigation items */}
        <ul className="flex flex-col gap-8 text-white text-sm relative z-10 w-full px-6">
          {navItems.map((item, index) => (
            <li
              key={item.label}
              onClick={() => handleNavClick(item.id)}
              className="group relative cursor-pointer transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background glow on hover */}
              <div className="absolute -inset-3 bg-gradient-to-r from-red-900/0 via-red-600/0 to-red-900/0 
              group-hover:from-red-900/30 group-hover:via-red-600/20 group-hover:to-red-900/30 
              rounded-lg transition-all duration-300 group-hover:blur-md opacity-0 group-hover:opacity-100" />
              
              {/* Text with effects */}
              <span className="relative block px-4 py-2 text-red-300 group-hover:text-red-100 
              transition-all duration-300 group-hover:translate-x-3 group-hover:scale-110 
              border-l-2 border-l-red-900/40 group-hover:border-l-red-500 
              drop-shadow-lg group-hover:drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]"
              style={{ 
                textShadow: 'group-hover:0 0 15px rgba(239, 68, 68, 0.6)' 
              }}>
                {item.label}
              </span>

              {/* Corner accent dots */}
              <div className="absolute right-0 top-0 w-1 h-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 
              transition-opacity duration-300" />
              <div className="absolute right-0 bottom-0 w-1 h-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 
              transition-opacity duration-300" />
            </li>
          ))}
        </ul>

        {/* Bottom glow effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-red-900/20 via-red-900/5 to-transparent pointer-events-none md:rounded-t-3xl"/>
      </nav>

      {/* Mobile Menu Button */}
      <div
        className={`md:hidden fixed top-6 right-6 z-30 transition-all duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-red-500 hover:text-red-300 transition-all duration-300 
          drop-shadow-[0_0_12px_rgba(239,68,68,0.4)] hover:drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]
          transform hover:scale-125 active:scale-95 cursor-pointer"
        >
          {mobileMenuOpen ? (
            <X size={32} className="animate-spin" style={{ animationDuration: '300ms' }} />
          ) : (
            <Menu size={32} className="hover:rotate-12 transition-transform" />
          )}
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && isVisible && (
        <div
          className="md:hidden fixed inset-0 z-10 bg-gradient-to-b from-black/40 via-red-950/20 to-black/40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && isVisible && (
        <div className="md:hidden fixed top-0 right-0 h-screen w-48 z-20 
        bg-gradient-to-b from-black/95 via-red-950/50 to-black/95 
        border-l-4 border-red-900/60 shadow-2xl shadow-red-900/40 
        animate-slide-in-right backdrop-blur-lg">
          
          {/* Mobile menu glow header */}
          <div className="h-24 bg-gradient-to-b from-red-900/30 to-transparent flex items-center justify-center">
            <div 
              className="text-red-500 font-black tracking-wider drop-shadow-lg animate-pulse"
              style={{ textShadow: '0 0 15px rgba(239, 68, 68, 0.8)' }}
            >
              HAUNTED
            </div>
          </div>

          {/* Mobile nav items */}
          <ul className="flex flex-col gap-4 text-white text-sm p-8">
            {navItems.map((item, index) => (
              <li
                key={item.label}
                onClick={() => handleNavClick(item.id)}
                className="group relative cursor-pointer transition-all duration-300 px-4 py-3
                border-l-3 border-l-red-900/40 group-hover:border-l-red-500
                text-red-300 group-hover:text-red-100 group-hover:translate-x-2 group-hover:scale-105
                hover:bg-red-900/20 rounded-r-lg drop-shadow-md"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  textShadow: 'group-hover:0 0 10px rgba(239, 68, 68, 0.6)'
                }}
              >
                {item.label}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full 
                opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
              </li>
            ))}
          </ul>

          {/* Mobile menu footer glow */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-red-900/20 to-transparent" />
        </div>
      )}
    </>
  )
}

export default Navbar
