import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Icon,
  Search,
  ChevronDown,
  PersonStanding,
  HelpCircle,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { pumpkin } from "@lucide/lab";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { useTheme } from "@/context/theme";
import { motion } from "framer-motion";

const CRISIS_SUPPORT_URL = "https://findahelpline.com";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className="relative w-14 h-7 flex items-center bg-gray-300 dark:bg-neutral-500 rounded-full p-1 cursor-pointer transition-colors duration-300"
    >
      <motion.span
        className="w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow-md flex items-center justify-center text-yellow-500"
        animate={{ x: isDark ? 28 : 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 16, mass: 1 }}
      >
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
      </motion.span>
    </button>
  );
};

type SearchFormProps = {
  onSearch: (query: string) => void;
  className?: string;
  inputClassName?: string;
};

const SearchForm = ({ onSearch, className = "", inputClassName = "" }: SearchFormProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden ${className}`}
    >
      <div className="px-3 text-gray-500 dark:text-gray-300">
        <Search size={18} />
      </div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search categories & items..."
        aria-label="Search categories and items"
        className={`py-2 px-2 outline-none w-full text-gray-900 dark:text-gray-100 ${inputClassName}`}
      />
      <button
        type="submit"
        className="bg-red-900 px-4 py-2 hover:bg-red-800 text-white transition-all duration-200 cursor-pointer dark:bg-red-700"
      >
        Search
      </button>
    </form>
  );
};

type TopNavProps = {
  onSearch: (query: string) => void;
};

const TopNav = ({ onSearch }: TopNavProps) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<"account" | "help" | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  // Close dropdowns on Escape
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMenu]);

  const toggleMenu = (menu: "account" | "help") =>
    setOpenMenu((current) => (current === menu ? null : menu));

  const handleLogout = async () => {
    setOpenMenu(null);
    setMobileMenu(false);
    await signOut(auth);
    navigate("/login", { replace: true });
  };

  const handleSearch = (query: string) => {
    setMobileMenu(false);
    onSearch(query);
  };

  const accountLabel = user ? user.displayName || user.email : "Account";

  const accountItems = user ? (
    <>
      <li className="px-4 py-2 truncate text-gray-500 dark:text-gray-400 text-sm">
        {user.displayName || user.email}
      </li>
      <li>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          Logout
        </button>
      </li>
    </>
  ) : (
    <li>
      <button
        type="button"
        onClick={() => navigate("/login")}
        className="w-full text-left px-4 py-2 bg-red-900 hover:bg-red-800 text-white cursor-pointer"
      >
        Login
      </button>
    </li>
  );

  const helpItems = (
    <>
      <li>
        <a
          href={CRISIS_SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Crisis support ↗
        </a>
      </li>
      <li>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          Back to the start
        </button>
      </li>
    </>
  );

  return (
    <header className="shadow-sm bg-gray-50 dark:bg-neutral-900 dark:text-white fixed top-0 left-0 w-full z-50">
      {/* Click-away layer for open dropdowns */}
      {openMenu && (
        <div className="fixed inset-0 z-40" aria-hidden="true" onClick={() => setOpenMenu(null)} />
      )}

      <div className="flex items-center justify-between px-4 md:px-9 py-4">
        <h1 className="text-3xl md:text-4xl font-mono flex items-center gap-1 text-red-900 dark:text-red-400">
          001 <Icon iconNode={pumpkin} className="text-red-500 dark:text-yellow-300" />
        </h1>

        {/* Desktop Search */}
        <SearchForm
          onSearch={handleSearch}
          className="hidden md:flex flex-1 max-w-xl mx-4"
          inputClassName="bg-white dark:bg-neutral-800 dark:placeholder:text-gray-400"
        />

        {/* Desktop Right Menu */}
        <div className="hidden md:flex items-center gap-6">
          <div className="relative z-50">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={openMenu === "account"}
              onClick={() => toggleMenu("account")}
              className="flex items-center gap-1 hover:text-red-500 cursor-pointer text-sm md:text-base max-w-[16rem]"
            >
              <PersonStanding /> <span className="truncate">{accountLabel}</span> <ChevronDown size={16} />
            </button>

            {openMenu === "account" && (
              <ul className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 shadow-md rounded-md overflow-hidden text-gray-700 dark:text-gray-200">
                {accountItems}
              </ul>
            )}
          </div>

          <div className="relative z-50">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={openMenu === "help"}
              onClick={() => toggleMenu("help")}
              className="flex items-center gap-1 hover:text-red-500 cursor-pointer text-sm md:text-base"
            >
              <HelpCircle /> Help <ChevronDown size={16} />
            </button>

            {openMenu === "help" && (
              <ul className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 shadow-md rounded-md overflow-hidden text-gray-700 dark:text-gray-200">
                {helpItems}
              </ul>
            )}
          </div>

          <ThemeToggle />
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            aria-label={mobileMenu ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenu}
            className="cursor-pointer"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-gray-100 dark:bg-gray-800 px-4 pb-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
          <SearchForm
            onSearch={handleSearch}
            className="mt-5"
            inputClassName="bg-white dark:bg-gray-800"
          />

          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-2 text-black dark:text-white font-medium min-w-0">
              <PersonStanding /> <span className="truncate">{accountLabel}</span>
            </p>
            <ul className="bg-white dark:bg-gray-800 rounded-md shadow-md overflow-hidden divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-200">
              {accountItems}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-2 text-black dark:text-white font-medium">
              <HelpCircle /> Help
            </p>
            <ul className="bg-white dark:bg-gray-800 rounded-md shadow-md overflow-hidden divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-200">
              {helpItems}
            </ul>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-black dark:text-white font-medium">Dark mode</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
};

export default TopNav;
