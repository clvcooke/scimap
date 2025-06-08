import TILE_VERSION from './tile_version.json';

// Of form: YYYY-MM-DD
export const TILE_VERSION_NUMBER: string = TILE_VERSION["TILE_VERSION"];

export const FORMATTED_TILE_VERSION: string = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC' // This ensures we stay in UTC
}).format(new Date(TILE_VERSION_NUMBER + 'T00:00:00Z'));


