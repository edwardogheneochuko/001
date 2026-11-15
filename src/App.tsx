import './App.css'
import { lazy, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import FullScreenLoader from '@/components/FullScreenLoader'

// Each route is its own chunk, so visitors only download what they open
// (and the landing page never loads Firebase)
const ProtectedRoute = lazy(() => import('@/auth/ProtectedRoute'))
const LandingPage = lazy(() => import('@/pages/LandingPage'))
const Login = lazy(() => import('@/auth/Login'))
const Mainpage = lazy(() => import('@/pages/main/Mainpage'))

const App = () => {
  return (
    <Router>
      <Suspense fallback={<FullScreenLoader />}>
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
