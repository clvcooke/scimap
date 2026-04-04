/**
 * Lightweight frontmatter parser and content loader for markdown files
 * managed by Decap CMS.
 */

import { parse as parseYaml } from 'yaml'

interface TeamMember {
  name: string
  role: string
  photo: string
  order: number
  bio: string
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Attrs = Record<string, any>

/** Parse YAML frontmatter from a markdown string. */
function parseFrontmatter(raw: string): { attrs: Attrs; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { attrs: {}, body: raw }
  return { attrs: parseYaml(match[1]) ?? {}, body: match[2].trim() }
}

/** Load a single page content file. */
const pageFiles = import.meta.glob<string>('/content/pages/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export interface PageContent {
  attrs: Attrs
  body: string
}

export function getPage(slug: string): PageContent {
  const key = `/content/pages/${slug}.md`
  const raw = pageFiles[key]
  if (!raw) return { attrs: {}, body: '' }
  return parseFrontmatter(raw)
}

/** Load all news items from content/news/*.md */
export interface NewsItem {
  title: string
  date: string
  description: string
  source: string
  url: string
  isOngoing: boolean
}

const newsFiles = import.meta.glob<string>('/content/news/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export function getNewsItems(): NewsItem[] {
  return Object.values(newsFiles)
    .map((raw) => {
      const { attrs } = parseFrontmatter(raw)
      return {
        title: attrs.title ?? '',
        date: attrs.date ?? '',
        description: attrs.description ?? '',
        source: attrs.source ?? '',
        url: attrs.url ?? '',
        isOngoing: attrs.is_ongoing === true || attrs.is_ongoing === 'true',
      }
    })
    .sort((a, b) => {
      if (a.isOngoing && !b.isOngoing) return -1
      if (!a.isOngoing && b.isOngoing) return 1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
}

/** Load all press releases from content/press-releases/*.md */
export interface PressRelease {
  title: string
  date: string
  summary: string
  url: string
}

const pressFiles = import.meta.glob<string>('/content/press-releases/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export function getPressReleases(): PressRelease[] {
  return Object.values(pressFiles)
    .map((raw) => {
      const { attrs } = parseFrontmatter(raw)
      return {
        title: attrs.title ?? '',
        date: attrs.date ?? '',
        summary: attrs.summary ?? '',
        url: attrs.url ?? '',
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/** Load all research articles from content/articles/*.md */
export interface Article {
  title: string
  url: string
  order: number
  blurb: string
}

const articleFiles = import.meta.glob<string>('/content/articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export function getArticles(): Article[] {
  return Object.values(articleFiles)
    .map((raw) => {
      const { attrs, body } = parseFrontmatter(raw)
      return {
        title: attrs.title ?? '',
        url: attrs.url ?? '#',
        order: Number(attrs.order) || 99,
        blurb: body,
      }
    })
    .sort((a, b) => a.order - b.order)
}

/** Load all team members from content/team/*.md (uses Vite's import.meta.glob). */
const teamFiles = import.meta.glob<string>('/content/team/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export function getTeamMembers(): TeamMember[] {
  return Object.values(teamFiles)
    .map((raw) => {
      const { attrs, body } = parseFrontmatter(raw)
      return {
        name: attrs.name ?? '',
        role: attrs.role ?? '',
        photo: attrs.photo ?? '',
        order: Number(attrs.order) || 99,
        bio: body,
      }
    })
    .sort((a, b) => a.order - b.order)
}
