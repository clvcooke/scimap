import { interpolateBlues, interpolateOrRd, interpolateMagma } from 'd3-scale-chromatic'

const LUT_SIZE = 256
const FILL_ALPHA = 200

function buildLUT(interpolator: (t: number) => string): Uint8Array {
  const lut = new Uint8Array(LUT_SIZE * 4)
  for (let i = 0; i < LUT_SIZE; i++) {
    const t = i / (LUT_SIZE - 1)
    const rgb = interpolator(t)
    const o = i * 4
    if (rgb.startsWith('rgb')) {
      const [r, g, b] = rgb.slice(4, -1).split(',')
      lut[o] = parseInt(r, 10)
      lut[o + 1] = parseInt(g, 10)
      lut[o + 2] = parseInt(b, 10)
    } else {
      lut[o] = parseInt(rgb.slice(1, 3), 16)
      lut[o + 1] = parseInt(rgb.slice(3, 5), 16)
      lut[o + 2] = parseInt(rgb.slice(5, 7), 16)
    }
    lut[o + 3] = FILL_ALPHA
  }
  return lut
}

export const LUT_BLUES = buildLUT(interpolateBlues)
export const LUT_OR_RD = buildLUT(interpolateOrRd)
export const LUT_MAGMA_INV = buildLUT((t) => interpolateMagma(1 - t))
export { LUT_SIZE, FILL_ALPHA }
