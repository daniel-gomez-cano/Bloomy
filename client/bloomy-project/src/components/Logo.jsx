import React from 'react'

const Logo = () => {
  return (
    <div className="flex items-center gap-4">
      {/* Icono/Logo - simplificado */}
      <div className="w-[58px] h-[44px] flex items-center justify-center">
        <div className="w-10 h-10 bg-bloomy-primary rounded-lg flex items-center justify-center">
          🌱
        </div>
      </div>
      
      {/* Texto Bloomy */}
      <h1 className="text-white text-[32px] font-bold font-lora leading-none">
        Bloomy
      </h1>
    </div>
  )
}

export default Logo