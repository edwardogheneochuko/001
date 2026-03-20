// TopNav.tsx
import { Icon, Search, ChevronDown, PersonStanding, HelpCircle, Menu, X, Moon, Sun } from "lucide-react";
import { pumpkin } from "@lucide/lab";
import { useState, useEffect } from "react";
import { auth } from "../auth/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

const TopNav = () => {
  const [openAccount, setOpenAccount] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setOpenAccount(false);
  };

 const ThemeToggle = () => {
  const isDark = theme === "dark";

  return (
    <div
      onClick={toggleTheme}
      className="relative w-14 h-7 flex items-center bg-gray-300 dark:bg-neutral-500 rounded-full p-1 cursor-pointer transition-colors duration-300"
    >
      <motion.div
        className="w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow-md flex items-center justify-center text-yellow-500"
        animate={{ x: isDark ? 28 : 0 }}
        transition={{
          type: "spring",
          stiffness: 140,  // low enough to be soft
          damping: 16,     // smooth deceleration
          mass: 1,
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 28 }}
        dragElastic={0.25}
        dragTransition={{
          bounceStiffness: 120,
          bounceDamping: 14,
        }}
        onDragEnd={(e, info) => {
          // Snap based on drag distance and velocity
          const velocityThreshold = 50;
          if (info.velocity.x > velocityThreshold || info.point.x > 14) {
            if (!isDark) toggleTheme();
          } else if (info.velocity.x < -velocityThreshold || info.point.x <= 14) {
            if (isDark) toggleTheme();
          }
        }}
      >
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
      </motion.div>
    </div>
  );
};

  return (
    <div className="shadow-sm bg-gray-50 dark:bg-neutral-900 dark:text-white z-50 fixed top-0 left-0 w-full">
      <div className="flex items-center justify-between px-4 md:px-9 py-4">

        {/* Logo */}
        <h1 className="text-3xl md:text-4xl font-mono flex items-center gap-1 text-red-900 dark:text-red-400">
          001 <Icon iconNode={pumpkin} className="text-red-500 dark:text-yellow-300" />
        </h1>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden flex-1 max-w-xl mx-4">
          <div className="px-3 text-gray-500 dark:text-gray-300">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="py-2 px-2 outline-none w-full bg-white dark:bg-gray-300 text-gray-900 dark:placeholder:text-white"
          />
          <button className="bg-red-900 px-4 py-2 hover:bg-red-800 text-white transition-all duration-200 cursor-pointer dark:bg-red-700">
            Search
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {/* Account */}
          <div className="relative">
            <button
              onClick={() => setOpenAccount(!openAccount)}
              className="flex items-center gap-1 hover:text-red-500 cursor-pointer text-sm md:text-base"
            >
              <PersonStanding /> {user ? user.email : "Account"} <ChevronDown size={16} />
            </button>

            {openAccount && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-md rounded-md z-50">
                <ul className="flex flex-col text-gray-700 dark:text-gray-200">
                  {!user && (
                    <li className="bg-red-900 hover:bg-red-800 w-fit rounded-md mx-auto px-8 py-2 text-white mb-2">
                      Login
                    </li>
                  )}
                  {user && (
                    <>
                      <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        {user.displayName || user.email}
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={handleLogout}
                      >
                        Logout
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Help */}
          <div className="relative">
            <button className="flex items-center gap-1 hover:text-red-500 cursor-pointer text-sm md:text-base">
              <HelpCircle /> Help <ChevronDown size={16} />
            </button>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-gray-100 dark:bg-gray-800 px-4 pb-4 space-y-4 border-t border-gray-200 dark:border-gray-700">

          {/* Search */}
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <div className="px-3 text-gray-500 dark:text-gray-300">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="py-2 px-2 outline-none w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button className="bg-red-900 px-4 py-2 hover:bg-red-800 text-white">
              Search
            </button>
          </div>

          {/* Account */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setOpenAccount(!openAccount)}
              className="flex items-center gap-2 text-red-900 dark:text-red-400 font-medium"
            >
              <PersonStanding /> {user ? user.email : "Account"} <ChevronDown size={16} />
            </button>

            {openAccount && (
              <ul className="mt-2 bg-white dark:bg-gray-800 rounded-md shadow-md divide-y divide-gray-200 dark:divide-gray-700">
                {!user && (
                  <li className="bg-red-900 hover:bg-red-800 w-full px-4 py-2 text-white">
                    Login
                  </li>
                )}
                {user && (
                  <>
                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      {user.displayName || user.email}
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 text-red-900 dark:text-red-400 font-medium">
              <HelpCircle /> Help
            </button>

            <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNav;