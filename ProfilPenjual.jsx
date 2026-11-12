import { useEffect, useState } from 'react'
import { Store, Save, UserRound, Mail, Phone } from 'lucide-react'

const readStorage = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

export default function ProfilPenjual() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', canteenName: '', description: '',
  })
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const account = readStorage('kantinkita_user', {})
    const seller = readStorage('kantinkita_seller_canteen', {})
    setForm({
      name: account.name || '',
      email: account.email || '',
      phone: account.phone || '',
      canteenName: seller.canteenName || account.canteenName || account.businessName || '',
      description: seller.description || '',
    })
  }, [])

  const change = (event) => {
    setForm((old) => ({ ...old, [event.target.name]: event.target.value }))
    setNotice('')
  }

  const save = (event) => {
    event.preventDefault()

    const account = readStorage('kantinkita_user', {})
    const users = readStorage('kantinkita_users', [])
    const updatedAccount = {
      ...account,
      name: form.name,
      email: form.email,
      phone: form.phone,
      canteenName: form.canteenName,
      businessName: form.canteenName,
    }

    localStorage.setItem('kantinkita_user', JSON.stringify(updatedAccount))

    if (Array.isArray(users)) {
      const updatedUsers = users.map((user) =>
        user.id === account.id ? { ...user, ...updatedAccount } : user
      )
      localStorage.setItem('kantinkita_users', JSON.stringify(updatedUsers))
    }

    const oldSeller = readStorage('kantinkita_seller_canteen', {})
    localStorage.setItem('kantinkita_seller_canteen', JSON.stringify({
      ...oldSeller,
      canteenId: oldSeller.canteenId || account.canteenId || account.id,
      canteenName: form.canteenName,
      description: form.description,
    }))

    window.dispatchEvent(new Event('kantinkita-canteen-changed'))
    setNotice('Profil penjual berhasil disimpan.')
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#CC0000]">Akun Bisnis</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Profil Penjual</h1>
        <p className="mt-1 text-sm text-gray-500">Kelola informasi akun dan identitas kantin.</p>
      </div>

      <form onSubmit={save} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
          <div className="rounded-full bg-red-50 p-4"><Store className="h-7 w-7 text-[#CC0000]" /></div>
          <div><h2 className="font-semibold text-gray-900">{form.canteenName || 'Kantin Saya'}</h2><p className="text-sm text-gray-500">Informasi profil kantin</p></div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">
            Nama Penjual
            <span className="relative mt-2 block"><UserRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><input name="name" value={form.name} onChange={change} required className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 outline-none focus:border-[#CC0000]" /></span>
          </label>
          <label className="text-sm font-medium text-gray-700">
            Email
            <span className="relative mt-2 block"><Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><input type="email" name="email" value={form.email} onChange={change} required className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 outline-none focus:border-[#CC0000]" /></span>
          </label>
          <label className="text-sm font-medium text-gray-700">
            Nomor Telepon
            <span className="relative mt-2 block"><Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><input name="phone" value={form.phone} onChange={change} className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 outline-none focus:border-[#CC0000]" /></span>
          </label>
          <label className="text-sm font-medium text-gray-700">
            Nama Kantin
            <span className="relative mt-2 block"><Store className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><input name="canteenName" value={form.canteenName} onChange={change} required className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 outline-none focus:border-[#CC0000]" /></span>
          </label>
        </div>

        <label className="mt-5 block text-sm font-medium text-gray-700">
          Deskripsi Kantin
          <textarea name="description" value={form.description} onChange={change} rows={4} placeholder="Ceritakan singkat tentang kantin kamu..." className="mt-2 w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#CC0000]" />
        </label>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {notice && <p className="text-sm font-medium text-green-600">{notice}</p>}
          <button className="ml-auto flex items-center gap-2 rounded-xl bg-[#CC0000] px-5 py-3 text-sm font-semibold text-white hover:bg-red-800"><Save className="h-4 w-4" /> Simpan Profil</button>
        </div>
      </form>
    </div>
  )
}