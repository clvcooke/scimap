import { describe, expect, it } from 'vitest'
import { buildEmbed, embedMap, EMBED_MAPS, getEmbedLayout } from './embed'

describe('partner embed code', () => {
  it('allows known map routes and rejects arbitrary URLs/prototype keys', () => {
    for (const key of Object.keys(EMBED_MAPS)) expect(embedMap(key)).toBe(key)
    for (const input of ['https://evil.test', '__proto__', 'constructor', undefined]) expect(embedMap(input)).toBe('grants')
  })
  it('escapes a supplied title so it cannot become iframe markup', () => {
    const code = buildEmbed('grants', 700, '"><script>alert(1)</script>&').html
    expect(code).toContain('&quot;&gt;&lt;script&gt;')
    expect(code).not.toContain('<script>')
    expect(code).toContain('&amp;')
  })
  it('clamps invalid sizes and keeps a meaningful accessible title', () => {
    expect(buildEmbed('baseline', -1, '').height).toBe(400)
    expect(buildEmbed('baseline', 100000, '').height).toBe(1600)
    expect(buildEmbed('baseline', NaN, '  ').height).toBe(500)
    expect(buildEmbed('baseline', 700, '').title).toBe(EMBED_MAPS.baseline.title)
  })
  it('uses public chromeless pages and retains visible click-through attribution', () => {
    for (const key of Object.keys(EMBED_MAPS)) {
      const result = buildEmbed(embedMap(key), 740, '')
      expect(result.src).toBe(result.pageUrl + '?chromeless=true&embedHeader=true&embedFooter=true')
      expect(result.html).toContain('width="100%"')
      expect(result.html).toContain('loading="lazy"')
      expect(result.html).toContain(`<a href="${result.pageUrl}"`)
      const markup = document.createElement('div')
      markup.innerHTML = result.html
      expect(markup.querySelector('iframe')?.getAttribute('src')).toBe(result.src)
      expect(markup.querySelector(`a[href="${result.pageUrl}"]`)).not.toBeNull()
      expect(markup.textContent).not.toContain('Credit:')
    }
  })
  it.each([[true, true], [true, false], [false, true], [false, false]])('encodes header=%s and footer=%s consistently', (header, footer) => {
    const embed = buildEmbed('grants', 500, '', header, footer)
    const url = new URL(embed.src)
    expect(getEmbedLayout(url.search)).toEqual({ header, mapHeader: header, footer })
    expect(embed.previewSrc).toBe(url.pathname + url.search)
    expect(embed.html).not.toContain('Credit:')
  })
  it('preserves legacy chromeless and normal-page behavior', () => {
    expect(getEmbedLayout('?chromeless=true')).toEqual({ header: false, mapHeader: true, footer: true })
    expect(getEmbedLayout('')).toEqual({ header: true, mapHeader: true, footer: true })
    expect(getEmbedLayout('?embedHeader=false&embedFooter=false')).toEqual({ header: true, mapHeader: true, footer: true })
  })
})
