import { GoogleGenerativeAI } from '@google/generative-ai'
import { verifyToken } from '../services/jwt.js'
import { User } from '../models/User.js'

const COOKIE_NAME = 'bloomy_token'

function buildPrompt({ isPremium, lat, lng, extras }) {
  const base = `
Eres un asesor agrícola experto. Genera un reporte claro, estructurado y práctico en Markdown, en español.
Contexto del terreno:
- Ubicación (lat, lng): ${lat}, ${lng}
${extras?.dimensions ? `- Dimensiones aproximadas: ${extras.dimensions}` : ''}
${extras?.shape ? `- Disposición del terreno: ${extras.shape}` : ''}

Requisitos generales:
- El reporte debe ser entendible por agricultores de nivel principiante a intermedio.
- Prioriza cultivos viables para el clima general de la región (no inventes coordenadas de ciudades).
- Incluye beneficios prácticos, advertencias y recomendaciones de manejo.

Secciones obligatorias:
1. Resumen ejecutivo (3-5 bullets).
2. Lista de cultivos óptimos para la zona y condiciones (3-6).
3. Guías de siembra y cuidados por cultivo (siembra, riego, fertilización, horas de sol, plagas comunes, cosecha).
`

  const premium = `
4. Consideraciones del historial climático de la zona (tendencias, estacionalidad, riesgos climáticos).
5. Análisis predictivo de rendimiento por cultivo (aprox, con supuestos y rango).
6. Cálculo de densidad ideal por planta y optimización de espacio/recursos.
7. Recomendaciones de fertilización específicas (calendario sugerido y dosis orientativas; no hagas afirmaciones médicas ni garantices rendimientos).
8. Patrones climáticos relevantes y su impacto.
`

  return base + (isPremium ? premium : '') + `
Formato:
- Devuelve en Markdown, con títulos (##) y listas.
- Evita afirmaciones falsas o datos inventados. Si alguna información no se puede determinar, indícalo claramente.
- Evite mensajes de amabilidad como "¡Excelente iniciativa! Como asesor agrícola experto, he preparado un reporte estructurado y práctico para su terreno..." al principio y al final del reporte.
  `
}

export async function generateReport(req, res) {
  try {
    const token = req.cookies?.[COOKIE_NAME]
    if (!token) return res.status(401).json({ message: 'No autenticado' })
    const payload = verifyToken(token)
    const user = await User.findById(payload.sub)
    if (!user) return res.status(401).json({ message: 'No autenticado' })

    const { lat, lng, extras } = req.body || {}
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ message: 'Coordenadas inválidas' })
    }

    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) return res.status(500).json({ message: 'Falta GOOGLE_API_KEY en el servidor' })

    const genAI = new GoogleGenerativeAI(apiKey)
    const modelName = process.env.GOOGLE_MODEL || 'gemini-2.5-flash'
    const model = genAI.getGenerativeModel({ model: modelName })

    const prompt = buildPrompt({ isPremium: !!user.isPremium, lat, lng, extras })
    const result = await model.generateContent(prompt)
    const text = result?.response?.text?.() || 'No se pudo generar el reporte.'
    return res.json({ report: text })
  } catch (err) {
    console.error('generateReport error', err)
    const detail = process.env.NODE_ENV === 'production' ? '' : ` (${err?.message || 'error'})`
    return res.status(500).json({ message: `No se pudo generar el reporte${detail}` })
  }
}
