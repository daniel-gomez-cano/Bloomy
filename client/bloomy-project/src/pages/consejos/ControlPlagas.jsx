import React from 'react'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, RadialLinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2'

ChartJS.register(ArcElement, CategoryScale, LinearScale, RadialLinearScale, BarElement, PointElement, LineElement, Tooltip, Legend)
export default function ControlPlagas() {
  const incidenciaPorMes = {
    labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    datasets: [
      { label: 'Pulgones', backgroundColor: '#3B82F6', data: [12,18,22,30,28,20,15,14,12,10,8,6] },
      { label: 'Mosca blanca', backgroundColor: '#EF4444', data: [6,8,12,18,22,24,20,16,12,10,8,6] }
    ]
  }

  const eficaciaMetodos = {
    labels: ['Neem','Jabón potásico','Trampas amarillas','Aceite mineral','Bacillus T.'],
    datasets: [{
      data: [75, 65, 55, 60, 70],
      backgroundColor: ['#10B981','#3B82F6','#F59E0B','#8B5CF6','#EC4899']
    }]
  }

  const radarResistencia = {
    labels: ['Pulgones','Mosca blanca','Trips','Araña roja','Minadores'],
    datasets: [
      { label: 'Químicos sintéticos', data: [70, 60, 55, 65, 50], borderColor: '#EF4444', backgroundColor: '#EF444433' },
      { label: 'Control biológico', data: [50, 45, 40, 55, 35], borderColor: '#10B981', backgroundColor: '#10B98133' }
    ]
  }

  const lineaMonitoreo = {
    labels: ['Semana 1','Semana 2','Semana 3','Semana 4','Semana 5','Semana 6'],
    datasets: [
      { label: 'Individuos por trampa', data: [5,9,12,11,8,6], borderColor: '#3B82F6', backgroundColor: '#3B82F633', tension: 0.3 },
      { label: '% hojas afectadas', data: [2,4,6,7,5,3], borderColor: '#F59E0B', backgroundColor: '#F59E0B33', tension: 0.3 }
    ]
  }

  return (
    <div className="consejo-section">
      <h2>Control de Plagas</h2>
      <p>Usa manejo integrado: monitoreo, barreras físicas, trampas y control biológico. Minimiza químicos para evitar resistencia.</p>
      <div className="charts-grid">
        <div className="chart-card"><h4>Incidencia mensual</h4><Bar data={incidenciaPorMes} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} /></div>
      </div>

      <h2 id="metodos-preventivos">Métodos preventivos</h2>
      <p>Prevención efectiva disminuye la presión inicial y retrasa brotes severos.</p>
      <ul>
        <li><strong>Rotación de cultivos:</strong> Interrumpe ciclos de insectos y patógenos específicos.</li>
        <li><strong>Variedades resistentes:</strong> Selección genética con tolerancia a plagas clave.</li>
        <li><strong>Higiene y sanidad:</strong> Retirar residuos infectados, desinfectar herramientas.</li>
        <li><strong>Suelo sano:</strong> Materia orgánica y microbios benéficos aumentan resiliencia.</li>
        <li><strong>Barreras físicas:</strong> Mallas anti-insectos, trampas cromáticas y feromonas para monitoreo.</li>
        <li><strong>Manejo del microclima:</strong> Distancias y poda que reducen humedad y favorecen ventilación.</li>
      </ul>
      <div className="charts-grid">
        <div className="chart-card"><h4>Monitoreo semanal</h4><Line data={lineaMonitoreo} options={{ scales: { y: { beginAtZero: true } } }} /></div>
      </div>

      <h2 id="control-biologico">Control biológico</h2>
      <p>Aprovecha enemigos naturales para suprimir poblaciones de plagas sin residuos químicos.</p>
      <ul>
        <li><strong>Depredadores:</strong> Mariquitas (Coccinélidos) contra pulgones; crisopas para trips.</li>
        <li><strong>Parasitoides:</strong> Avispas diminutas que parasitan huevos o larvas (Trichogramma).</li>
        <li><strong>Microorganismos:</strong> Hongos entomopatógenos (Beauveria) y bacterias (Bacillus thuringiensis).</li>
        <li><strong>Liberaciones controladas:</strong> Introducir lotes comerciales en momentos estratégicos.</li>
        <li><strong>Conservación:</strong> Flores nativas y setos proveen polen y refugio, sosteniendo poblaciones benéficas.</li>
      </ul>
      <div className="charts-grid">
        <div className="chart-card"><h4>Resistencia comparada</h4><Radar data={radarResistencia} /></div>
      </div>

      <h2 id="insecticidas-naturales">Insecticidas naturales</h2>
      <p>Reducen impacto ambiental y riesgo de residuos, aunque deben usarse con criterio y rotar modos de acción.</p>
      <ul>
        <li><strong>Jabones potásicos:</strong> Desorganizan cutícula de insectos de cuerpo blando (pulgones). Aplicar al atardecer.</li>
        <li><strong>Aceite de neem:</strong> Interfiere en alimentación y muda; efectivo en estadios juveniles.</li>
        <li><strong>Piretrinas:</strong> Extracto de flores de crisantemo; acción rápida, evitar altas temperaturas.</li>
        <li><strong>Extractos caseros:</strong> Ajo, ají y cebolla como repelentes suaves; colar y aplicar con buena cobertura.</li>
        <li><strong>Compatibilidad:</strong> Validar mezcla previa y no aplicar sobre plantas estresadas.</li>
      </ul>
      <p>Siempre monitorea antes y después del tratamiento para evaluar eficacia y evitar aplicaciones innecesarias.</p>
      <div className="charts-grid">
        <div className="chart-card"><h4>Eficacia de métodos (%)</h4><Doughnut data={eficaciaMetodos} /></div>
      </div>
    </div>
  )
}
