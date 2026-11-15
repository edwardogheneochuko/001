import { useMemo, useState } from "react"
import { categories, categoryItems } from "@/assets/data"
import type { Item } from "@/assets/data"

type CategoryProps = {
  searchQuery: string
  onClearSearch: () => void
}

type ItemWithCategory = Item & { category: string }

const ItemGrid = ({ items }: { items: ItemWithCategory[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {items.map((item) => (
      <div
        key={`${item.category}-${item.id}`}
        className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group"
      >
        <div className="h-[250px] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-1">
            {item.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
        </div>
      </div>
    ))}
  </div>
)

const BackButton = ({ onClick, label = "← Back" }: { onClick: () => void; label?: string }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm
    hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-md w-fit cursor-pointer"
  >
    {label}
  </button>
)

const Category = ({ searchQuery, onClearSearch }: CategoryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const searchResults = useMemo<ItemWithCategory[]>(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return []
    return Object.entries(categoryItems).flatMap(([category, items]) =>
      items
        .filter((item) => category.toLowerCase().includes(q) || item.name.toLowerCase().includes(q))
        .map((item) => ({ ...item, category })),
    )
  }, [searchQuery])

  const isSearching = searchQuery.trim().length > 0

  let content
  if (isSearching) {
    content = (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Results for “{searchQuery.trim()}”
            </h2>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              {searchResults.length} {searchResults.length === 1 ? "item" : "items"} found
            </p>
          </div>
          <BackButton onClick={onClearSearch} label="✕ Clear search" />
        </div>
        {searchResults.length > 0 ? (
          <ItemGrid items={searchResults} />
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Nothing matches that search.</p>
        )}
      </div>
    )
  } else if (selectedCategory && categoryItems[selectedCategory]) {
    content = (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {selectedCategory}
            </h2>
            <p className="text-gray-500 text-sm dark:text-gray-400">Browse items in this category</p>
          </div>
          <BackButton onClick={() => setSelectedCategory(null)} />
        </div>
        <ItemGrid
          items={categoryItems[selectedCategory].map((item) => ({ ...item, category: selectedCategory }))}
        />
      </div>
    )
  } else {
    content = (
      <>
        <div className="py-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Explore Categories
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base dark:text-gray-300">
            Discover items by category
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const CatIcon = cat.icon
            return (
              <button
                type="button"
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className="relative h-[280px] sm:h-[320px] md:h-[380px] text-left
                rounded-2xl overflow-hidden cursor-pointer group
                transform hover:-translate-y-2 transition duration-300"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white">
                  {CatIcon && (
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-full">
                      <CatIcon className="text-lg" />
                    </div>
                  )}
                  <h2 className="text-lg sm:text-xl font-semibold">{cat.name}</h2>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
              </button>
            )
          })}
        </div>
      </>
    )
  }

  return (
    <section
      id="categories"
      className="scroll-mt-24 px-4 sm:px-6 md:px-12 lg:px-20 py-10 bg-gray-50 dark:bg-neutral-900 min-h-screen"
    >
      {content}
    </section>
  )
}

export default Category
