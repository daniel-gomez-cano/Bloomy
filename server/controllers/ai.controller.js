import { GoogleGenerativeAI } from '@google/generative-ai'
import { verifyToken } from '../services/jwt.js'
import { User } from '../models/User.js'

const COOKIE_NAME = 'bloomy_token'

function buildPrompt({ isPremium, lat, lng, extras }) {
  const base = `
Eres un asesor agrícola experto. Genera un reporte claro, estructurado y práctico en Markdown, en español.
Genera un reporte moderno, visual, bonito y fácil de leer usando **solo Markdown estándar**. 
NO uses arte ASCII (como cuadros hechos con "+---+"), NO uses código para simular tablas,
NO uses delimitadores raros. Solo Markdown real.

El estilo debe ser:
- Títulos claros con ## y ###.
- Tablas Markdown reales.
- Listas con bullets.
- Iconos Unicode (🌱💧🧪☀️🐛📌) para hacerlo visual.
- Bloques destacados usando > (quote) cuando sea útil.
- Diagramas simples hechos en texto pero sin bordes ASCII.
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
Mejora visual obligatoria del reporte:
- Usa Markdown avanzado para hacerlo altamente visual.
- Divide la información en bloques muy claros: tablas, secciones cortas, viñetas.
- Usa emojis solo para resaltar visualmente (🌱 riego, ☀️ sol, 🐛 plagas, ⚠️ riesgo).
- Incluye como mínimo:
  - 1 tabla markdown real de comparativa de cultivos óptimos.
  - 1 cronograma visual (línea de tiempo mensual) para siembra y cosecha por cultivo.
  - 1 tabla/resumen de riegos, fertilización y horas de sol.
  - Indicadores visuales con barras ASCII para representar niveles (por ejemplo: Riego: ███░░ 60%).
- Mantén el reporte conciso y altamente escaneable.
- Evita párrafos largos; usa bloques, listas y resaltados.
- No agregues mensajes introductorios ni despedidas.
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

// ===== Chat Streaming Implementation =====
// Simple in-memory rate limiting: 8 requests per rolling 60s window per user
const chatRate = new Map() // key: userId, value: array of timestamps (ms)

function canProceed(userId) {
  const now = Date.now()
  const arr = chatRate.get(userId) || []
  // keep only last 60s
  const filtered = arr.filter(t => now - t < 60_000)
  if (filtered.length >= 8) return false
  filtered.push(now)
  chatRate.set(userId, filtered)
  return true
}

// Build chat prompt from messages (session only). Expect messages: [{role:'user'|'assistant', text:string}]
function buildChatPrompt(messages) {
  const header = `Eres Bloomy-IA, asistente agrícola premium. Responde SIEMPRE en español, con tono claro, profesional y cercano. Usa Markdown simple (párrafos cortos, listas cuando aporten). No inventes datos climáticos específicos no solicitados ni hagas promesas garantizadas. Si el usuario pregunta algo fuera de agricultura, puedes responder brevemente o pedir que vuelva al contexto agrícola. Evita despedidas formales, responde directo.`
  const convo = messages
    .map(m => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.text.trim()}`)
    .join('\n')
  return `${header}\n\nConversación actual:\n${convo}\n\nResponde al último mensaje del Usuario de forma útil y concisa.`
}

export async function chatStream(req, res) {
  try {
    const token = req.cookies?.[COOKIE_NAME]
    if (!token) return res.status(401).json({ message: 'No autenticado' })
    const payload = verifyToken(token)
    const user = await User.findById(payload.sub)
    if (!user) return res.status(401).json({ message: 'No autenticado' })
    if (!user.isPremium) return res.status(403).json({ message: 'Funcionalidad sólo para usuarios premium' })

    if (!canProceed(user.id)) {
      return res.status(429).json({ message: 'Límite de velocidad excedido (máx 8/min)' })
    }

    const { messages } = req.body || {}
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'messages requerido' })
    }

    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) return res.status(500).json({ message: 'Falta GOOGLE_API_KEY en el servidor' })
    const genAI = new GoogleGenerativeAI(apiKey)
    const modelName = process.env.GOOGLE_MODEL || 'gemini-2.5-flash'
    const model = genAI.getGenerativeModel({ model: modelName })
    const prompt = buildChatPrompt(messages)

    // Prepare streaming response headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders?.()

    function sendEvent(obj) {
      res.write(`data: ${JSON.stringify(obj)}\n\n`)
    }

    try {
      // Streaming via Gemini SDK (generateContentStream). Fallback to non-stream if not available.
      if (typeof model.generateContentStream === 'function') {
        const streamResult = await model.generateContentStream({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
        for await (const item of streamResult.stream) {
          const partText = item?.text()
          if (partText) sendEvent({ token: partText })
        }
      } else {
        const result = await model.generateContent(prompt)
        const text = result?.response?.text?.() || ''
        // Emit in pseudo-chunks (split by sentence) for UX consistency
        text.split(/(?<=[.!?])\s+/).forEach(chunk => {
          if (chunk.trim()) sendEvent({ token: chunk + ' ' })
        })
      }
      sendEvent({ done: true })
      res.end()
    } catch (err) {
      console.error('chatStream inner error', err)
      sendEvent({ error: 'Error generando respuesta' })
      res.end()
    }
  } catch (err) {
    console.error('chatStream error', err)
    return res.status(500).json({ message: 'Error interno' })
  }
}
