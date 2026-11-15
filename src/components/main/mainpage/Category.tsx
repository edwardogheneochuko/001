import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, X } from "lucide-react"
import { categories, categoryItems } from "@/assets/data"
import type { Item } from "@/assets/data"
import FadeImage from "@/components/FadeImage"
import { EASE_OUT, fadeUp, stagger } from "@/lib/motion"

type CategoryProps = {
  searchQuery: string
  onClearSearch: () => void
}

type ItemWithCategory = Item & { category: string }

const gridClass = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"

const ItemGrid = ({ items }: { items: ItemWithCategory[] }) => (
  <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className={gridClass}>
    {items.map((item) => (
      <motion.article
        key={`${item.category}-${item.id}`}
        variants={fadeUp}
        whileHover={{ y: -4 }}
        className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group
        ring-1 ring-black/5 dark:ring-white/5"
      >
        <div className="h-64 overflow-hidden bg-gray-200 dark:bg-neutral-700">
          <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
            <FadeImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-1">{item.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
        </div>
      </motion.article>
    ))}
  </motion.div>
)

const PillButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-sm
    hover:bg-gray-700 dark:hover:bg-gray-200 active:scale-95 transition shadow-md w-fit cursor-pointer"
  >
    {children}
  </button>
)

const Header = ({ title, subtitle, action }: { title: string; subtitle: string; action: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
      <p className="text-gray-500 text-sm dark:text-gray-400">{subtitle}</p>
    </div>
    {action}
  </div>
)

const Category = ({ searchQuery, onClearSearch }: CategoryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const query = searchQuery.trim()

  const searchResults = useMemo<ItemWithCategory[]>(() => {
    const q = query.toLowerCase()
    if (!q) return []
    return Object.entries(categoryItems).flatMap(([category, items]) =>
      items
        .filter((item) => category.toLowerCase().includes(q) || item.name.toLowerCase().includes(q))
        .map((item) => ({ ...item, category })),
    )
  }, [query])

  const viewKey = query ? `search:${query}` : selectedCategory ?? "all"

  let content
  if (query) {
    content = (
      <>
        <Header
          title={`Results for “${query}”`}
          subtitle={`${searchResults.length} ${searchResults.length === 1 ? "item" : "items"} found`}
          action={
            <PillButton onClick={onClearSearch}>
              <X className="w-4 h-4" /> Clear search
            </PillButton>
          }
        />
        {searchResults.length > 0 ? (
          <ItemGrid items={searchResults} />
        ) : (
          <p className="py-16 text-center text-gray-500 dark:text-gray-400">Nothing matches that search.</p>
        )}
      </>
    )
  } else if (selectedCategory && categoryItems[selectedCategory]) {
    content = (
      <>
        <Header
          title={selectedCategory}
          subtitle="Browse items in this category"
          action={
            <PillButton onClick={() => setSelectedCategory(null)}>
              <ArrowLeft className="w-4 h-4" /> All categories
            </PillButton>
          }
        />
        <ItemGrid
          items={categoryItems[selectedCategory].map((item) => ({ ...item, category: selectedCategory }))}
        />
      </>
    )
  } else {
    content = (
      <>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="py-10 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Explore Categories</h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base dark:text-gray-300">Discover items by category</p>
        </motion.div>

        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className={gridClass}
        >
          {categories.map((cat) => {
            const CatIcon = cat.icon
            return (
              <motion.button
                variants={fadeUp}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className="relative h-72 sm:h-80 md:h-96 text-left rounded-2xl overflow-hidden cursor-pointer group
                bg-gray-300 dark:bg-neutral-800 shadow-md hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
                  <FadeImage src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white">
                  {CatIcon && (
                    <div className="p-2 bg-white/20 rounded-full">
                      <CatIcon className="text-lg" />
                    </div>
                  )}
                  <h3 className="text-lg sm:text-xl font-semibold">{cat.name}</h3>
                  <span className="ml-auto text-sm opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition duration-300">
                    →
                  </span>
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </>
    )
  }

  return (
    <section
      id="categories"
      className="scroll-mt-24 px-4 sm:px-6 md:px-12 lg:px-20 py-16 bg-gray-50 dark:bg-neutral-900 min-h-dvh"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={viewKey}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

export default Category
