import Navbar from "../components/Navbar"
import AnimatedBackground from "../components/AnimatedBackground"
import WhyBloomy from "../components/WhyBloomy"
import SplitSection from "../components/SplitSection"
import Footer from "../components/Footer"
import { useNavigate } from 'react-router-dom'

export default function HomeBloomy() {
  const navigate = useNavigate()
  return (
    <div>
      <Navbar />
      
      <div className="hero-section">
        <AnimatedBackground />
        
        <div className="hero-content">
          <h1 className="hero-title">Cultiva el futuro en el Valle</h1>
          <p className="hero-description">
            Obtén recomendaciones personalizadas y basadas en ciencia de cultivos 
            ideales para tu ubicación, utilizando datos reales de clima, suelo y 
            condiciones ambientales.
          </p>
          <button className="cta-button" onClick={() => navigate('/register')}>Crea tu Cuenta</button>
        </div>
      </div>

      {/* Sección Why Bloomy */}
      <WhyBloomy />

      {/* Sección: Plantar en el Valle (Split) */}
      <SplitSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
