export default function MapAttribution() {
  return (
    <p className="px-4 py-1 text-right text-xs text-gray-400 md:px-6">
      &copy;{' '}
      <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 underline">
        OpenStreetMap
      </a>{' '}
      contributors &copy;{' '}
      <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 underline">
        CARTO
      </a>
    </p>
  )
}
