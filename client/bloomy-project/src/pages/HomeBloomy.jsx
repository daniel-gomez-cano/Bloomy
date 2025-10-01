import Navbar from "../components/Navbar"

export default function HomeBloomy() {
  return (
    <div>
      <Navbar />
      
      <div className="hero-section">
        <h1 className="hero-title">Cultiva el futuro en el Valle</h1>
        <p className="hero-description">
          Obtén recomendaciones personalizadas y basadas en ciencia de cultivos 
          ideales para tu ubicación, utilizando datos reales de clima, suelo y 
          condiciones ambientales.
        </p>
        <button className="cta-button">Crea tu Cuenta</button>
      </div>
    </div>
  )
}
