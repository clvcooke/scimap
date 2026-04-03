import legislatureData from '@/data/legislators.json'

interface Rep {
  name: string
  party: string
}

interface Senators {
  junior: { name: string; party: string }
  senior: { name: string; party: string }
}

const data = legislatureData as {
  reps: Record<string, Rep>
  sens: Record<string, Senators>
}

export function getHouseRep(district: string): Rep | null {
  return data.reps[district] ?? null
}

export function getSenatorsList(
  stateCode: string,
): { name: string; party: string }[] {
  const senators = data.sens[stateCode]
  if (!senators) return []
  return [senators.junior, senators.senior]
}

export function formatPoliticianName(name?: string, party?: string): string {
  if (!name?.trim()) return 'Vacant Seat'
  const suffix = party?.startsWith('Republican')
    ? '(R)'
    : party?.startsWith('Democrat')
      ? '(D)'
      : '(I)'
  return `${name.replace('""', '"').replace('""', '"')} ${suffix}`
}
