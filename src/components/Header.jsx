import { Moon, BookOpen } from 'lucide-react'

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-30 bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/20">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Al-Qur'an</h1>
            <p className="text-xs text-white/80">Read • Listen • Reflect</p>
          </div>
        </div>
        <Moon className="h-5 w-5 text-white/80" />
      </div>
    </header>
  )
}
