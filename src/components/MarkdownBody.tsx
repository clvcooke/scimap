import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

/**
 * Renders a markdown document body (article/page content) with GitHub-Flavored
 * Markdown enabled, so pipe tables, strikethrough and autolinks work.
 *
 * Tables scroll horizontally on narrow screens rather than overflowing the page.
 */
export function MarkdownBody({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline',
        className,
      )}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children: c }) => (
            <div className="not-prose my-8 w-full overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-max border-collapse text-sm">
                {c}
              </table>
            </div>
          ),
          thead: ({ children: c }) => (
            <thead className="bg-neutral-50">{c}</thead>
          ),
          tbody: ({ children: c }) => (
            <tbody className="divide-y divide-gray-100">{c}</tbody>
          ),
          th: ({ children: c, style }) => (
            <th
              style={style}
              className="border-b border-gray-200 px-4 py-2.5 text-left font-semibold whitespace-nowrap text-gray-900"
            >
              {c}
            </th>
          ),
          td: ({ children: c, style }) => (
            <td
              style={style}
              className="px-4 py-2.5 whitespace-nowrap text-gray-700"
            >
              {c}
            </td>
          ),
        }}
      >
        {children}
      </Markdown>
    </div>
  )
}
