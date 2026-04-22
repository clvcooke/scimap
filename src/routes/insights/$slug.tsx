import { useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Download } from 'lucide-react'
import Markdown from 'react-markdown'
import { getBlogPost } from '@/lib/content'
import { Events, track } from '@/lib/analytics'

export const Route = createFileRoute('/insights/$slug')({
  component: BlogPostPage,
})

function BlogPostPage() {
  const { slug } = Route.useParams()
  const post = getBlogPost(slug)

  useEffect(() => {
    if (post) {
      track(Events.INSIGHT_ARTICLE_OPENED, { slug, title: post.title })
    }
  }, [slug, post])

  if (!post) {
    return (
      <div className="flex w-full flex-col items-center justify-center px-6 py-20">
        <h1 className="text-2xl font-bold text-gray-900">Post not found</h1>
        <p className="mt-2 text-gray-500">
          The article you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          to="/insights"
          search={{ tab: 'blog' }}
          className="mt-6 inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Insights
        </Link>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col bg-neutral-50">
      <div className="w-full bg-white px-6 pt-6 pb-8 md:pt-8 md:pb-10">
        <article className="mx-auto max-w-3xl">
          <Link
            to="/insights"
          search={{ tab: 'blog' }}
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-brand-blue"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Insights
          </Link>

          <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {post.author && (
              <>
                <span className="text-gray-300">|</span>
                <span>{post.author}</span>
              </>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-brand-blue/10 px-3 py-0.5 text-xs font-medium text-brand-blue"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.downloadable && (
            <a
              href={post.downloadable}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-light"
            >
              <Download className="h-4 w-4" />
              {post.downloadable_title ?? 'Download'}
            </a>
          )}

          {post.image && (
            <img
              src={post.image}
              alt=""
              className="mt-8 w-full rounded-lg object-cover"
            />
          )}

          <div className="prose prose-gray mt-8 max-w-none prose-headings:text-gray-900 prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline">
            <Markdown>{post.body}</Markdown>
          </div>
        </article>
      </div>
    </div>
  )
}
