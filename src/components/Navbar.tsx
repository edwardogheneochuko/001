import { useState } from 'react'
import { Menu, X } from 'lucide-react'

interface NavbarProps {
  isVisible: boolean
}

const Navbar = ({ isVisible }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Info', id: 'info' },
    { label: 'Designs', id: 'designs' },
    { label: '001', id: '001' },
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
      {/* Desktop Navbar - Right Side */}
      <nav
        className={`hidden md:fixed md:top-0 md:right-0 md:h-screen md:w-40 md:z-20 md:flex md:flex-col md:items-center md:justify-center md:gap-8 md:transition-all md:duration-1000 md:backdrop-blur-md md:bg-black/30 ${
          isVisible ? 'md:opacity-100' : 'md:opacity-0 md:pointer-events-none'
        }`}
      >
        <div className="text-white text-xl font-bold mb-8">Logo</div>
        <ul className="flex flex-col gap-6 text-white text-sm">
          {navItems.map((item) => (
            <li
              key={item.label}
              onClick={() => handleNavClick(item.id)}
              className="hover:text-gray-300 hover:translate-x-2 transition-all cursor-pointer duration-300"
            >
              {item.label}
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Navbar Header Button */}
      <div
        className={`md:hidden fixed top-6 right-6 z-30 transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white hover:text-gray-300 transition-colors"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu - Slides in from right */}
      {mobileMenuOpen && isVisible && (
        <>
          {/* Backdrop overlay */}
          <div
            className="md:hidden fixed inset-0 z-10 bg-black/20"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Sidebar */}
          <div className="md:hidden fixed top-0 right-0 h-screen w-32 z-20 bg-black/50 backdrop-blur-md animate-slide-in-right">
            <ul className="flex flex-col gap-6 text-white text-sm p-8 mt-16">
              {navItems.map((item) => (
                <li
                  key={item.label}
                  onClick={() => handleNavClick(item.id)}
                  className="hover:text-gray-300 hover:translate-x-2 transition-all cursor-pointer duration-300"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  )
}

export default Navbar
