import { useEffect, useState } from 'react'
import { Search, Play } from 'lucide-react'

export default function SurahList({ onSelect }) {
  const [surahs, setSurahs] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/surah`)
        const json = await res.json()
        setSurahs(json.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchSurahs()
  }, [])

  const filtered = surahs.filter((s) => {
    const q = query.toLowerCase()
    return (
      s.englishName?.toLowerCase().includes(q) ||
      s.name?.toLowerCase().includes(q) ||
      String(s.number).includes(q)
    )
  })

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Surah..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading surahs...</div>
      ) : (
        <ul className="divide-y divide-gray-100 bg-white/70 backdrop-blur rounded-lg border border-gray-100 overflow-hidden">
          {filtered.map((s) => (
            <li
              key={s.number}
              className="flex items-center justify-between p-4 hover:bg-emerald-50/60 cursor-pointer"
              onClick={() => onSelect?.(s)}
            >
              <div>
                <p className="text-sm text-gray-500">Surah {s.number} • {s.revelationType}</p>
                <p className="text-lg font-semibold text-emerald-800">{s.englishName} <span className="text-gray-500">• {s.name}</span></p>
                <p className="text-xs text-gray-500">Ayahs: {s.numberOfAyahs}</p>
              </div>
              <button className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md">
                <Play className="h-4 w-4" /> Listen
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
