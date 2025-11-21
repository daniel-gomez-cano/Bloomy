import React, { useState, useEffect } from 'react'

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Leer preferencia almacenada
    const saved = localStorage.getItem('bloomy_theme')
    if (saved === 'light') {
      document.body.classList.add('light-theme')
      setIsDark(false)
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(prev => {
      const nextDark = !prev
      if (nextDark) {
        document.body.classList.remove('light-theme')
        localStorage.setItem('bloomy_theme', 'dark')
      } else {
        document.body.classList.add('light-theme')
        localStorage.setItem('bloomy_theme', 'light')
      }
      return nextDark
    })
  }

  return (
    <button onClick={toggleTheme} className="theme-toggle" aria-label="Cambiar tema">
      {isDark ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2"/>
          <path d="M12 20v2"/>
          <path d="M4.93 4.93l1.41 1.41"/>
          <path d="M17.66 17.66l1.41 1.41"/>
          <path d="M2 12h2"/>
          <path d="M20 12h2"/>
          <path d="M6.34 17.66l-1.41 1.41"/>
          <path d="M19.07 4.93l-1.41 1.41"/>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="1.5">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      )}
    </button>
  )
}

export default ThemeToggle