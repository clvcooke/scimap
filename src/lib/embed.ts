export const EMBED_MAPS = {
  baseline: { path: '/baseline', title: 'SCIMaP baseline research funding' },
  grants: { path: '/grants', title: 'SCIMaP grant terminations' },
  fy27: { path: '/fy27', title: 'SCIMaP FY2027 budget impacts' },
  idc: { path: '/idc', title: 'SCIMaP research infrastructure funding cuts' },
} as const
export type EmbedMap = keyof typeof EMBED_MAPS
export function embedMap(value: unknown): EmbedMap {
  return typeof value === 'string' && Object.hasOwn(EMBED_MAPS, value) ? value as EmbedMap : 'grants'
}
export function escapeAttribute(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)
}
export function buildEmbed(map: EmbedMap, requestedHeight: number, title: string) {
  const selected = EMBED_MAPS[map]
  const height = Number.isFinite(requestedHeight) ? Math.min(1600, Math.max(400, Math.round(requestedHeight))) : 500
  const pageUrl = `https://scienceimpacts.org${selected.path}`
  const src = pageUrl + '?chromeless=true'
  const accessibleTitle = title.trim().slice(0, 160) || selected.title
  const html = `<iframe\n  src="${src}"\n  title="${escapeAttribute(accessibleTitle)}"\n  width="100%"\n  height="${height}"\n  style="border: 0; display: block; width: 100%;"\n  loading="lazy"\n  referrerpolicy="strict-origin-when-cross-origin"\n></iframe>\n<p>Credit: Science and Community Impacts Mapping Project, <a href="https://scienceimpacts.org" target="_blank" rel="noopener noreferrer">scienceimpacts.org</a>. <a href="${pageUrl}" target="_blank" rel="noopener noreferrer">Open the full map on SCIMaP</a></p>`
  return { html, src, pageUrl, title: accessibleTitle, height }
}
