import { useEffect, useState, useMemo } from 'react'
import { ArrowLeft, Volume2, Search } from 'lucide-react'

export default function Reader({ surah, onBack }) {
  const [ayahs, setAyahs] = useState([])
  const [q, setQ] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    if (!surah) return
    const fetchAyahs = async () => {
      const url = new URL(`${baseUrl}/api/surah/${surah.number}/ayahs`)
      if (q) url.searchParams.set('q', q)
      const res = await fetch(url)
      const json = await res.json()
      setAyahs(json.data || [])
    }
    fetchAyahs()
  }, [surah, q])

  const playAudio = (url) => {
    if (!url) return
    const audio = new Audio(url)
    audio.play()
  }

  const filtered = useMemo(() => ayahs, [ayahs])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-md bg-white border hover:bg-gray-50">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-emerald-800">{surah.englishName} <span className="text-gray-500">• {surah.name}</span></h2>
          <p className="text-xs text-gray-500">{surah.revelationType} • {surah.numberOfAyahs} Ayahs</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search within this Surah..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="bg-white/70 backdrop-blur rounded-lg border border-gray-100 divide-y divide-gray-100 overflow-hidden">
        {filtered.map((a) => (
          <div key={a.ayah_number} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Ayah {a.ayah_number}</p>
                <p className="text-2xl leading-relaxed font-arabic text-emerald-900">{a.text_ar}</p>
                {a.text_en && (
                  <p className="text-sm mt-2 text-gray-700">{a.text_en}</p>
                )}
              </div>
              {a.audio_url && (
                <button
                  onClick={() => playAudio(a.audio_url)}
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
