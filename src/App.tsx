import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./components/LandingPage"
import Mainpage from "./pages/main/Mainpage"
import Login from './components/auth/Login'
import ProtectedRoute from './components/auth/ProtectedRoute'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        <Route path="/001" element={<Mainpage />} />
    
         {/* <Route
        path="/001"
        element={
          <ProtectedRoute>
            <Mainpage />
          </ProtectedRoute>
        }
      /> */}
      </Routes>
    </Router>
  )
}

export default App