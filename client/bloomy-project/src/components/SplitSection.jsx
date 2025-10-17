import React from 'react'
import './SplitSection.css'

export default function SplitSection() {
  return (
    <section>
      <div className="section how-it-works-section" id="como-funciona">
        <div className="beam beam-1" />
        <div className="beam beam-2" />
        <div className="beam beam-3" />
        <div className="beam beam-4" />
        <div className="beam beam-5" />
        <div className="beam beam-6" />
        <div className="beam beam-7" />

        <div className="section-header">
          <h2 className="section-title">¿Cómo Funciona Bloomy?</h2>
          <p className="section-description">Transforma tu agricultura en 3 pasos simples con tecnología inteligente.</p>
        </div>

        <div className="step-container">
          <div className="step">
            <div className="step-indicator">
              <div className="step-number">1</div>
            </div>
            <div className="step-content">
              <p className="step-description-title">Paso 1: Configuración Inicial</p>
              <h3 className="step-title">Registra tu Terreno</h3>
              <ul>
                <li>Creas tu cuenta gratuita en 30 segundos.</li>
                <li>Ubicas tu terreno en el mapa interactivo.</li>
                <li>Especificas dimensiones básicas (opcional).</li>
              </ul>
            </div>
          </div>

          <div className="step">
            <div className="step-indicator">
              <div className="step-number">2</div>
            </div>
            <div className="step-content">
              <p className="step-description-title">Paso 2: Análisis Inteligente</p>
              <h3 className="step-title">Obten Recomendaciones</h3>
              <ul>
                <li>Nuestro sistema cruza datos climáticos en tiempo real.</li>
                <li>Analiza características de suelo de tu zona.</li>
                <li>Procesa con algoritmos de compatibilidad de cultivos.</li>
              </ul>
            </div>
          </div>

          <div className="step">
            <div className="step-indicator">
              <div className="step-number">3</div>
            </div>
            <div className="step-content">
              <p className="step-description-title">Paso 3: Implementación</p>
              <h3 className="step-title">Cultiva con Confianza</h3>
              <ul>
                <li>Recibe lista de cultivos óptimos para tu terreno.</li>
                <li>Accede a guías de siembra y cuidados específicos.</li>
                <li>Monitorea el progreso de tus decisiones.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
        <div className="section premium-section">
          <div className="section-header">
            <h2 className="section-title">¿Por qué elegir Bloomy Premium?</h2>
            <p className="section-description">Desbloquea el máximo potencial de tu terreno con datos avanzados, soporte prioritario y análisis predictivos impulsados por IA.</p>
          </div>

          <table className="comparison-table">
            <thead>
              <tr>
                <th>Característica</th>
                <th>Plan Gratuito</th>
                <th>Plan Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label="Característica">Recomendaciones básicas</td>
                <td data-label="Plan Gratuito"><span className="check-icon">✅</span></td>
                <td data-label="Plan Premium"><span className="check-icon">✅ Avanzada</span></td>
              </tr>
              <tr>
                <td data-label="Característica">Datos climáticos actuales</td>
                <td data-label="Plan Gratuito"><span className="check-icon">✅</span></td>
                <td data-label="Plan Premium"><span className="check-icon">✅</span></td>
              </tr>
              <tr>
                <td data-label="Característica">IA con historial climático</td>
                <td data-label="Plan Gratuito"><span className="cross-icon">❌</span></td>
                <td data-label="Plan Premium"><span className="check-icon">✅</span></td>
              </tr>
              <tr>
                <td data-label="Característica">Disposición espacial de cultivos</td>
                <td data-label="Plan Gratuito"><span className="cross-icon">❌</span></td>
                <td data-label="Plan Premium"><span className="check-icon">✅</span></td>
              </tr>
              <tr>
                <td data-label="Característica">Datos de suelo detallados</td>
                <td data-label="Plan Gratuito"><span className="cross-icon">❌</span></td>
                <td data-label="Plan Premium"><span className="check-icon">✅</span></td>
              </tr>
              <tr>
                <td data-label="Característica">Alertas tempranas (heladas, sequía)</td>
                <td data-label="Plan Gratuito"><span className="cross-icon">❌</span></td>
                <td data-label="Plan Premium"><span className="check-icon">✅</span></td>
              </tr>
              <tr>
                <td data-label="Característica">Soporte prioritario</td>
                <td data-label="Plan Gratuito"><span className="cross-icon">❌</span></td>
                <td data-label="Plan Premium"><span className="check-icon">✅</span></td>
              </tr>
              <tr>
                <td data-label="Característica">Múltiples terrenos</td>
                <td data-label="Plan Gratuito"><span className="cross-icon">❌</span></td>
                <td data-label="Plan Premium"><span className="check-icon">✅</span></td>
              </tr>
            </tbody>
          </table>
        </div>
    </section>
  )
}
