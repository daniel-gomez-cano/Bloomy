import React, { useState } from 'react'

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true) // Empezamos en modo oscuro, porque es mejor lol
  
  const toggleTheme = () => {
    setIsDark(!isDark)
    // Aquí pondré la lógica para cambiar el tema de toda la aplicación a light o dark
    console.log('Theme toggled:', !isDark ? 'dark' : 'light')
  }
  
  return (
    <button
      onClick={toggleTheme}
      className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {isDark ? (
        // Icono PROVISIONAL de sol para modo claro
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="1.5"
          className="w-5 h-5"
        >
          <circle cx="12" cy="12" r="4"/>
          <path d="m12 2 0 2"/>
          <path d="m12 20 0 2"/>
          <path d="m4.93 4.93 1.41 1.41"/>
          <path d="m17.66 17.66 1.41 1.41"/>
          <path d="m2 12 2 0"/>
          <path d="m20 12 2 0"/>
          <path d="m6.34 17.66-1.41 1.41"/>
          <path d="m19.07 4.93-1.41 1.41"/>
        </svg>
      ) : (
        // Icono también PROVISIONAL de luna para modo oscuro
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
          className="w-5 h-5 text-gray-900"
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      )}
    </button>
  )
}

export default ThemeToggle