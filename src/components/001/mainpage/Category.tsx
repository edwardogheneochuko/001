import { useState } from "react"
import { categories, categoryItems } from "@/assets/data"
import type { IconType } from "react-icons"

type CategoryType = {
  name: string
  image: string
  icon?: IconType
}

const Category = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20 pt-10 bg-gray-50 min-h-screen dark:bg-neutral-500">
      
      {!selectedCategory && (
        <div className="py-10 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bosld tracking-tight dark:text-white">
            Explore Categories
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base dark:text-white">
            Discover items by category
          </p>
        </div>
      )}

      {!selectedCategory && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat: CategoryType, index) => {
            const Icon = cat.icon

            return (
              <div
                key={index}
                onClick={() => setSelectedCategory(cat.name)}
                className="relative rounded-2xl overflow-hidden cursor-pointer group transform hover:-translate-y-2 transition duration-300"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-56 object-cover group-hover:scale-110 transition duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-90" />

                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white">
                  {Icon && (
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-full">
                      <Icon className="text-lg" />
                    </div>
                  )}
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {cat.name}
                  </h2>
                </div>

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
              </div>
            )
          })}
        </div>
      )}

      {selectedCategory && categoryItems[selectedCategory] && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold pt-5 dark:text-white">
                {selectedCategory}
              </h2>
              <p className="text-gray-500 text-sm">
                Browse items in this category
              </p>
            </div>

            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer
               rounded-full bg-black text-white text-sm hover:bg-gray-800 transition shadow-md"
            >
              ← Back
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryItems[selectedCategory].map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden cursor-pointer dark:bg-gray-700
                 shadow-sm hover:shadow-xl transition duration-300 group"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-52 object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold dark:text-white text-sm sm:text-base mb-1">
                    {item.name}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Click to explore more
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Category