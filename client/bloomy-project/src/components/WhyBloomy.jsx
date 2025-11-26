import React from 'react'

const WhyBloomy = () => {
  return (
    <section className="why-bloomy">
      <div className="why-bloomy-container">
        <h2>¿Por qué elegir Bloomy?</h2>
        <p className="subtitle">
          Nuestra plataforma simplifica la agricultura moderna. Con datos precisos y una interfaz intuitiva,
          te ayudamos a tomar decisiones informadas para maximizar tus cosechas.
        </p>

        <div className="cards">
          <div className="card">
            <div className="icon-circle" aria-hidden="true" role="img" aria-label="Clima">
              <span style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',height:'100%',fontSize:'28px'}}>🌦️</span>
            </div>
            <h3>Análisis Climático</h3>
            <p>
              Utilizamos datos meteorológicos específicos de tu zona para recomendarte los mejores cultivos y plantas.
            </p>
          </div>

          <div className="card">
            <div className="icon-circle" aria-hidden="true" role="img" aria-label="Cultivos">
              <span style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',height:'100%',fontSize:'28px'}}>🌱</span>
            </div>
            <h3>Detalles por Cultivo</h3>
            <p>
              Obtén información detallada sobre los requerimientos de cada cultivo, desde el tipo de suelo ideal, cómo cuidarlo,
              hasta horas de sol necesarias.
            </p>
          </div>

          <div className="card">
            <div className="icon-circle" aria-hidden="true" role="img" aria-label="Para todos">
              <span style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',height:'100%',fontSize:'28px'}}>👥</span>
            </div>
            <h3>Dirigido a Todos</h3>
            <p>
              Desde agricultores con experiencia, hasta quienes inician en la siembra, nuestra plataforma ofrece una guía clara
              y confiable para todos.
            </p>
          </div>

          <div className="card">
            <div className="icon-circle" aria-hidden="true" role="img" aria-label="Accesible">
              <span style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',height:'100%',fontSize:'28px'}}>📱</span>
            </div>
            <h3>Accesible y Simple</h3>
            <p>
              No necesitas equipos costosos, solo ingresa tu ubicación y obtén resultados en segundos mediante una interfaz web
              fácil de usar, disponible en cualquier dispositivo.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyBloomy
