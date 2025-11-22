import { Routes, Route } from 'react-router-dom'
import HomeBloomy from './pages/HomeBloomy'
import About from './pages/About'
import Register from './pages/Register'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Consejos from './pages/Consejos'
import PremiumRoute from './components/PremiumRoute'
import ChatBloomy from './pages/ChatBloomy'
import ForgotPassword from './pages/ForgotPassword'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeBloomy />} />
      <Route path="/about" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
  <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/consejos"
        element={
          <PremiumRoute>
            <Consejos />
          </PremiumRoute>
        }
      />
      <Route
        path="/bloomy-ia"
        element={
          <PremiumRoute>
            <ChatBloomy />
          </PremiumRoute>
        }
      />
    </Routes>
  )
}

export default App
