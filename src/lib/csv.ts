import Papa from 'papaparse'

type Cell = string | number

export function toCsv(rows: Cell[][]): string {
  return Papa.unparse(rows, { newline: '\r\n' })
}

export function downloadCsv(csv: string, filename: string) {
  // Prepend UTF-8 BOM so Excel opens non-ASCII names correctly.
  const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
