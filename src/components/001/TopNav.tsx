import { Icon, Search, ChevronDown } from "lucide-react";
import { pumpkin } from "@lucide/lab";
import { useState } from "react";

const TopNav = () => {
  const [openAccount, setOpenAccount] = useState(false);

  return (
    <div className="mt-3">
      {/* Top Bar */}
      <div className="bg-gray-100 px-3 md:px-9 py-2">
        <h1 className="text-xs md:text-sm text-red-600">Sell on 001</h1>
      </div>

      <div className="flex items-center justify-between md:px-12 px-3 py-5">
        <h1 className="text-4xl font-mono flex items-center gap-1">
          001
          <Icon iconNode={pumpkin} className="text-red-500" />
        </h1>

        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <div className="px-3 text-gray-500">
            <Search size={18} />
          </div>

          <input
            type="text"
            placeholder="Search products..."
            className="py-2 px-2 outline-none w-40 md:w-64"
          />

          <button className="bg-red-900 px-4 py-2 hover:bg-red-800 duration-200 
          cursor-pointer text-white">
            Search
          </button>
        </div>

        <div className="flex items-center gap-6 relative">

          <div className="relative">
            <button
              onClick={() => setOpenAccount(!openAccount)}
              className="flex items-center gap-1 hover:text-red-500 cursor-pointer"
            >
              Account
              <ChevronDown size={16} />
            </button>

            {openAccount && (
              <div className="absolute -left-10 mt-5 w-40 bg-white shadow-sm">
                 <ul className="flex flex-col text-sm text-center">
                  <button className="bg-red-900 hover:bg-red-800 w-fit rounded-md
                   mx-auto px-12 py-2 cursor-pointer text-xs text-white">Login</button>
                  <hr className="text-gray-300 mt-3"/>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Orders</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                </ul>
              </div>
            )}
          </div>
          <button className="hover:text-red-500">Help</button>
        </div>
      </div>
    </div>
  );
};

export default TopNav;