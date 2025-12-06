import React from 'react'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend)

export default function PreparacionSuelo() {
  const pHDistribucion = {
    labels: ['5.5','6.0','6.5','7.0','7.5'],
    datasets: [{ label: 'Muestras', data: [4,12,18,10,3], backgroundColor: '#8B5CF6' }]
  }

  const materiaOrganica = {
    labels: ['Parcela A','Parcela B','Parcela C','Parcela D'],
    datasets: [{ label: '% MO', data: [2.1, 2.8, 3.5, 2.4], backgroundColor: ['#10B981','#3B82F6','#F59E0B','#EC4899'] }]
  }

  const humedadSemanal = {
    labels: ['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6'],
    datasets: [{ label: '% humedad', data: [45,50,52,48,55,53], borderColor: '#3B82F6', backgroundColor: '#3B82F633', tension: 0.3 }]
  }
  return (
    <section id="preparacion-suelo" className="content-card">
      <h1>Preparación del Suelo</h1>
      <p>Un suelo bien preparado es la base para un cultivo exitoso. Antes de sembrar, es esencial:</p>
      <ul>
        <li>Realizar un análisis del suelo para determinar su pH y nutrientes.</li>
        <li>Incorporar materia orgánica como compost o humus para mejorar la estructura.</li>
        <li>Garantizar un buen drenaje para evitar encharcamientos que dañen las raíces.</li>
      </ul>

      <h2 id="suelo-analisis">Análisis del suelo</h2>
      <p>El análisis de suelo permite conocer el estado químico y físico antes de invertir en fertilizantes. Idealmente se toma una muestra compuesta (de 8 a 12 submuestras) a una profundidad de 15–20 cm usando una barrena limpia. Se mezcla, se seca a la sombra y se envía a un laboratorio.</p>
      <ul>
        <li><strong>pH:</strong> Determina disponibilidad de nutrientes. La mayoría de hortalizas prosperan entre 6.0 y 7.2.</li>
        <li><strong>Materia orgánica:</strong> Influye en retención de agua, aireación y CIC (capacidad de intercambio catiónico).</li>
        <li><strong>Nutrientes principales (N-P-K):</strong> N para crecimiento vegetativo, P para raíces y floración, K para vigor y calidad de frutos.</li>
        <li><strong>Secundarios y micro:</strong> Ca, Mg, S y trazas (Fe, Zn, Mn, B) evitan deficiencias ocultas.</li>
        <li><strong>Textura:</strong> Arena vs limo vs arcilla afecta infiltración y manejo de riego.</li>
      </ul>
      <p>Interpretar correctamente el informe evita fertilizaciones excesivas que encarecen el cultivo y pueden contaminar fuentes de agua. Repetir cada 1–2 años o antes de cambiar la rotación.</p>
      <div className="charts-grid">
        <div className="chart-card"><h4>Distribución de pH</h4><Bar data={pHDistribucion} options={{ scales: { y: { beginAtZero: true } } }} /></div>
      </div>

      <h2 id="suelo-nutrientes">Mejora de nutrientes</h2>
      <p>Con los resultados del análisis se diseña un plan de mejora equilibrado. La estrategia combina aporte orgánico y correcciones minerales puntuales.</p>
      <ul>
        <li><strong>Materia orgánica estable:</strong> Compost maduro y humus mejoran estructura y liberan nutrientes lentamente.</li>
        <li><strong>Biofertilizantes:</strong> Extractos de compost, microorganismos benéficos y lixiviados aportan vida microbiana.</li>
        <li><strong>Enmiendas de pH:</strong> Cal agrícola o dolomita elevan pH y aportan Ca/Mg; azufre elemental lo reduce gradualmente.</li>
        <li><strong>Fertilización localizada:</strong> Colocar P y K cerca de la zona radicular inicial optimiza absorción y reduce pérdidas.</li>
        <li><strong>Cobertura vegetal:</strong> Abonos verdes (leguminosas) fijan nitrógeno y protegen el suelo de erosión.</li>
      </ul>
      <p>Evita sobre fertilizar: dosis fraccionadas (parceladas) y monitoreo visual de deficiencias (clorosis, necrosis marginal) permiten ajustes finos.</p>
      <div className="charts-grid">
        <div className="chart-card"><h4>Materia orgánica (%)</h4><Doughnut data={materiaOrganica} /></div>
      </div>

      <h2 id="suelo-drenaje">Drenaje y aireación</h2>
      <p>El exceso de agua reduce el oxígeno disponible, favorece pudriciones y limita absorción de nutrientes. Una buena aireación promueve raíces activas y microorganismos benéficos.</p>
      <ul>
        <li><strong>Elevación de camas:</strong> Camas altas (15–25 cm) mejoran infiltración y escurrimiento en suelos pesados.</li>
        <li><strong>Textura y agregados:</strong> Incorporar arena gruesa y materia orgánica estable mejora porosidad.</li>
        <li><strong>Canales o zanjas:</strong> Pequeños drenajes perimetrales evacúan lluvias intensas y evitan encharcamientos.</li>
        <li><strong>Evitar compactación:</strong> Limitar paso de maquinaria o pisoteo cuando el suelo está húmedo; usar herramientas apropiadas.</li>
        <li><strong>Aireación mecánica:</strong> Escarificado superficial rompe costras que impiden la entrada de agua y aire.</li>
      </ul>
      <p>Después de lluvias fuertes revisar zonas bajas y corregir antes de la siguiente siembra. La aireación adecuada reduce enfermedades radiculares y mejora eficiencia del riego.</p>
      <div className="charts-grid">
        <div className="chart-card"><h4>Evolución de humedad</h4><Line data={humedadSemanal} options={{ scales: { y: { beginAtZero: true } } }} /></div>
      </div>

    </section>
  )
}
