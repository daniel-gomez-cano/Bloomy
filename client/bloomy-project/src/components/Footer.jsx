import React from 'react'
import BloomyLogo from '../assets/BloomyLogo.svg'
import Button from './Button'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="cta-section">
        <h2>¿Listo para optimizar tu cosecha?</h2>
        <p>Únete a los agricultores que ya están transformando sus cultivos con tecnología.</p>
        <div className="cta-buttons">
          <a className="navbar-cta" href="/register">Empieza Gratis</a>
          <a className="navbar-cta" href="https://wa.me/3163197861" target="_blank" rel="noopener noreferrer">Soporte</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-column brand">
            <img src={BloomyLogo} alt="Logo Bloomy" className="footer-logo" />
            <h3>Bloomy</h3>
            <p>El cultivo correcto en<br/>el lugar correcto :)</p>
          </div>

          <div className="footer-column">
            <h4>Navegación</h4>
            <ul>
              <li><a href="/">Inicio</a></li>
              <li><a href="https://wa.me/3163197861" target='_blank'>Soporte</a></li>
              <li><a href="/register">Registrate</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Stack</h4>
            <ul>
              <li>MongoDB</li>
              <li>Express.js</li>
              <li>React</li>
              <li>Node.js</li>
              <li>LeafletJS</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Disclaimer</h4>
            <p>
              Este sitio es parte de un proyecto académico.<br/>
              No representa una empresa o servicio real.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
