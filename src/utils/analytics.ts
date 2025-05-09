import ReactGA from 'react-ga4';
import posthog from 'posthog-js';
import { REACT_APP_PUBLIC_POSTHOG_KEY, REACT_APP_PUBLIC_POSTHOG_HOST } from '../constants';

// Initialize PostHog
export const initializePostHog = () => {
  posthog.init(REACT_APP_PUBLIC_POSTHOG_KEY, {
    api_host: REACT_APP_PUBLIC_POSTHOG_HOST,
    capture_pageview: false, // We'll handle pageviews manually to match GA
  });
};

// Initialize Google Analytics
export const initializeGA = (trackingId: string) => {
  ReactGA.initialize(trackingId);
};

// Track event in both GA and PostHog
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number,
  nonInteraction?: boolean,
  transport?: 'beacon' | 'xhr' | 'image'
) => {
  // Track in Google Analytics
  ReactGA.event({
    category,
    action,
    label,
    value,
    nonInteraction,
    transport,
  });

  // Track in PostHog
  posthog.capture(action, {
    category,
    label,
    value,
    nonInteraction,
    transport,
  });
};

// Track pageview in both GA and PostHog
export const trackPageView = (page: string | null, title?: string | null) => {
  // Track in Google Analytics
  ReactGA.send({
    hitType: "pageview",
    page,
    title,
  });

  // Track in PostHog
  posthog.capture("$pageview", {
    page,
    title,
  });
};