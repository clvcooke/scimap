import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MarkdownBody } from './MarkdownBody'

describe('MarkdownBody', () => {
  it('renders GFM pipe tables', () => {
    render(
      <MarkdownBody>
        {[
          '| District | Economic Loss |',
          '| -------- | ------------: |',
          '| MI-06    |   $33,813,155 |',
        ].join('\n')}
      </MarkdownBody>,
    )

    expect(
      screen.getByRole('columnheader', { name: 'Economic Loss' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '$33,813,155' })).toHaveStyle({
      textAlign: 'right',
    })
  })
})
