import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HomeBloomy from './pages/HomeBloomy'
import About from './pages/About'
import Navbar from './components/Navbar'
import Map from './components/Map'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
          <Routes>
            <Route path="/" element={<HomeBloomy />} />
            <Route path="/about" element={<About />} />
          </Routes>
      </div>

      <div>
        <Map/>
      </div>

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR, so let's try if work
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
