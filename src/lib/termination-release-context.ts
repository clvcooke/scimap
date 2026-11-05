import { createContext, useContext } from 'react'
import type { TerminationRelease } from './termination-release'

export const ReleaseContext = createContext<TerminationRelease | null>(null)
export function useTerminationRelease() {
  const release = useContext(ReleaseContext)
  if (!release) throw new Error('Termination release provider required')
  return release
}
