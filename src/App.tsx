import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from './pages/LandingPage'
import Mainpage from "./pages/main/Mainpage"
import Login from '@/auth/Login'
import ProtectedRoute from '@/auth/ProtectedRoute'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
         <Route
        path="/001"
        element={
          <ProtectedRoute>
            <Mainpage />
          </ProtectedRoute>
        }
      />
      </Routes>
    </Router>
  )
}

export default App