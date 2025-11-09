import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Map from '../components/Map'
import { useAuth } from '../hooks/useAuth'
import './dashboard.css'
import { createCheckoutSession, confirmCheckoutSession } from '../services/stripe'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { generateAIReport } from '../services/ai'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Dashboard() {
  const { user } = useAuth()
  const { refresh } = useAuth()
  const [searchParams] = useSearchParams()
  const [coords, setCoords] = useState(null)
  const [dimensions, setDimensions] = useState('')
  const [shape, setShape] = useState('Irregular')
  const [report, setReport] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [reportError, setReportError] = useState('')
  const facts = [
    'Las abejas polinizan cerca del 75% de los cultivos que consumimos.',
    'La rotación de cultivos ayuda a mantener la salud del suelo y reduce plagas.',
    'El pH del suelo influye en la disponibilidad de nutrientes para las plantas.',
    'El riego por goteo puede ahorrar hasta un 50% de agua frente al riego tradicional.',
    'La materia orgánica mejora la retención de agua y la estructura del suelo.'
  ]
  const [factIndex, setFactIndex] = useState(0)

  const handleUbicacionSeleccionada = (latlng) => {
    setCoords(latlng)
  }

  // If we come back from Checkout with a session_id, refresh user
  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) return
    (async () => {
      try {
        // Confirm on server (fallback when webhook isn’t available locally)
        await confirmCheckoutSession(sessionId)
      } catch (e) {
        // Not fatal; webhook may have already upgraded the user
        console.warn('Confirm session fallback failed (webhook may handle it):', e?.response?.data || e.message)
      } finally {
        try { await refresh() } catch {}
      }
    })()
  }, [searchParams])

  // Rotate facts while loading
  useEffect(() => {
    if (!reportLoading) return
    const id = setInterval(() => {
      setFactIndex((i) => (i + 1) % facts.length)
    }, 6000)
    return () => clearInterval(id)
  }, [reportLoading])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="dashboard">
        <section className="ia-report-section">
          <h2>Reporte de IA</h2>
          {!report && !reportLoading && (
            <p>Selecciona una ubicación en el mapa y pulsa "Generar Reporte" para obtener recomendaciones personalizadas.</p>
          )}
          {reportLoading && (
            <div>
              <div className="loading-wrap">
                <div className="spinner" />
                <div>Generando reporte, por favor espera…</div>
              </div>
              <div className="didyouknow">
                <span className="label">¿Sabías que?</span>
                <span>{facts[factIndex]}</span>
              </div>
            </div>
          )}
          {reportError && <p style={{ color: '#ff6b6b' }}>{reportError}</p>}
          {report && (
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{report}</ReactMarkdown>
            </div>
          )}
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
              <button
                className="btn-outline"
                onClick={async () => {
                  setReportError('')
                  if (!coords) { setReportError('Selecciona una ubicación en el mapa.'); return }
                  try {
                    setReportLoading(true)
                    const { report: r } = await generateAIReport({ lat: coords.lat, lng: coords.lng })
                    setReportLoading(false)
                    setReport(r)
                  } catch (err) {
                    setReportLoading(false)
                    setReportError(err?.response?.data?.message || 'No se pudo generar el reporte')
                  }
                }}
              >
                Generar Reporte
              </button>
            </div>
          ) : (
            <>
              {/* Premium: mantiene los campos e inputs actuales */}
              <div className="input-group">
                <div className="field">
                  <label htmlFor="dimensions">Dimensiones del terreno (m²)</label>
                  <input value={dimensions} onChange={(e)=>setDimensions(e.target.value)} type="text" id="dimensions" placeholder="Ej: 20x20 ?" />
                </div>
                <button
                  className="btn-accent"
                  onClick={async () => {
                    setReportError('')
                    if (!coords) { setReportError('Selecciona una ubicación en el mapa.'); return }
                    try {
                      setReportLoading(true)
                      const { report: r } = await generateAIReport({ lat: coords.lat, lng: coords.lng, extras: { dimensions, shape } })
                      setReportLoading(false)
                      setReport(r)
                    } catch (err) {
                      setReportLoading(false)
                      setReportError(err?.response?.data?.message || 'No se pudo generar el reporte')
                    }
                  }}
                >
                  Generar Reporte
                </button>
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

