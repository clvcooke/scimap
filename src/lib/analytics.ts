import posthog from 'posthog-js'
import type { AnyRouter } from '@tanstack/react-router'
import { getHouseRep, getSenatorsList } from './legislature'
import { getCountyName, getLegislatorKeys, type LossGeoLevel, type TileProps } from './map-shared'

// ── Event catalog ──────────────────────────────────────────────────

export const Events = {
  PAGE_VIEWED: 'page_viewed',
  ZIP_SEARCHED: 'zip_searched',
  MAP_CARD_CLICKED: 'map_card_clicked',
  MAP_GEOGRAPHY_CLICKED: 'map_geography_clicked',
  MAP_GEO_LEVEL_CHANGED: 'map_geo_level_changed',
  MAP_AGENCY_FILTER_CHANGED: 'map_agency_filter_changed',
  MAP_ABOUT_OPENED: 'map_about_opened',
  BUDGET_DRAWER_OPENED: 'budget_drawer_opened',
  BUDGET_DRAWER_SCORECARD_CLICKED: 'budget_drawer_scorecard_clicked',
  SCORECARD_VIEWED: 'scorecard_viewed',
  SCORECARD_IMAGE_DOWNLOADED: 'scorecard_image_downloaded',
  SCORECARD_SHARE_CLICKED: 'scorecard_share_clicked',
  SHARE_CLICKED: 'share_clicked',
  TAKE_ACTION_FIND_REPS_CLICKED: 'take_action_find_reps_clicked',
  TAKE_ACTION_CONTACT_REPS_SEEN: 'take_action_contact_reps_seen',
  TAKE_ACTION_ORG_CLICKED: 'take_action_org_clicked',
  NAV_CLICKED: 'nav_clicked',
  EXTERNAL_LINK_CLICKED: 'external_link_clicked',
  INSIGHT_ARTICLE_OPENED: 'insight_article_opened',
  NEWS_ARTICLE_CLICKED: 'news_article_clicked',
} as const

export type EventName = (typeof Events)[keyof typeof Events]

export type MapType = 'baseline' | 'grants' | 'fy27' | 'fy26' | 'idc'
export type SharePlatform =
  | 'native'
  | 'copy'
  | 'x'
  | 'bluesky'
  | 'facebook'
  | 'linkedin'
  | 'email'

// ── State ──────────────────────────────────────────────────────────

let enabled = false
let prevPath: string | undefined

const isDev = import.meta.env.DEV

const GA_MEASUREMENT_ID = 'G-CCM3BQY1WQ'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

// ── Init ───────────────────────────────────────────────────────────

// PostHog project API keys (phc_*) are public-safe — they're designed to ship
// to the browser. Hardcoding here keeps config simple; env vars can override
// for local experimentation or a separate staging project.
const DEFAULT_POSTHOG_KEY = 'phc_7xCOByPPLiPt1qyRf23Ga7ra7qPrAv6NkIkCn4lkZUH'
const DEFAULT_POSTHOG_HOST = 'https://posthog.scienceimpacts.org'

export function initAnalytics(router: AnyRouter): void {
  const envKey = import.meta.env.VITE_POSTHOG_KEY as string | undefined
  const envHost = import.meta.env.VITE_POSTHOG_HOST as string | undefined
  const key = envKey && envKey.length > 0 ? envKey : DEFAULT_POSTHOG_KEY
  const host = envHost && envHost.length > 0 ? envHost : DEFAULT_POSTHOG_HOST

  if (!key) {
    if (isDev) console.debug('[analytics] disabled — no key')
  } else {
    posthog.init(key, {
      api_host: host,
      person_profiles: 'always',
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: false,
      respect_dnt: true,
      persistence: 'localStorage+cookie',
      session_recording: { maskAllInputs: true },
      loaded: (ph) => {
        if (
          new URLSearchParams(window.location.search).get('chromeless') === 'true'
        ) {
          ph.opt_out_capturing()
        }
      },
    })
    enabled = true
  }

  // Stamp first-visit / session properties once PostHog is ready.
  const now = new Date().toISOString()
  const landingPath = window.location.pathname
  const deviceType = window.innerWidth < 768 ? 'mobile' : 'desktop'
  setPersonProperties(
    { first_landing_path: landingPath, first_device_type: deviceType },
    true,
  )
  setPersonProperties({ last_visit_date: now, last_device_type: deviceType })

  // Drive pageviews from the router. onResolved fires once per successful nav.
  router.subscribe('onResolved', ({ toLocation }) => {
    const pathname = toLocation.pathname
    track(Events.PAGE_VIEWED, {
      pathname,
      search: window.location.search,
      page_title: document.title,
      referrer_path: prevPath,
    })
    setPersonProperties({ last_path: pathname })

    // GA4 SPA pageview. The gtag snippet in index.html fires the initial
    // page_view on load; this covers every subsequent client-side nav.
    if (prevPath !== undefined) {
      window.gtag?.('event', 'page_view', {
        page_path: pathname + window.location.search,
        page_location: window.location.href,
        page_title: document.title,
        send_to: GA_MEASUREMENT_ID,
      })
    }

    prevPath = pathname
  })
}

// ── Core helpers ───────────────────────────────────────────────────

export function track(event: EventName, props: Record<string, unknown> = {}): void {
  // Strip undefined so PostHog doesn't show empty fields.
  const clean: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(props)) {
    if (v !== undefined) clean[k] = v
  }
  if (enabled) {
    posthog.capture(event, clean)
  } else if (isDev) {
    console.debug('[analytics]', event, clean)
  }
}

export function setPersonProperties(
  props: Record<string, unknown>,
  once = false,
): void {
  if (!enabled) {
    if (isDev) console.debug('[analytics] set', once ? '(once)' : '', props)
    return
  }
  if (once) posthog.setPersonProperties(undefined, props)
  else posthog.setPersonProperties(props)
}

// ── Derivation helpers ─────────────────────────────────────────────

/** PII-safe: return only the first 3 digits of a US ZIP. Preserves region,
 *  strips household-level granularity. */
export function zipPrefix(zip: string): string {
  return zip.slice(0, 3)
}

/** Compress a pair of senator party codes into a two-letter tag like 'RR',
 *  'DD', 'RD', 'DR', 'I?'. Useful for cohort analysis. */
export function senatorPartyMix(stateCode: string | undefined): string | undefined {
  if (!stateCode) return undefined
  const sens = getSenatorsList(stateCode)
  if (sens.length === 0) return undefined
  const letter = (party: string | undefined) =>
    party?.startsWith('Republican')
      ? 'R'
      : party?.startsWith('Democrat')
        ? 'D'
        : 'I'
  return sens.map((s) => letter(s.party)).join('')
}

export function repParty(
  stateCode: string | undefined,
  cdFp: string | undefined,
): string | undefined {
  if (!stateCode || !cdFp) return undefined
  const rep = getHouseRep(`${stateCode}-${cdFp}`)
  if (!rep) return undefined
  return rep.party?.startsWith('Republican')
    ? 'R'
    : rep.party?.startsWith('Democrat')
      ? 'D'
      : 'I'
}

/** Derive analytics props from tile properties + geo level. Shared between
 *  the geography-click event and the budget-drawer-opened event so both carry
 *  identical context for funneling. */
export function buildGeographyEventProps(
  props: TileProps,
  geoLevel: LossGeoLevel,
  mapType: MapType | undefined,
): Record<string, unknown> {
  const { stateCode, cdFp } = getLegislatorKeys(props)
  return {
    map_type: mapType,
    geo_level: geoLevel,
    state_code: stateCode || undefined,
    state_name: props.state_name != null ? String(props.state_name) : undefined,
    county_name: geoLevel === 'counties' ? getCountyName(props) : undefined,
    district_id: geoLevel === 'districts' ? cdFp || undefined : undefined,
    geoid: props.GEOID != null ? String(props.GEOID) : undefined,
    population: props.pop_2024 != null ? Number(props.pop_2024) : undefined,
    loss_total: props.econ_budg_total_cuts != null ? Number(props.econ_budg_total_cuts) : undefined,
    loss_nih: props.econ_budg_NIH_cuts != null ? Number(props.econ_budg_NIH_cuts) : undefined,
    loss_nsf: props.econ_budg_NSF_cuts != null ? Number(props.econ_budg_NSF_cuts) : undefined,
    job_loss: props.jobs_budg_total_cuts != null ? Number(props.jobs_budg_total_cuts) : undefined,
    rep_party: geoLevel === 'districts' ? repParty(stateCode, cdFp) : undefined,
    senator_party_mix: senatorPartyMix(stateCode),
  }
}
