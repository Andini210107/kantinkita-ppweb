import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  UserRound,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Store,
  GraduationCap,
  Utensils,
} from 'lucide-react'
import Logo from '../components/Logo'

export default function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const role = searchParams.get('role')
  const isSeller = role === 'penjual'
  const roleName = isSeller ? 'Penjual' : 'Mahasiswa'

  const [form, setForm] = useState({
    name: '',
    canteenName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!role || !['mahasiswa', 'penjual'].includes(role)) {
      navigate('/pilih-peran')
      return
    }

    const name = form.name.trim()
    const canteenName = form.canteenName.trim()
    const email = form.email.trim().toLowerCase()
    const phone = form.phone.trim()

    if (
      !name ||
      !email ||
      !phone ||
      !form.password ||
      !form.confirmPassword ||
      (isSeller && !canteenName)
    ) {
      setError('Semua kolom wajib diisi.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Masukkan alamat email yang valid.')
      return
    }

    if (!/^[0-9+\-\s]{10,15}$/.test(phone)) {
      setError('Masukkan nomor HP yang valid (10–15 karakter).')
      return
    }

    if (form.password.length < 6) {
      setError('Kata sandi minimal terdiri dari 6 karakter.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.')
      return
    }

    try {
      const savedUsers = JSON.parse(
        localStorage.getItem('kantinkita_users') || '[]'
      )

      const users = Array.isArray(savedUsers)
        ? savedUsers
        : savedUsers
          ? [savedUsers]
          : []

      const emailExists = users.some(
        (user) => user.email?.toLowerCase() === email
      )

      if (emailExists) {
        setError('Email sudah terdaftar. Silakan gunakan email lain.')
        return
      }

      const newUser = {
        id: `USER-${Date.now()}`,
        name,
        email,
        phone,
        password: form.password,
        role,
        createdAt: new Date().toISOString(),

        ...(isSeller && {
          canteenName,
          canteenId: `CANTEEN-${Date.now()}`,
          businessName: canteenName,
        }),
      }

      users.push(newUser)

      localStorage.setItem(
        'kantinkita_users',
        JSON.stringify(users)
      )

      navigate(`/login?role=${role}`, {
        state: { registered: true },
      })
    } catch {
      setError('Pendaftaran gagal. Silakan coba lagi.')
    }
  }

  if (!role || !['mahasiswa', 'penjual'].includes(role)) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-gray-900">
            Pilih Jenis Akun
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Pilih jenis akun sebelum melakukan pendaftaran.
          </p>
          <Link
            to="/pilih-peran"
            className="mt-6 inline-flex rounded-xl bg-[#CC0000] px-6 py-3 font-semibold text-white"
          >
            Pilih Peran
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">

        {/* BAGIAN ILUSTRASI */}
        <div className="hidden md:flex flex-col justify-between bg-[#CC0000] text-white p-12">
          <Logo light />

          <div>
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
              {isSeller
                ? <Store size={34} />
                : <GraduationCap size={34} />}
            </div>

            <h1 className="text-4xl font-bold leading-tight mb-5">
              {isSeller
                ? 'Kembangkan Usaha Kantinmu!'
                : 'Mulai Perjalanan Kuliner Kampusmu!'}
            </h1>

            <p className="text-red-100 leading-relaxed">
              {isSeller
                ? 'Bergabunglah dengan KantinKita dan kelola menu, pesanan, serta operasional kantin dengan lebih praktis.'
                : 'Buat akun KantinKita dan nikmati pengalaman memesan makanan serta minuman favorit di lingkungan kampus.'}
            </p>
          </div>

          <p className="text-sm text-red-100">
            © 2026 KantinKita. All rights reserved.
          </p>
        </div>

        {/* FORM PENDAFTARAN */}
        <div className="p-8 sm:p-12 lg:p-14">
          <div className="md:hidden mb-8">
            <Logo />
          </div>

          <div className="mb-7">
            <div className="mb-3 flex items-center gap-2 text-[#CC0000]">
              {isSeller
                ? <Store size={20} />
                : <GraduationCap size={20} />}
              <p className="text-sm font-semibold">
                DAFTAR {roleName.toUpperCase()}
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Buat Akun Baru
            </h2>

            <p className="text-gray-500">
              Lengkapi informasi berikut untuk membuat akun KantinKita.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAMA */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                {isSeller ? 'Nama Pemilik / Pengelola' : 'Nama Lengkap'}
              </label>

              <div className="relative">
                <UserRound size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  autoComplete="name"
                  className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#CC0000] focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            {/* NAMA KANTIN KHUSUS PENJUAL */}
            {isSeller && (
              <div>
                <label htmlFor="canteenName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Kantin
                </label>

                <div className="relative">
                  <Utensils size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="canteenName"
                    name="canteenName"
                    type="text"
                    value={form.canteenName}
                    onChange={handleChange}
                    placeholder="Contoh: Kantin Bu Sari"
                    className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#CC0000] focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>

              <div className="relative">
                <Mail size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  autoComplete="email"
                  className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#CC0000] focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            {/* NOMOR HP */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor HP
              </label>

              <div className="relative">
                <Phone size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="08xxxxxxxxxx"
                  autoComplete="tel"
                  className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#CC0000] focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Kata Sandi
              </label>

              <div className="relative">
                <Lock size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter"
                  autoComplete="new-password"
                  className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-12 outline-none focus:border-[#CC0000] focus:ring-2 focus:ring-red-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* KONFIRMASI PASSWORD */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Konfirmasi Kata Sandi
              </label>

              <div className="relative">
                <Lock size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi kata sandi"
                  autoComplete="new-password"
                  className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-12 outline-none focus:border-[#CC0000] focus:ring-2 focus:ring-red-100"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi kata sandi' : 'Tampilkan konfirmasi kata sandi'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword
                    ? <EyeOff size={19} />
                    : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#CC0000] hover:bg-red-800 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
            >
              Daftar Sekarang
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-7">
            Sudah punya akun?{' '}
            <Link
              to={`/login?role=${role}`}
              className="text-[#CC0000] font-semibold hover:underline"
            >
              Masuk
            </Link>
          </p>

          <div className="text-center mt-5">
            <Link
              to="/pilih-peran"
              className="text-sm text-gray-400 hover:text-[#CC0000]"
            >
              Kembali ke Pilihan Akun
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}