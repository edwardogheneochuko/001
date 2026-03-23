import Hero from "@/components/001/Hero"
import Category from "@/components/001/mainpage/Category"
import Homepage from "@/components/001/mainpage/Homepage"
import TopNav from "@/components/001/TopNav"

const Mainpage = () => {
  return (
    <div>
      <TopNav />
      <Homepage />
      <Category />
      <Hero />
    </div>
  )
}

export default Mainpage