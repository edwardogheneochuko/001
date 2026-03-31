import Hero from "@/components/main/Hero"
import Category from "@/components/main/mainpage/Category"
import Homepage from "@/components/main/mainpage/Homepage"
import TopNav from "@/components/main/TopNav"

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