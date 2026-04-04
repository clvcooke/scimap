import { useMemo } from 'react'
import { X } from 'lucide-react'
import type { GrantTermination } from '@/data/grant-losses'

const currencyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

interface GrantsOverlayProps {
  grants: GrantTermination[]
  open: boolean
  onClose: () => void
}

export default function GrantsOverlay({ grants, open, onClose }: GrantsOverlayProps) {
  const grouped = useMemo(() => {
    const map: Record<string, GrantTermination[]> = {}
    grants?.forEach((g) => {
      ;(map[g.org_name] ??= []).push(g)
    })
    return Object.entries(map)
      .map(([orgName, list]) => ({
        orgName,
        grants: list,
        total: list.reduce((s, g) => s + (g.terminated_loss ?? 0), 0),
      }))
      .sort((a, b) => b.total - a.total)
  }, [grants])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="relative mx-4 flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Cancelled &amp; Frozen NIH Grants
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <p className="px-5 pt-3 text-sm italic text-gray-500">
          Note: This does not include canceled and frozen grants from other federal agencies
        </p>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          <div className="space-y-2">
            {grouped.map(({ orgName, grants: g, total }) => (
              <div
                key={orgName}
                className="rounded-lg border border-gray-200 px-4 py-3"
              >
                <div className="font-semibold text-gray-900">{orgName}</div>
                <div className="mt-1 text-sm text-gray-600">
                  Grants Cancelled/Frozen: {g.length}
                </div>
                <div className="text-sm text-gray-600">
                  Funding Lost: {currencyFmt.format(total)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
