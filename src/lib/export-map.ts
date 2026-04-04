/**
 * Composites all canvas elements inside a container into a single PNG and triggers a download.
 * Requires `preserveDrawingBuffer: true` on WebGL contexts (DeckGL + Maplibre).
 */
export function exportMapAsPng(container: HTMLElement, filename = 'scimap.png') {
  const canvases = container.querySelectorAll('canvas')
  if (canvases.length === 0) return

  const first = canvases[0]
  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = first.width
  exportCanvas.height = first.height
  const ctx = exportCanvas.getContext('2d')!

  canvases.forEach((c) => ctx.drawImage(c, 0, 0))

  const link = document.createElement('a')
  link.download = filename
  link.href = exportCanvas.toDataURL('image/png')
  link.click()
}
