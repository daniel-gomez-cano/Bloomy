import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Map from '../components/Map'
import { useAuth } from '../hooks/useAuth'
import './dashboard.css'
import { createCheckoutSession } from '../services/stripe'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()
  const { refresh } = useAuth()
  const [searchParams] = useSearchParams()
  const [coords, setCoords] = useState(null)
  const [dimensions, setDimensions] = useState('')
  const [shape, setShape] = useState('Irregular')

  const handleUbicacionSeleccionada = (latlng) => {
    setCoords(latlng)
  }

  // If we come back from Checkout with a session_id, refresh user
  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (sessionId) {
      try {
        refresh()
      } catch (err) {
        console.error('Failed to refresh user after checkout', err)
      }
    }
  }, [searchParams])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="dashboard">
        <section className="ia-report-section">
          <h2>Reporte de IA</h2>
          <p>Basado en las dimensiones y la disposición del terreno, se recomienda plantar las siguientes especies:</p>

          <div className="plant-name">Lavanda (Lavandula angustifolia)</div>
          <ul>
            <li>Requiere pleno sol y suelo bien drenado.</li>
            <li>Ideal para bordes y macizos de flores.</li>
            <li>Atrae polinizadores como abejas y mariposas.</li>
          </ul>
          <p>Lavanda (Lavandula angustifolia) es una planta perenne que no solo embellece el jardín, sino que también contribuye a la biodiversidad al atraer polinizadores.</p>
          <div className="plant-name">Rosa (Rosa spp.)</div>
          <ul>
            <li>Prefiere sol directo y suelo fértil.</li>
            <li>Perfecta para jardines formales y arbustos.</li>
            <li>Ofrece flores fragantes y coloridas.</li>
          </ul>
          <div className="plant-name">Girasol (Helianthus annuus)</div>
          <ul>
            <li>Necesita pleno sol y espacio para crecer.</li>
            <li>Aporta altura y estructura al jardín.</li>
            <li>Proporciona semillas comestibles y alimento para aves.</li>
          </ul>
        </section>

        <section className="map-section">
          <div className="map-placeholder">
            {/* Integración del Map aquí */}
            <Map onUbicacionSeleccionada={handleUbicacionSeleccionada} />
          </div>
          {/* Non-premium: solo mostrar 'Mejorar a Premium' y 'Generar Reporte' */}
          {!user?.isPremium ? (
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                className="btn-accent"
                onClick={async () => {
                  try {
                    const data = await createCheckoutSession()
                    if (data?.url) {
                      window.location.href = data.url
                    } else {
                      console.error('No session URL returned')
                    }
                  } catch (err) {
                    console.error('Checkout error', err)
                  }
                }}
              >
                Mejorar a Premium
              </button>
              <button className="btn-outline">Generar Reporte</button>
            </div>
          ) : (
            <>
              {/* Premium: mantiene los campos e inputs actuales */}
              <div className="input-group">
                <div className="field">
                  <label htmlFor="dimensions">Dimensiones del terreno (m²)</label>
                  <input value={dimensions} onChange={(e)=>setDimensions(e.target.value)} type="text" id="dimensions" placeholder="Ej: 20x20 ?" />
                </div>
                <button className="btn-accent">Generar Reporte</button>
              </div>

              <div className="input-group">
                <div className="field">
                  <label htmlFor="shape">Disposición del terreno</label>
                  <select value={shape} onChange={(e)=>setShape(e.target.value)} id="shape">
                    <option>Irregular</option>
                    <option>Cuadrado</option>
                    <option>Triangular</option>
                  </select>
                </div>
                <button className="btn-outline">Descargar PDF</button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}

