import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { renderCard, currentDateLabel, type InfoSlot } from '@/lib/export-map'
import { BASELINE_SLOTS, GRANTS_SLOTS, FY26_SLOTS, IDC_SLOTS } from '@/lib/card-stats'

export const Route = createFileRoute('/export-preview')({
  component: ExportPreviewRoute,
})

interface CardDef {
  title: string
  subtitle: string
  stats: InfoSlot[]
  meta: string
  filename: string
  mapColor: string
}

const CARDS: CardDef[] = [
  {
    title: 'NIH Economic Impact',
    subtitle: 'Baseline Federal Research Funding Across the U.S.',
    stats: BASELINE_SLOTS,
    meta: `States  ·  Total  ·  ${currentDateLabel()}`,
    filename: 'scimap-baseline.png',
    mapColor: '#dde4ec',
  },
  {
    title: 'Grant Disruptions',
    subtitle: 'Terminated & At-Risk Federal Research Grants',
    stats: GRANTS_SLOTS,
    meta: `Counties  ·  ${currentDateLabel()}`,
    filename: 'scimap-grant-disruptions.png',
    mapColor: '#e8ddd5',
  },
  {
    title: 'FY26 Budget Impact',
    subtitle: 'Projected NIH Funding Cuts by Region',
    stats: FY26_SLOTS,
    meta: `Districts  ·  ${currentDateLabel()}`,
    filename: 'scimap-fy26-budget.png',
    mapColor: '#d5d0e8',
  },
  {
    title: 'IDC Rate Analysis',
    subtitle: 'Indirect Cost Recovery Impact on Research Funding',
    stats: IDC_SLOTS,
    meta: `States  ·  ${currentDateLabel()}`,
    filename: 'scimap-idc-analysis.png',
    mapColor: '#dde8d5',
  },
]

const MAP_W = 960
const MAP_H = 540

function CardPreview({ def }: { def: CardDef }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    async function draw() {
      await document.fonts.ready

      const card = renderCard({
        title: def.title,
        subtitle: def.subtitle,
        stats: def.stats,
        meta: def.meta,
        mapWidth: MAP_W,
        mapHeight: MAP_H,
        drawMap(ctx, y) {
          ctx.fillStyle = def.mapColor
          ctx.fillRect(0, y, MAP_W, MAP_H)

          ctx.strokeStyle = 'rgba(0,0,0,0.08)'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(MAP_W / 2, y)
          ctx.lineTo(MAP_W / 2, y + MAP_H)
          ctx.moveTo(0, y + MAP_H / 2)
          ctx.lineTo(MAP_W, y + MAP_H / 2)
          ctx.stroke()

          ctx.fillStyle = 'rgba(0,0,0,0.12)'
          ctx.font = '14px "DM Sans Variable", sans-serif'
          ctx.textBaseline = 'middle'
          ctx.textAlign = 'center'
          ctx.fillText('Map Content', MAP_W / 2, y + MAP_H / 2)
          ctx.textAlign = 'start'
        },
      })

      const el = canvasRef.current
      if (!el) return
      el.width = card.width
      el.height = card.height
      el.getContext('2d')!.drawImage(card, 0, 0)
    }
    void draw()
  }, [def])

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-500">{def.filename}</h3>
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg border border-gray-200 shadow-sm"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  )
}

function ExportPreviewRoute() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-brand-blue-dark">Export Card Preview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Static previews of the download card for each map. The colored area is where the live map
          canvas gets composited.
        </p>
      </div>

      {CARDS.map((def) => (
        <CardPreview key={def.filename} def={def} />
      ))}
    </div>
  )
}
