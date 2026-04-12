import Markdown from 'react-markdown'

/**
 * Renders a string containing inline markdown (**bold**, *italic*, [links](url), etc.)
 * as inline React elements, without wrapping in a block-level <p>.
 */
export function InlineMarkdown({ children }: { children: string }) {
  return (
    <Markdown
      components={{
        p: ({ children: c }) => <>{c}</>,
        a: ({ href, children: c }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-blue underline underline-offset-2 hover:text-brand-blue-light"
          >
            {c}
          </a>
        ),
      }}
    >
      {children}
    </Markdown>
  )
}
