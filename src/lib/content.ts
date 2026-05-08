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
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw)
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
  image?: string
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
        image: attrs.image ?? undefined,
        isOngoing: attrs.is_ongoing === true || attrs.is_ongoing === 'true',
      }
    })
    .sort((a, b) => {
      if (a.isOngoing && !b.isOngoing) return -1
      if (!a.isOngoing && b.isOngoing) return 1
      return new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime()
    })
}

/** Load all press releases from content/press-releases/*.md */
export interface PressRelease {
  title: string
  date: string
  summary: string
  image?: string
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
        image: attrs.image ?? undefined,
        url: attrs.url ?? '',
      }
    })
    .sort((a, b) => new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime())
}

/** Load all research articles from content/articles/*.md */
export interface Article {
  title: string
  url?: string
  order: number
  blurb: string
  date?: string
  image?: string
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
        url: attrs.url ?? undefined,
        order: Number(attrs.order) || 99,
        blurb: body,
        date: attrs.date ?? undefined,
        image: attrs.image ?? undefined,
      }
    })
    .sort((a, b) => a.order - b.order)
}

/** Load all blog posts from content/insights/*.md */
export interface BlogFigure {
  image: string
  caption: string
}

export interface BlogPost {
  title: string
  slug: string
  date: string
  author: string
  summary: string
  image?: string
  tags: string[]
  downloadable?: string
  downloadable_title?: string
  video?: string
  figures?: BlogFigure[]
  body: string
}

const insightFiles = import.meta.glob<string>('/content/insights/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export function getBlogPosts(): BlogPost[] {
  return Object.values(insightFiles)
    .map((raw) => {
      const { attrs, body } = parseFrontmatter(raw)
      return {
        title: attrs.title ?? '',
        slug: attrs.slug ?? '',
        date: attrs.date ?? '',
        author: attrs.author ?? '',
        summary: attrs.summary ?? '',
        image: attrs.image ?? undefined,
        tags: Array.isArray(attrs.tags) ? attrs.tags : [],
        downloadable: attrs.downloadable ?? undefined,
        downloadable_title: attrs.downloadable_title ?? undefined,
        video: attrs.video ?? undefined,
        ...(Array.isArray(attrs.figures) && { figures: attrs.figures as BlogFigure[] }),
        body,
      }
    })
    .sort(
      (a, b) =>
        new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime(),
    )
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((p) => p.slug === slug)
}

/** Load all methodology updates from content/updates/*.md */
export interface Update {
  date: string
  title?: string
  body: string
}

const updateFiles = import.meta.glob<string>('/content/updates/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export function getUpdates(): Update[] {
  return Object.values(updateFiles)
    .map((raw) => {
      const { attrs, body } = parseFrontmatter(raw)
      return {
        date: attrs.date ?? '',
        title: attrs.title ?? undefined,
        body,
      }
    })
    .sort(
      (a, b) =>
        new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime(),
    )
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
