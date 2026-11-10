import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  UserRound,
  Mail,
  Phone,
  ArrowLeft,
  Save,
  CheckCircle2,
} from 'lucide-react'

export default function ProfilPengguna() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    try {
      const savedUser = JSON.parse(
        localStorage.getItem('kantinkita_user') || '{}'
      )

      setForm({
        name: savedUser.name || savedUser.fullName || savedUser.nama || '',
        email: savedUser.email || '',
        phone: savedUser.phone || savedUser.telepon || '',
      })
    } catch {
      setForm({ name: '', email: '', phone: '' })
    }
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setMessage('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setMessage('Nama lengkap tidak boleh kosong.')
      return
    }

    try {
      const savedUser = JSON.parse(
        localStorage.getItem('kantinkita_user') || '{}'
      )

      const updatedUser = {
        ...savedUser,
        name: form.name.trim(),
        email: form.email,
        phone: form.phone.trim(),
      }

      localStorage.setItem(
        'kantinkita_user',
        JSON.stringify(updatedUser)
      )

      setMessage('Profil berhasil diperbarui.')
    } catch {
      setMessage('Profil gagal disimpan. Silakan coba lagi.')
    }
  }

  const initials = form.name
    ? form.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <section className="min-h-[75vh] bg-[#FAFAFA] px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#CC0000]"
        >
          <ArrowLeft size={17} />
          Kembali ke Beranda
        </Link>

        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wider text-[#CC0000]">
            Pengaturan Akun
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
            Edit Profil
          </h1>
          <p className="mt-2 text-gray-500">
            Kelola informasi pribadi akun KantinKita kamu.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-3xl font-extrabold text-[#CC0000]">
                {initials}
              </div>

              <h2 className="mt-4 break-words font-bold text-gray-900">
                {form.name || 'Pengguna KantinKita'}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-500">
                {form.email || 'Email belum tersedia'}
              </p>

              <div className="mt-5 w-full border-t border-gray-100 pt-5 text-left">
                <div className="flex items-center gap-3 rounded-xl bg-red-50 p-3">
                  <UserRound size={19} className="text-[#CC0000]" />
                  <div>
                    <p className="text-xs text-gray-500">Jenis Akun</p>
                    <p className="text-sm font-semibold text-gray-800">
                      Mahasiswa
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7">
              <h2 className="text-lg font-bold text-gray-900">
                Informasi Pribadi
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Pastikan informasi akun kamu sudah benar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Nama Lengkap
                </label>
                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap"
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-red-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    readOnly
                    placeholder="Email akun"
                    className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-500 outline-none"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Email akun tidak dapat diubah melalui halaman ini.
                </p>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Nomor HP
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Contoh: 081234567890"
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              {message && (
                <div
                  className={`flex items-center gap-2 rounded-xl p-3 text-sm ${
                    message.includes('berhasil')
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {message.includes('berhasil') && (
                    <CheckCircle2 size={18} />
                  )}
                  {message}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                <Link
                  to="/"
                  className="rounded-xl border border-gray-200 px-5 py-3 text-center text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Batal
                </Link>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#CC0000] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#A80000]"
                >
                  <Save size={17} />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}