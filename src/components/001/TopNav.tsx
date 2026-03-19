// TopNav.tsx
import { Icon, Search, ChevronDown, PersonStanding, HelpCircle, Menu, X } from "lucide-react";
import { pumpkin } from "@lucide/lab";
import { useState, useEffect } from "react";
import { auth } from "../auth/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";

const TopNav = () => {
  const [openAccount, setOpenAccount] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Listen for auth state changes
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

  return (
    <div className="shadow-sm bg-gray-50 z-50 fixed top-0 left-0 w-full ">
      <div className="flex items-center justify-between px-4 md:px-9 py-4">
        {/* Logo */}
        <h1 className="text-3xl md:text-4xl font-mono flex items-center gap-1 text-red-900">
          001 <Icon iconNode={pumpkin} className="text-red-500" />
        </h1>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center border border-gray-300 rounded-md overflow-hidden flex-1 max-w-xl mx-4">
          <div className="px-3 text-gray-500">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="py-2 px-2 outline-none w-full"
          />
          <button className="bg-red-900 px-4 py-2 hover:bg-red-800 text-white transition-all duration-200">
            Search
          </button>
        </div>

        {/* Desktop Account + Help */}
        <div className="hidden md:flex items-center gap-6">
          <div className="relative">
            <button
              onClick={() => setOpenAccount(!openAccount)}
              className="flex items-center gap-1 hover:text-red-500 cursor-pointer text-sm md:text-base"
            >
              <PersonStanding /> {user ? user.email : "Account"} <ChevronDown size={16} />
            </button>

            {openAccount && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-md rounded-md z-50">
                <ul className="flex flex-col text-gray-700">
                  {!user && (
                    <li className="bg-red-900 hover:bg-red-800 w-fit rounded-md mx-auto px-8 py-2 text-white mb-2">
                      Login
                    </li>
                  )}
                  {user && (
                    <>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{user.displayName || user.email}</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                        Logout
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="relative">
            <button className="flex items-center gap-1 hover:text-red-500 cursor-pointer text-sm md:text-base">
              <HelpCircle /> Help <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button className="cursor-pointer" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-gray-100 px-4 pb-4 space-y-4 border-t border-gray-200">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <div className="px-3 text-gray-500">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="py-2 px-2 outline-none w-full"
            />
            <button className="bg-red-900 px-4 py-2 hover:bg-red-800 text-white transition-all duration-200">
              Search
            </button>
          </div>

          <div>
            <button
              onClick={() => setOpenAccount(!openAccount)}
              className="flex items-center gap-2 text-red-900 font-medium"
            >
              <PersonStanding /> {user ? user.email : "Account"} <ChevronDown size={16} />
            </button>
            {openAccount && (
              <ul className="mt-2 bg-white rounded-md shadow-md divide-y divide-gray-200">
                {!user && (
                  <li className="bg-red-900 hover:bg-red-800 w-full px-4 py-2 text-white">Login</li>
                )}
                {user && (
                  <>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{user.displayName || user.email}</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                      Logout
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>

          <div>
            <button className="flex items-center gap-2 text-red-900 font-medium">
              <HelpCircle /> Help <ChevronDown size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNav;