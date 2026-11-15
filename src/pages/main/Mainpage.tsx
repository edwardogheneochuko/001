import { useState } from "react"
import Hero from "@/components/main/Hero"
import Category from "@/components/main/mainpage/Category"
import Homepage from "@/components/main/mainpage/Homepage"
import TopNav from "@/components/main/TopNav"

const Mainpage = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="bg-gray-50 dark:bg-neutral-900">
      <TopNav onSearch={handleSearch} />
      <Homepage />
      <Category searchQuery={searchQuery} onClearSearch={() => setSearchQuery("")} />
      <Hero />
    </div>
  )
}

export default Mainpage
