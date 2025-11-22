import React, { useState } from 'react'
import './consejos.css'
import PreparacionSuelo from './consejos/PreparacionSuelo'
import TecnicasRiego from './consejos/TecnicasRiego'
import ControlPlagas from './consejos/ControlPlagas'
import CosechaAlmacenamiento from './consejos/CosechaAlmacenamiento'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

const items = [
  {
    id: 'preparacion-suelo',
    title: 'Preparación del Suelo',
    component: <PreparacionSuelo />,
    children: [
      { id: 'suelo-analisis', title: 'Análisis del suelo' },
      { id: 'suelo-nutrientes', title: 'Mejora de nutrientes' },
      { id: 'suelo-drenaje', title: 'Drenaje y aireación' },
    ],
  },
  {
    id: 'tecnicas-riego',
    title: 'Técnicas de Riego',
    component: <TecnicasRiego />,
    children: [
      { id: 'riego-goteo', title: 'Riego por goteo' },
      { id: 'riego-aspersion', title: 'Riego por aspersión' },
      { id: 'riego-eficiente', title: 'Manejo eficiente del agua' },
    ],
  },
  {
    id: 'control-plagas',
    title: 'Control de Plagas',
    component: <ControlPlagas />,
    children: [
      { id: 'metodos-preventivos', title: 'Métodos preventivos' },
      { id: 'control-biologico', title: 'Control biológico' },
      { id: 'insecticidas-naturales', title: 'Insecticidas naturales' },
    ],
  },
  {
    id: 'cosecha-almacenamiento',
    title: 'Cosecha y Almacenamiento',
    component: <CosechaAlmacenamiento />,
    children: [
      { id: 'cosecha-momento', title: 'Momento ideal para cosechar' },
      { id: 'cosecha-tecnicas', title: 'Técnicas de recolección' },
      { id: 'cosecha-conservacion', title: 'Conservación de productos' },
    ],
  },
  // Puedes agregar más secciones aquí
]

export default function Consejos() {
  const { user } = useAuth()
  const [active, setActive] = useState(items[0].id)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) return null

  return (
    <div className="consejos-root">
        <Navbar />
      <div className="header-mobile">
        <button
          id="menu-toggle"
          aria-expanded={mobileOpen}
          aria-controls="sidebar"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="menu-icon">☰</span>
          <span className="title-mobile">Consejos de agricultura</span>
        </button>
      </div>

      <div className="main-container">
        <aside id="sidebar" className={mobileOpen ? 'sidebar-open-mobile' : 'sidebar-hidden-mobile'}>
          <h2>Consejos de agricultura</h2>
          <nav className="sidebar-nav">
            {items.map((s, idx) => (
              <div className="nav-section" key={s.id}>
                <button
                  className={`main-link ${active === s.id ? 'active' : ''}`}
                  onClick={() => {
                    setActive(s.id)
                    setMobileOpen(false)
                    // scroll to top of content
                    const el = document.getElementById('main-content')
                    if (el) el.scrollTop = 0
                  }}
                >
                  <span className="section-number">{idx + 1}.</span> {s.title}
                </button>
                {s.children && (
                  <ul>
                    {s.children.map((c) => (
                      <li key={c.id}>
                        <button
                          className="sub-link"
                          onClick={() => {
                            // if sub-section, set active to parent and try to anchor inside content
                            setActive(s.id)
                            setMobileOpen(false)
                            setTimeout(() => {
                              const anchor = document.getElementById(c.id)
                              if (anchor) anchor.scrollIntoView({ behavior: 'smooth' })
                            }, 80)
                          }}
                        >
                          {c.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </aside>

        <main id="main-content">
          {items.map((s) => s.id === active && <div key={s.id}>{s.component}</div>)}
        </main>
      </div>
    </div>
  )
}
