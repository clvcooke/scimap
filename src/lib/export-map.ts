/**
 * Branded SCIMaP card renderer + download helper.
 *
 * Card layout (top → bottom):
 *   ┌─────────────────────────────────────┐
 *   │  Title + Subtitle        (header)   │
 *   ├─────────── orange accent ───────────┤
 *   │                                     │
 *   │            Map Canvas               │
 *   │                                     │
 *   ├─────────── orange accent ───────────┤
 *   │  Stat 1   Stat 2   Stat 3  SCIMaP  │
 *   │  View · Metric · Date   .org       │
 *   └─────────────────────────────────────┘
 */

export interface InfoSlot {
  label: string
  value: string
}

export interface CardRenderOptions {
  title: string
  subtitle: string
  /** Key headline figures — rendered prominently in the footer. */
  stats: InfoSlot[]
  /** Metadata (view level, date, etc.) — rendered as a compact line. */
  meta: string
  mapWidth: number
  mapHeight: number
  drawMap: (ctx: CanvasRenderingContext2D, y: number) => void
  scale?: number
}

export interface ExportCardOptions {
  container: HTMLElement
  title: string
  subtitle: string
  stats: InfoSlot[]
  meta: string
  filename?: string
}

// ── Layout constants (at scale = 1) ───────────────────────────────────
const HEADER_BASE = 80
const FOOTER_BASE = 76
const ACCENT_BASE = 3
const PAD_BASE = 24
const BRAND_DARK = '#020C45'
const ACCENT_COLOR = '#F1A892'

/**
 * Renders a branded card to an offscreen canvas and returns it.
 */
export function renderCard({
  title,
  subtitle,
  stats,
  meta,
  mapWidth,
  mapHeight,
  drawMap,
  scale = 1,
}: CardRenderOptions): HTMLCanvasElement {
  const headerH = Math.round(HEADER_BASE * scale)
  const footerH = Math.round(FOOTER_BASE * scale)
  const accentH = Math.round(ACCENT_BASE * scale)
  const pad = Math.round(PAD_BASE * scale)

  const totalW = mapWidth
  const totalH = headerH + accentH + mapHeight + accentH + footerH

  const canvas = document.createElement('canvas')
  canvas.width = totalW
  canvas.height = totalH
  const ctx = canvas.getContext('2d')!

  // ── White background (ensures no transparency in exported PNG) ─────
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, totalW, totalH)

  // ── Header ────────────────────────────────────────────────────────
  ctx.fillStyle = BRAND_DARK
  ctx.fillRect(0, 0, totalW, headerH)

  const titleSize = Math.round(22 * scale)
  ctx.font = `700 ${titleSize}px "Libre Baskerville", Georgia, serif`
  ctx.fillStyle = '#FFFFFF'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(title, pad, headerH * 0.48)

  const subSize = Math.round(13 * scale)
  ctx.font = `400 ${subSize}px "DM Sans Variable", "DM Sans", sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.fillText(subtitle, pad, headerH * 0.78)

  // ── Top accent ────────────────────────────────────────────────────
  ctx.fillStyle = ACCENT_COLOR
  ctx.fillRect(0, headerH, totalW, accentH)

  // ── Map content ───────────────────────────────────────────────────
  const mapY = headerH + accentH
  drawMap(ctx, mapY)

  // ── Bottom accent ─────────────────────────────────────────────────
  ctx.fillStyle = ACCENT_COLOR
  ctx.fillRect(0, mapY + mapHeight, totalW, accentH)

  // ── Footer ────────────────────────────────────────────────────────
  const footerY = mapY + mapHeight + accentH
  ctx.fillStyle = BRAND_DARK
  ctx.fillRect(0, footerY, totalW, footerH)

  // Row 1: key stats — label/value pairs, left-to-right
  const labelSize = Math.round(9 * scale)
  const valueSize = Math.round(14 * scale)
  const slotGap = Math.round(28 * scale)
  const row1BaselineLabel = footerY + footerH * 0.30
  const row1BaselineValue = footerY + footerH * 0.55
  let slotX = pad

  for (const slot of stats) {
    ctx.font = `500 ${labelSize}px "DM Sans Variable", "DM Sans", sans-serif`
    ctx.fillStyle = 'rgba(255,255,255,0.45)'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(slot.label.toUpperCase(), slotX, row1BaselineLabel)

    ctx.font = `700 ${valueSize}px "DM Sans Variable", "DM Sans", sans-serif`
    ctx.fillStyle = '#FFFFFF'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(slot.value, slotX, row1BaselineValue)

    const labelW = ctx.measureText(slot.label.toUpperCase()).width
    const valueW = ctx.measureText(slot.value).width
    slotX += Math.max(labelW, valueW) + slotGap
  }

  // Row 2: metadata line (compact)
  const metaSize = Math.round(10 * scale)
  ctx.font = `400 ${metaSize}px "DM Sans Variable", "DM Sans", sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.40)'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(meta, pad, footerY + footerH * 0.82)

  // Branding — right side, vertically centered
  const brandSize = Math.round(20 * scale)
  ctx.font = `700 ${brandSize}px "Libre Baskerville", Georgia, serif`
  ctx.fillStyle = '#FFFFFF'
  ctx.textBaseline = 'alphabetic'
  const brandText = 'SCIMaP'
  const brandW = ctx.measureText(brandText).width
  ctx.fillText(brandText, totalW - pad - brandW, footerY + footerH * 0.42)

  const urlSize = Math.round(10 * scale)
  ctx.font = `400 ${urlSize}px "DM Sans Variable", "DM Sans", sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.50)'
  const urlText = 'scienceimpacts.org'
  const urlW = ctx.measureText(urlText).width
  ctx.fillText(urlText, totalW - pad - urlW, footerY + footerH * 0.65)

  return canvas
}

/**
 * Composites map canvases into a branded card and triggers a PNG download.
 */
export async function exportMapCard({
  container,
  title,
  subtitle,
  stats,
  meta,
  filename = 'scimap.png',
}: ExportCardOptions) {
  await document.fonts.ready

  const canvases = container.querySelectorAll('canvas')
  if (canvases.length === 0) return

  const first = canvases[0]
  const mapW = first.width
  const mapH = first.height
  const scale = mapW / (container.clientWidth || mapW)

  const card = renderCard({
    title,
    subtitle,
    stats,
    meta,
    mapWidth: mapW,
    mapHeight: mapH,
    scale,
    drawMap(ctx, y) {
      canvases.forEach((c) => ctx.drawImage(c, 0, y))
    },
  })

  const link = document.createElement('a')
  link.download = filename
  link.href = card.toDataURL('image/png')
  link.click()
}

/** Current month + year string, e.g. "April 2026" */
export function currentDateLabel(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}
