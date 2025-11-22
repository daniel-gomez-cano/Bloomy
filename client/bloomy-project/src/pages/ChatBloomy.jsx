import React, { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'
import { streamChat } from '../services/auth'
import BloomyLogo from '../assets/BloomyLogo.svg'
import '../index.css'
import './chatbloomy.css'

export default function ChatBloomy() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([]) // {role:'user'|'assistant', text}
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || streaming) return
    setError('')
    const userMsg = { role: 'user', text: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setStreaming(true)
    let assistantAccum = ''
    setMessages(prev => [...prev, { role: 'assistant', text: '' }])
    await streamChat(newMessages, (token) => {
      assistantAccum += token
      setMessages(prev => {
        const cpy = [...prev]
        const lastIndex = cpy.length - 1
        if (lastIndex >= 0 && cpy[lastIndex].role === 'assistant') {
          cpy[lastIndex] = { ...cpy[lastIndex], text: assistantAccum }
        }
        return cpy
      })
    }, () => {
      setStreaming(false)
    }, (errMsg) => {
      setStreaming(false)
      setError(errMsg)
    })
  }

  const onKey = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      await sendMessage()
    }
  }

  // Simple Markdown renderer (bold, italic, code, headings, lists)
  function renderMarkdown(md) {
    if (!md) return null
    // Basic escapes could be added if needed
    let text = md
    // Inline formatting
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    text = text.replace(/(?<!\*)\*(?!\*)([^*]+?)\*(?!\*)/g, '<em>$1</em>')
    text = text.replace(/`([^`]+?)`/g, '<code>$1</code>')
    const lines = text.split(/\n/)
    const elements = []
    let listBuffer = []
    function flushList() {
      if (listBuffer.length) {
        elements.push(<ul key={'ul-' + elements.length}>{listBuffer.map((li, idx) => <li key={idx} dangerouslySetInnerHTML={{ __html: li }} />)}</ul>)
        listBuffer = []
      }
    }
    lines.forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed) { flushList(); return }
      // Lists
      if (/^[*-]\s+/.test(trimmed)) {
        listBuffer.push(trimmed.replace(/^[*-]\s+/, ''))
        return
      }
      flushList()
      // Headings
      if (/^###\s+/.test(trimmed)) {
        elements.push(<h4 key={'h4-' + elements.length} dangerouslySetInnerHTML={{ __html: trimmed.replace(/^###\s+/, '') }} />)
        return
      }
      if (/^##\s+/.test(trimmed)) {
        elements.push(<h3 key={'h3-' + elements.length} dangerouslySetInnerHTML={{ __html: trimmed.replace(/^##\s+/, '') }} />)
        return
      }
      if (/^#\s+/.test(trimmed)) {
        elements.push(<h2 key={'h2-' + elements.length} dangerouslySetInnerHTML={{ __html: trimmed.replace(/^#\s+/, '') }} />)
        return
      }
      // Paragraph
      elements.push(<p key={'p-' + elements.length} dangerouslySetInnerHTML={{ __html: trimmed }} />)
    })
    flushList()
    return elements
  }

  return (
    <div className="chat-page">
      <Navbar />
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-logo-wrap"><img src={BloomyLogo} alt="Bloomy Logo" className="chat-logo" /></div>
          <h2 className="chat-greeting">Buen día <span className="chat-username">{user?.nombre || user?.correo || 'usuario'}</span> ¿En qué te puedo ayudar?</h2>
          {user?.isPremium ? null : <div className="chat-locked">Acceso restringido a usuarios premium.</div>}
        </div>
        <div className="chat-messages" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role}`}>
              <div className="bubble-inner">
                {renderMarkdown(m.text)}
              </div>
            </div>
          ))}
          {streaming && (
            <div className="chat-bubble assistant typing">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        {error && <div className="chat-error">{error}</div>}
        <form className="chat-input fixed" onSubmit={e => { e.preventDefault(); sendMessage() }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Escribe tu pregunta (agricultura, cultivo, riego...)"
            disabled={streaming}
          />
          <button type="submit" disabled={!input.trim() || streaming}>Enviar</button>
        </form>
        <div className="chat-footer">Límite: 8 mensajes por minuto • Modelo: Gemini</div>
      </div>
    </div>
  )
}