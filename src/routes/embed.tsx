import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { buildEmbed, embedMap, EMBED_MAPS } from '@/lib/embed'

export const Route = createFileRoute('/embed')({
  component: EmbedTutorial,
  validateSearch: (search: Record<string, unknown>) => ({ map: embedMap(search.map) }),
})

function EmbedTutorial() {
  const search = Route.useSearch()
  const [map, setMap] = useState(search.map)
  const [height, setHeight] = useState(500)
  const [title, setTitle] = useState('')
  const [preview, setPreview] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  const embed = buildEmbed(map, height, title)
  async function copy() {
    try {
      await navigator.clipboard.writeText(embed.html)
      setCopyStatus('Embed code copied.')
    } catch {
      setCopyStatus('Select the code below and copy it manually.')
    }
  }
  return <article className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6">
    <h1 className="text-3xl font-bold text-brand-blue">Embed a SCIMaP map</h1>
    <p className="mt-3 text-gray-700">Add an interactive map to your website with a responsive iframe. The map loads directly from SCIMaP and follows updates to the source page.</p>
    <section className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5" aria-labelledby="configure-embed">
      <h2 id="configure-embed" className="text-xl font-bold">1. Choose your map</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="flex min-w-0 flex-col gap-1 font-medium">Map
          <select className="min-w-0 w-full rounded border bg-white p-2" value={map} onChange={(event) => { setMap(embedMap(event.target.value)); setCopyStatus(''); setPreview(false) }}>
            {Object.entries(EMBED_MAPS).map(([key, option]) => <option key={key} value={key}>{option.title}</option>)}
          </select>
        </label>
        <label className="flex min-w-0 flex-col gap-1 font-medium">Height in pixels
          <input className="min-w-0 w-full rounded border bg-white p-2" type="number" min={400} max={1600} value={height} onChange={(event) => { setHeight(Number(event.target.value)); setCopyStatus('') }} />
        </label>
        <label className="flex min-w-0 flex-col gap-1 font-medium md:col-span-2">Accessible iframe title
          <input className="min-w-0 w-full rounded border bg-white p-2" maxLength={160} placeholder={EMBED_MAPS[map].title} value={title} onChange={(event) => { setTitle(event.target.value); setCopyStatus('') }} />
        </label>
      </div>
      <p className="mt-3 text-sm text-gray-600">Width adapts to your page. We recommend 500 pixels for phones so readers have room to scroll past the map. Height is limited to 400–1600 pixels. Where the selected page includes a table, readers can scroll below the map to reach it. This version embeds the page rather than a separate table-only view.</p>
    </section>
    <section className="mt-8" aria-labelledby="copy-embed">
      <h2 id="copy-embed" className="text-xl font-bold">2. Copy the HTML into your website</h2>
      <p className="mt-2 text-gray-700">Use your site editor’s custom HTML or embed block. Keep the source link below the map so readers can open the full SCIMaP page.</p>
      <textarea className="mt-4 h-72 w-full rounded-lg border bg-gray-50 p-3 font-mono text-sm" aria-label="Embed HTML" readOnly value={embed.html} onFocus={(event) => event.target.select()} />
      <button className="mt-3 rounded-lg bg-brand-blue px-4 py-2 font-semibold text-white" onClick={() => void copy()}>Copy embed code</button>
      <p role="status" className="mt-2 text-sm">{copyStatus}</p>
    </section>
    <section className="mt-8" aria-labelledby="preview-embed">
      <h2 id="preview-embed" className="text-xl font-bold">3. Preview and check your page</h2>
      <p className="mt-2 text-gray-700">Check your published page on desktop and a real iPhone or Android phone. Check that you can scroll past the map as well as interact with it. Confirm the map, geography controls, available tables and source link work. Your site may need to allow frames from scienceimpacts.org in its content security policy.</p>
      <button className="my-4 rounded-lg border border-brand-blue px-4 py-2 font-semibold text-brand-blue" onClick={() => setPreview(!preview)}>{preview ? 'Hide preview' : 'Load live preview'}</button>
      {preview && <div className="overflow-hidden rounded-xl border"><iframe src={embed.src} title={embed.title} height={embed.height} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" className="block w-full border-0" /></div>}
      <p className="mt-3 text-sm"><a className="underline text-brand-blue" href={embed.pageUrl} target="_blank" rel="noopener noreferrer">Open the full map on SCIMaP</a></p>
    </section>
  </article>
}
