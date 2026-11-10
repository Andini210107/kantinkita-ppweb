import { useEffect, useState } from 'react'
import { Clock, Save } from 'lucide-react'

const days = [
  'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu',
]

const defaultHours = days.map((day) => ({
  day,
  active: day !== 'Minggu',
  open: '08:00',
  close: '16:00',
}))

export default function JamOperasional() {
  const [hours, setHours] = useState(defaultHours)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('kantinkita_operational') || 'null')
      if (Array.isArray(data)) setHours(data)
    } catch {
      // Gunakan jadwal default jika data belum tersedia.
    }
  }, [])

  const updateDay = (index, field, value) => {
    setHours((old) => old.map((item, i) => i === index ? { ...item, [field]: value } : item))
    setSaved(false)
  }

  const save = (event) => {
    event.preventDefault()
    localStorage.setItem('kantinkita_operational', JSON.stringify(hours))
    setSaved(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#CC0000]">Pengelolaan Kantin</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Jam Operasional</h1>
        <p className="mt-1 text-sm text-gray-500">Atur hari dan jam layanan kantin kamu.</p>
      </div>

      <form onSubmit={save} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-5">
          <div className="rounded-xl bg-red-50 p-3"><Clock className="h-6 w-6 text-[#CC0000]" /></div>
          <div>
            <h2 className="font-semibold text-gray-900">Jadwal Mingguan</h2>
            <p className="text-sm text-gray-500">Aktifkan hari ketika kantin menerima pesanan.</p>
          </div>
        </div>

        <div className="space-y-4">
          {hours.map((item, index) => (
            <div key={item.day} className="grid gap-3 rounded-xl border border-gray-100 p-4 sm:grid-cols-[1fr_110px_1fr_1fr] sm:items-center">
              <p className="font-medium text-gray-800">{item.day}</p>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={item.active} onChange={(e) => updateDay(index, 'active', e.target.checked)} className="h-4 w-4 accent-[#CC0000]" />
                Buka
              </label>
              <label className="text-xs text-gray-500">
                Jam Buka
                <input type="time" disabled={!item.active} value={item.open} onChange={(e) => updateDay(index, 'open', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 disabled:bg-gray-100" />
              </label>
              <label className="text-xs text-gray-500">
                Jam Tutup
                <input type="time" disabled={!item.active} value={item.close} onChange={(e) => updateDay(index, 'close', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 disabled:bg-gray-100" />
              </label>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {saved && <p className="text-sm font-medium text-green-600">Jadwal berhasil disimpan.</p>}
          <button className="ml-auto flex items-center gap-2 rounded-xl bg-[#CC0000] px-5 py-3 text-sm font-semibold text-white hover:bg-red-800">
            <Save className="h-4 w-4" /> Simpan Jadwal
          </button>
        </div>
      </form>
    </div>
  )
}