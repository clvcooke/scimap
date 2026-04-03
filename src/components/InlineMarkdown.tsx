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
      }}
    >
      {children}
    </Markdown>
  )
}
