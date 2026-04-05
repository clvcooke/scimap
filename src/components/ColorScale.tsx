import { scaleLinear } from 'd3-scale'
import { interpolateBlues, interpolateMagma } from 'd3-scale-chromatic'

const COMPACT = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short',
})

interface ColorScaleProps {
  domain: [number, number]
  buckets?: number
  useMagma?: boolean
}

export default function ColorScale({
  domain,
  buckets = 6,
  useMagma = false,
}: ColorScaleProps) {
  const colorScale = scaleLinear()
    .domain([0, buckets - 1])
    .range([0, 1])
    .clamp(true)

  const logMax = Math.log(domain[1])
  const logMin = domain[0] > 1 ? Math.log(domain[0]) : 0

  const steps = Array.from({ length: buckets }, (_, i) => {
    const color = useMagma
      ? interpolateMagma(1 - colorScale(buckets - 1 - i))
      : interpolateBlues(colorScale(buckets - 1 - i))

    let label: string
    if (i === buckets - 1) {
      const prev = Math.exp(logMax - (i - 1) * ((logMax - logMin) / buckets))
      label = `<$${COMPACT.format(Math.round(prev / 100) * 100)}`
    } else {
      const value = Math.exp(logMax - i * ((logMax - logMin) / buckets))
      label = `$${COMPACT.format(Math.round(value / 100) * 100)}${i === 0 ? '+' : ''}`
    }

    return { color: useMagma ? color + 'C8' : color, label }
  })

  return (
    <div className="flex rounded-lg bg-white/50">
      <div className="flex w-2.5 flex-col overflow-hidden rounded-l md:w-3">
        {steps.map((s, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: s.color }} />
        ))}
      </div>
      <div className="flex flex-col">
        {steps.map((s, i) => (
          <div
            key={i}
            className="flex flex-1 items-center px-1.5 text-[10px] font-medium text-gray-700 md:text-xs"
          >
            {s.label}
          </div>
        ))}
      </div>
    </div>
  )
}
