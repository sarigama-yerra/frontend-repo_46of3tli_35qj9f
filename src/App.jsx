import { useEffect, useState } from 'react'
import Header from './components/Header'
import SurahList from './components/SurahList'
import Reader from './components/Reader'

function App() {
  const [selected, setSelected] = useState(null)
  const [synced, setSynced] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const boot = async () => {
      try {
        // Check if surah list exists; if not, trigger sync
        const res = await fetch(`${baseUrl}/api/surah`)
        if (res.ok) {
          const json = await res.json()
          if (!json.data || json.data.length === 0) {
            await handleSync()
          } else {
            setSynced(true)
          }
        } else {
          await handleSync()
        }
      } catch (e) {
        console.error(e)
      }
    }
    boot()
  }, [])

  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch(`${baseUrl}/api/sync`, { method: 'POST' })
      if (res.ok) {
        setSynced(true)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50 via-teal-50 to-sky-50">
      <Header />
      <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {!synced ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-4 animate-pulse">📖</div>
            <h2 className="text-2xl font-semibold text-emerald-900">Preparing your Quran library</h2>
            <p className="text-gray-600 mt-2 max-w-md">We're fetching surah names, ayahs, and audio links. This only happens once and may take a minute.</p>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="mt-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-4 py-2 rounded-md"
            >
              {syncing ? 'Syncing…' : 'Start Sync'}
            </button>
          </div>
        ) : selected ? (
          <Reader surah={selected} onBack={() => setSelected(null)} />
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-emerald-900">Surahs</h2>
              <p className="text-gray-600">Browse, read, and listen to recitation.</p>
            </div>
            <SurahList onSelect={setSelected} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
