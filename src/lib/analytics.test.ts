import { describe, it, expect, vi, beforeEach } from 'vitest'
import posthog from 'posthog-js'
import { TRACKED_URL_PARAMS, initAnalytics } from './analytics'

vi.mock('posthog-js', () => ({
  default: {
    init: vi.fn(),
    capture: vi.fn(),
    setPersonProperties: vi.fn(),
    opt_out_capturing: vi.fn(),
  },
}))

describe('TRACKED_URL_PARAMS', () => {
  it('is a non-empty list of param names', () => {
    expect(TRACKED_URL_PARAMS.length).toBeGreaterThan(0)
    for (const name of TRACKED_URL_PARAMS) {
      expect(typeof name).toBe('string')
      expect(name.length).toBeGreaterThan(0)
    }
  })

  it('has no duplicate param names', () => {
    expect(new Set(TRACKED_URL_PARAMS).size).toBe(TRACKED_URL_PARAMS.length)
  })

  it('tracks prolific_PID and condition', () => {
    expect(TRACKED_URL_PARAMS).toContain('prolific_PID')
    expect(TRACKED_URL_PARAMS).toContain('condition')
  })
})

describe('initAnalytics — PostHog config', () => {
  /** Minimal fake router; we only assert on the posthog.init config here. */
  const fakeRouter = { subscribe: () => () => undefined }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('registers TRACKED_URL_PARAMS as custom_campaign_params so PostHog persists them as person properties', () => {
    initAnalytics(fakeRouter as never)

    const initCall = vi.mocked(posthog.init).mock.calls[0]
    expect(initCall).toBeDefined()
    const config = initCall![1] as { custom_campaign_params?: string[] }

    // Every tracked param must be handed to PostHog's campaign-param capture,
    // which is what writes them to the person profile ($set + $initial_/$set_once).
    for (const name of TRACKED_URL_PARAMS) {
      expect(config.custom_campaign_params).toContain(name)
    }
  })
})
