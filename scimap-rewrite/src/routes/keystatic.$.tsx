import { createFileRoute } from '@tanstack/react-router'
import { Keystatic } from '@keystatic/core/ui'
import keystaticConfig from '../../keystatic.config'

export const Route = createFileRoute('/keystatic/$' as any)({
  component: () => <Keystatic config={keystaticConfig as any} />,
})
