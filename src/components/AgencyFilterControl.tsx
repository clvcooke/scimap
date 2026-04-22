import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { AgencyFilter } from '@/lib/map-shared'

export default function AgencyFilterControl({
  value,
  onValueChange,
}: {
  value: AgencyFilter
  onValueChange: (v: AgencyFilter) => void
}) {
  return (
    <Tabs value={value} onValueChange={(v: string) => onValueChange(v as AgencyFilter)}>
      <TabsList className="shadow md:shadow-none">
        <TabsTrigger value="nih" className="text-xs md:text-sm">NIH</TabsTrigger>
        <TabsTrigger value="nsf" className="text-xs md:text-sm">NSF</TabsTrigger>
        <TabsTrigger value="both" className="text-xs md:text-sm">Combined</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
