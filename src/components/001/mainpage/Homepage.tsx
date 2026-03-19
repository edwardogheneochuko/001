import { Award } from "lucide-react";

const Homepage = () => {
  return (
    <div className="min-h-screen px-6 md:px-16 py-12 flex flex-col md:flex-row 
    items-center gap-12 md:gap-24 mt-24">
      <div className="sm:flex-1 space-y-6 text-center md:text-left">
        <h1 className="text-5xl md:text-6xl font-black ">001</h1>
        <h2 className="text-3xl md:text-4xl font-semibold">Dark Marketplace</h2>
        <p className="text-gray-400 max-w-md">
          Explore forbidden, rare, and mysterious products. Only the brave dare to click below.
        </p>

        <button className="px-6 py-3 bg-red-900 hover:bg-red-800 text-white rounded-lg font-bold shadow-lg shadow-red-800 transition-all transform hover:scale-105">
          Enter the Market
        </button>
      </div>

      <div className="flex-1 relative group w-full max-w-lg">
        <img
          src="https://res.cloudinary.com/direjlzc6/image/upload/v1773788010/npggjaeyushtbjhu0jbo.jpg"
          alt="Scary Product"
          className="w-full rounded-xl border-4 shadow-2xl transform transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute top-4 left-4 bg-white text-yellow-400 px-4 py-2
         rounded-2xl font-bold shadow-lg flex items-center gap-2">
          <Award className="text-yellow-400 w-5 h-5 animate-pulse" />
          Premium
        </div>
      </div>

    </div>
  );
};

export default Homepage;