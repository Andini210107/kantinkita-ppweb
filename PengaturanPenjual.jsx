import { useEffect, useState } from 'react'
import { Bell, ShieldCheck, Save } from 'lucide-react'

export default function PengaturanPenjual() {
  const [settings, setSettings] = useState({
    orderNotification: true,
    reviewNotification: true,
    showCanteen: true,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('kantinkita_seller_settings') || 'null')
      if (data) setSettings((old) => ({ ...old, ...data }))
    } catch {
      // Gunakan pengaturan awal.
    }
  }, [])

  const toggle = (key) => {
    setSettings((old) => ({ ...old, [key]: !old[key] }))
    setSaved(false)
  }

  const save = () => {
    localStorage.setItem('kantinkita_seller_settings', JSON.stringify(settings))
    setSaved(true)
  }

  const options = [
    { key: 'orderNotification', title: 'Notifikasi Pesanan', description: 'Terima pemberitahuan saat ada pesanan baru.', icon: Bell },
    { key: 'reviewNotification', title: 'Notifikasi Ulasan', description: 'Terima pemberitahuan saat pembeli memberikan ulasan.', icon: Bell },
    { key: 'showCanteen', title: 'Tampilkan Kantin', description: 'Atur apakah kantin ditampilkan dalam daftar kantin mahasiswa.', icon: ShieldCheck },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#CC0000]">Preferensi Akun</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Pengaturan</h1>
        <p className="mt-1 text-sm text-gray-500">Atur preferensi penggunaan dashboard penjual.</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-semibold text-gray-900">Preferensi</h2>
        <div className="mt-4 divide-y divide-gray-100">
          {options.map(({ key, title, description, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between gap-4 py-5">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-red-50 p-3"><Icon className="h-5 w-5 text-[#CC0000]" /></div>
                <div><p className="font-medium text-gray-900">{title}</p><p className="mt-1 text-sm text-gray-500">{description}</p></div>
              </div>
              <button type="button" onClick={() => toggle(key)} aria-label={`Ubah ${title}`} className={`relative h-6 w-11 shrink-0 rounded-full transition ${settings[key] ? 'bg-[#CC0000]' : 'bg-gray-300'}`}>
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${settings[key] ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          {saved && <p className="text-sm font-medium text-green-600">Pengaturan berhasil disimpan.</p>}
          <button onClick={save} className="ml-auto flex items-center gap-2 rounded-xl bg-[#CC0000] px-5 py-3 text-sm font-semibold text-white hover:bg-red-800"><Save className="h-4 w-4" /> Simpan Pengaturan</button>
        </div>
      </div>
    </div>
  )
}