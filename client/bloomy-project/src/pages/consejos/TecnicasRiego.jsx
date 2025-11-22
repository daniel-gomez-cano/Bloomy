import React from 'react'

export default function TecnicasRiego() {
  return (
    <section id="tecnicas-riego" className="content-card">
      <h1>Técnicas de Riego</h1>
      <p>El riego adecuado evita estrés hídrico, mejora la absorción de nutrientes y eleva el rendimiento. La técnica ideal depende de clima, textura del suelo, topografía, disponibilidad de agua y etapa fenológica del cultivo.</p>
      <ul>
        <li>Seleccionar el método que maximiza eficiencia y uniformidad.</li>
        <li>Evitar exceso: el agua en exceso desplaza oxígeno y favorece enfermedades.</li>
        <li>Integrar monitoreo (tensiómetros, humedad por sustrato o balance hídrico) para calendarizar.</li>
      </ul>

      <h2 id="riego-goteo">Riego por goteo</h2>
      <p>Proporciona agua de manera localizada y lenta directamente a la zona radicular. Produce menos evaporación y reduce malezas fuera de la línea húmeda.</p>
      <ul>
        <li><strong>Eficiencia:</strong> Puede superar 90% de aprovechamiento del agua.</li>
        <li><strong>Fertirrigación:</strong> Permite aplicar nutrientes disueltos con precisión espacial y temporal.</li>
        <li><strong>Sanidad:</strong> Menor humedad foliar reduce incidencia de hongos.</li>
        <li><strong>Mantenimiento:</strong> Requiere filtrado y limpieza periódica para evitar obstrucciones.</li>
      </ul>

      <h2 id="riego-aspersion">Riego por aspersión</h2>
      <p>Distribuye agua mediante boquillas que simulan lluvia sobre la superficie. Versátil para diferentes cultivos y topografías moderadas.</p>
      <ul>
        <li><strong>Uniformidad:</strong> Depende de presión estable y diseño adecuado (solape entre aspersores).</li>
        <li><strong>Pérdidas por viento:</strong> Rachas fuertes desvían gotas; regar temprano en la mañana reduce evaporación.</li>
        <li><strong>Costos:</strong> Inversión media; mantenimiento en boquillas y bombas.</li>
        <li><strong>Riesgo sanitario:</strong> Mayor humedad foliar nocturna puede favorecer mildiu o roya.</li>
      </ul>

      <h2 id="riego-eficiente">Manejo eficiente del agua</h2>
      <p>Optimizar el uso del agua protege el recurso y aporta sostenibilidad. Requiere monitoreo continuo y ajustes por clima.</p>
      <ul>
        <li><strong>Programación:</strong> Basada en evapotranspiración (ET) local y coeficientes de cultivo (Kc).</li>
        <li><strong>Monitoreo:</strong> Tensiometros o sensores capacitivos para identificar momento exacto de riego.</li>
        <li><strong>Mulching:</strong> Cubiertas orgánicas/plástico reducen evaporación directa del suelo.</li>
        <li><strong>Riego temprano:</strong> Aplicar antes de horas de máxima radiación disminuye pérdidas.</li>
        <li><strong>Prevención de salinidad:</strong> Fraccionar riegos y realizar lavados cuando conductividad aumenta.</li>
        <li><strong>Registro:</strong> Llevar bitácora de láminas aplicadas vs rendimiento final.</li>
      </ul>
    </section>
  )
}
