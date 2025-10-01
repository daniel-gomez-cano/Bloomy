import { Routes, Route } from 'react-router-dom'
import HomeBloomy from './pages/HomeBloomy'
import About from './pages/About'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeBloomy />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

export default App
