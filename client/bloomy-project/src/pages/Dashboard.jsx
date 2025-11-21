import React, { useState, useRef } from 'react'
import Navbar from '../components/Navbar'
import Map from '../components/Map'
import { useAuth } from '../hooks/useAuth'
import './dashboard.css'
import { createCheckoutSession, confirmCheckoutSession } from '../services/stripe'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { generateAIReport } from '../services/ai'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Dashboard() {
  const { user } = useAuth()
  const { refresh } = useAuth()
  const [searchParams] = useSearchParams()
  const [coords, setCoords] = useState(null)
  const [dimensions, setDimensions] = useState('')
  const [shape, setShape] = useState('Irregular')
  const [report, setReport] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [reportError, setReportError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const reportRef = useRef(null)
  const facts = [
    'Las abejas polinizan cerca del 75% de los cultivos que consumimos.',
    'La rotación de cultivos ayuda a mantener la salud del suelo y reduce plagas.',
    'El pH del suelo influye en la disponibilidad de nutrientes para las plantas.',
    'El riego por goteo puede ahorrar hasta un 50% de agua frente al riego tradicional.',
    'La materia orgánica mejora la retención de agua y la estructura del suelo.'
  ]
  const [factIndex, setFactIndex] = useState(0)

  const handleUbicacionSeleccionada = (latlng) => {
    setCoords(latlng)
  }

  // If we come back from Checkout with a session_id, refresh user
  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) return
    (async () => {
      try {
        // Confirm on server (fallback when webhook isn’t available locally)
        await confirmCheckoutSession(sessionId)
      } catch (e) {
        // Not fatal; webhook may have already upgraded the user
        console.warn('Confirm session fallback failed (webhook may handle it):', e?.response?.data || e.message)
      } finally {
        try { await refresh() } catch {}
      }
    })()
  }, [searchParams])

  // Rotate facts while loading
  useEffect(() => {
    if (!reportLoading) return
    const id = setInterval(() => {
      setFactIndex((i) => (i + 1) % facts.length)
    }, 6000)
    return () => clearInterval(id)
  }, [reportLoading])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="dashboard">
        <section className="ia-report-section">
          <h2>Reporte de IA</h2>
          {!report && !reportLoading && (
            <p>Selecciona una ubicación en el mapa y pulsa "Generar Reporte" para obtener recomendaciones personalizadas.</p>
          )}
          {reportLoading && (
            <div>
              <div className="loading-wrap">
                <div className="spinner" />
                <div>Generando reporte, por favor espera…</div>
              </div>
              <div className="didyouknow">
                <span className="label">¿Sabías que?</span>
                <span>{facts[factIndex]}</span>
              </div>
            </div>
          )}
          {reportError && <p style={{ color: '#ff6b6b' }}>{reportError}</p>}
          {report && (
            <div className="markdown-body" ref={reportRef}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{report}</ReactMarkdown>
            </div>
          )}
        </section>

        <section className="map-section">
          <div className="map-placeholder">
            {/* Integración del Map aquí */}
            <Map onUbicacionSeleccionada={handleUbicacionSeleccionada} />
          </div>
          {/* Non-premium: solo mostrar 'Mejorar a Premium' y 'Generar Reporte' */}
          {!user?.isPremium ? (
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                className="btn-accent"
                onClick={async () => {
                  try {
                    const data = await createCheckoutSession()
                    if (data?.url) {
                      window.location.href = data.url
                    } else {
                      console.error('No session URL returned')
                    }
                  } catch (err) {
                    console.error('Checkout error', err)
                  }
                }}
              >
                Mejorar a Premium
              </button>
              <button
                className="btn-outline"
                onClick={async () => {
                  setReportError('')
                  if (!coords) { setReportError('Selecciona una ubicación en el mapa.'); return }
                  try {
                    setReportLoading(true)
                    const { report: r } = await generateAIReport({ lat: coords.lat, lng: coords.lng })
                    setReportLoading(false)
                    setReport(r)
                  } catch (err) {
                    setReportLoading(false)
                    setReportError(err?.response?.data?.message || 'No se pudo generar el reporte')
                  }
                }}
              >
                Generar Reporte
              </button>
            </div>
          ) : (
            <>
              {/* Premium: mantiene los campos e inputs actuales */}
              <div className="input-group">
                <div className="field">
                  <label htmlFor="dimensions">Dimensiones del terreno (m²)</label>
                  <input value={dimensions} onChange={(e)=>setDimensions(e.target.value)} type="text" id="dimensions" placeholder="Ej: 20x20 ?" />
                </div>
                <button
                  className="btn-accent"
                  onClick={async () => {
                    setReportError('')
                    if (!coords) { setReportError('Selecciona una ubicación en el mapa.'); return }
                    try {
                      setReportLoading(true)
                      const { report: r } = await generateAIReport({ lat: coords.lat, lng: coords.lng, extras: { dimensions, shape } })
                      setReportLoading(false)
                      setReport(r)
                    } catch (err) {
                      setReportLoading(false)
                      setReportError(err?.response?.data?.message || 'No se pudo generar el reporte')
                    }
                  }}
                >
                  Generar Reporte
                </button>
              </div>

              <div className="input-group">
                <div className="field">
                  <label htmlFor="shape">Disposición del terreno</label>
                  <select value={shape} onChange={(e)=>setShape(e.target.value)} id="shape">
                    <option>Irregular</option>
                    <option>Cuadrado</option>
                    <option>Triangular</option>
                  </select>
                </div>
                <button
                  className="btn-outline"
                  disabled={downloading}
                  onClick={async () => {
                    if (!report) {
                      alert("Primero genera un reporte antes de descargar.");
                      return;
                    }

                    setDownloading(true);

                    try {
                      const { jsPDF } = await import("jspdf");
                      const autoTable = (await import("jspdf-autotable")).default;
                      const doc = new jsPDF({ unit: "pt", format: "a4" });

                      const marginX = 40;
                      const marginTop = 70;
                      const lineHeight = 16;
                      const pageWidth = doc.internal.pageSize.getWidth();
                      const pageHeight = doc.internal.pageSize.getHeight();
                      const usableWidth = pageWidth - marginX * 2;
                      let y = marginTop;

                      /* ------------------------------------------------------------
                      *  SANITIZAR TEXTO
                      * ------------------------------------------------------------ */
                      const sanitize = (txt) => {
                        if (!txt) return "";

                        return txt
                          .replace(/[\u2018\u2019]/g, "'")
                          .replace(/[\u201C\u201D]/g, '"')
                          .replace(/[\u2013\u2014]/g, "-")
                          .replace(/\u2022/g, "-")
                          .replace(/\u00A0/g, " ")
                          .replace(/\u200B/g, "")
                          .replace(/[Øßþ§¤]/g, "")
                          .replace(/&{2,}/g, " ")
                          .replace(/[^\u00C0-\u00FF\x20-\x7E\n#*]/g, "")
                          .replace(/\s{2,}/g, " ")
                          .trim();
                      };

                      /* ------------------------------------------------------------
                      *  HEADER
                      * ------------------------------------------------------------ */
                      const addHeader = (title = "Bloomy - Reporte Agrícola") => {
                        doc.setFillColor(3, 140, 131);
                        doc.rect(0, 0, pageWidth, 50, "F");

                        doc.setTextColor(255, 255, 255);
                        doc.setFont("helvetica", "bold");
                        doc.setFontSize(16);
                        doc.text(title, marginX, 30);

                        doc.setFont("helvetica", "normal");
                        doc.setFontSize(10);
                        doc.text(
                          `Generado: ${new Date().toLocaleDateString()} • Coordenadas: ${
                            coords
                              ? coords.lat.toFixed(4) + ", " + coords.lng.toFixed(4)
                              : "N/D"
                          }`,
                          marginX,
                          44
                        );

                        doc.setTextColor(0, 0, 0);
                      };

                      const addPageIfNeeded = (increment = lineHeight) => {
                        if (y + increment > pageHeight - 40) {
                          doc.addPage();
                          addHeader("Bloomy - Reporte (continuación)");
                          y = marginTop;
                        }
                      };

                      /* ------------------------------------------------------------
                      *  TITULOS / SUBTITULOS
                      * ------------------------------------------------------------ */
                      const drawHeading = (text, level) => {
                        const sizeMap = { 1: 20, 2: 16, 3: 14, 4: 12, 5: 12, 6: 12 };
                        const fs = sizeMap[level] || 14;

                        const lines = doc.splitTextToSize(sanitize(text), usableWidth);
                        addPageIfNeeded(fs * lines.length + 10);

                        doc.setFont("helvetica", "bold");
                        doc.setFontSize(fs);

                        lines.forEach((line) => {
                          doc.text(line, marginX, y);
                          y += fs + 2;
                        });

                        doc.setFont("helvetica", "normal");
                        doc.setFontSize(11);
                      };

                      /* ------------------------------------------------------------
                      *  PÁRRAFOS CON NEGRITA
                      * ------------------------------------------------------------ */
                      const drawParagraph = (text) => {
                        const parts = text.split(/(\*\*[^*]+?\*\*|\*[^*]+?\*)/);

                        parts.forEach((part) => {
                          if (!part) return;

                          const boldMatch =
                            /^\*\*(.*?)\*\*$/.exec(part) || /^\*(.*?)\*$/.exec(part);

                          const content = sanitize(boldMatch ? boldMatch[1] : part);
                          const lines = doc.splitTextToSize(content, usableWidth);

                          lines.forEach((line) => {
                            addPageIfNeeded(lineHeight);
                            doc.setFont("helvetica", boldMatch ? "bold" : "normal");
                            doc.text(line, marginX, y);
                            y += lineHeight;
                          });
                        });

                        y += 4;
                      };

                      /* ------------------------------------------------------------
                      *  LISTAS (CON NEGRITA)
                      * ------------------------------------------------------------ */
                      const drawListItem = (text) => {
                        const parts = text.split(/(\*\*[^*]+?\*\*|\*[^*]+?\*)/);
                        let prefix = "• ";

                        parts.forEach((part, index) => {
                          if (!part) return;

                          const boldMatch =
                            /^\*\*(.*?)\*\*$/.exec(part) || /^\*(.*?)\*$/.exec(part);

                          const content = sanitize(boldMatch ? boldMatch[1] : part);
                          const lines = doc.splitTextToSize(content, usableWidth - 20);

                          lines.forEach((line, i) => {
                            addPageIfNeeded(lineHeight);
                            doc.setFont("helvetica", boldMatch ? "bold" : "normal");

                            const bullet = i === 0 && index === 0 ? prefix : "  ";
                            doc.text(bullet + line, marginX, y);

                            y += lineHeight;
                          });
                        });
                      };

                      /* ------------------------------------------------------------
                      *  TABLAS
                      * ------------------------------------------------------------ */
                      const drawTable = (rows) => {
                        if (!rows.length) return;

                        const head = [rows[0].map((c) => sanitize(c))];
                        const body = rows.slice(1).map((r) => r.map((c) => sanitize(c)));

                        addPageIfNeeded(30);

                        autoTable(doc, {
                          head,
                          body,
                          startY: y,
                          margin: { left: marginX, right: marginX },
                          styles: { font: "helvetica", fontSize: 10, cellPadding: 4 },
                          headStyles: {
                            fillColor: [240, 240, 240],
                            textColor: 0,
                            fontStyle: "bold",
                          },
                        });

                        y = doc.lastAutoTable.finalY + 8;
                      };

                      /* ------------------------------------------------------------
                      *  PROCESAMIENTO DEL REPORTE
                      * ------------------------------------------------------------ */
                      addHeader();

                      const lines = report.split(/\r?\n/);
                      let tableBuf = [];

                      const isAlignRow = (cells) =>
                        cells.every((c) => /^:?-{3,}:?$/.test(c.trim()));

                      const flushTable = () => {
                        if (tableBuf.length) {
                          drawTable(tableBuf);
                          tableBuf = [];
                        }
                      };

                      for (let raw of lines) {
                        let line = raw.trim();

                        if (!line) {
                          flushTable();
                          y += 4;
                          continue;
                        }

                        // Corrige casos como "Pimentón- **Siembra"
                        line = line.replace(/([A-Za-zÁÉÍÓÚáéíóúñ])-(\s*\*\*)/g, "$1 - $2");

                        // TABLAS
                        if (/^\|.*\|$/.test(line)) {
                          const cells = line.split("|").slice(1, -1);
                          if (!isAlignRow(cells)) tableBuf.push(cells);
                          continue;
                        } else {
                          flushTable();
                        }

                        // ENCABEZADOS
                        const headerMatch =
                          /^(#{1,6})\s+([^-\n]+?)(?:\s+-\s+(.*))?$/.exec(line);

                        if (headerMatch) {
                          const level = headerMatch[1].length;
                          const title = headerMatch[2];
                          const rest = headerMatch[3];

                          drawHeading(title, level);
                          if (rest) drawParagraph(rest);

                          continue;
                        }

                        // LISTAS
                        const li = /^[-*+]\s+(.*)$/.exec(line);
                        if (li) {
                          drawListItem(li[1]);
                          continue;
                        }

                        // LISTAS NUMERADAS
                        const nli = /^\d+\.\s+(.*)$/.exec(line);
                        if (nli) {
                          drawListItem(nli[1]);
                          continue;
                        }

                        // PÁRRAFOS NORMALES
                        drawParagraph(line);
                      }

                      flushTable();
                      doc.save("reporte_bloomy.pdf");
                    } catch (e) {
                      console.error("Error exportando PDF", e);
                      alert("No se pudo generar el PDF correctamente.");
                    } finally {
                      setDownloading(false);
                    }
                  }}
                >
                  {downloading ? "Generando…" : "Descargar PDF"}
                </button>

              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}

