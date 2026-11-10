import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Store,
  GraduationCap,
} from 'lucide-react'
import Logo from '../components/Logo'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const role = searchParams.get('role')
  const isSeller = role === 'penjual'
  const roleName = isSeller ? 'Penjual' : 'Mahasiswa'

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
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

    if (!form.email.trim() || !form.password.trim()) {
      setError('Email dan kata sandi wajib diisi.')
      return
    }

    const email = form.email.trim().toLowerCase()

    let users = []

    try {
      const savedUsers = JSON.parse(
        localStorage.getItem('kantinkita_users') || '[]'
      )

      users = Array.isArray(savedUsers)
        ? savedUsers
        : savedUsers
          ? [savedUsers]
          : []
    } catch {
      setError('Data akun bermasalah. Silakan daftar kembali.')
      return
    }

    const account = users.find((user) => {
      const userEmail = (user.email || '').toLowerCase()
      const userRole =
        user.role || user.userType || user.jenisAkun || 'mahasiswa'

      return userEmail === email && userRole === role
    })

    if (!account) {
      setError(
        `Akun ${roleName} tidak ditemukan. Silakan periksa email atau daftar terlebih dahulu.`
      )
      return
    }

    if (account.password !== form.password) {
      setError('Kata sandi yang kamu masukkan salah.')
      return
    }

    const loggedInUser = {
      ...account,
      role,
      email: account.email,
      name: account.name || account.fullName || account.nama || email.split('@')[0],
    }

    localStorage.setItem(
      'kantinkita_user',
      JSON.stringify(loggedInUser)
    )

    if (isSeller) {
      navigate('/penjual/dashboard')
    } else {
      navigate('/')
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
            Silakan pilih apakah kamu masuk sebagai mahasiswa atau penjual.
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

        <div className="hidden md:flex flex-col justify-between bg-[#CC0000] text-white p-12">
          <Logo light />

          <div>
            <h1 className="text-4xl font-bold leading-tight mb-5">
              Selamat Datang Kembali!
            </h1>
            <p className="text-red-100 leading-relaxed">
              {isSeller
                ? 'Kelola kantin, menu, pesanan, dan aktivitas usaha kamu dengan mudah melalui KantinKita.'
                : 'Pesan makanan favoritmu di kantin kampus dengan lebih mudah, cepat, dan praktis melalui KantinKita.'}
            </p>
          </div>

          <p className="text-sm text-red-100">
            © 2026 KantinKita. All rights reserved.
          </p>
        </div>

        <div className="p-8 sm:p-12 lg:p-14">
          <div className="md:hidden mb-8">
            <Logo />
          </div>

          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2 text-[#CC0000]">
              {isSeller
                ? <Store size={20} />
                : <GraduationCap size={20} />}
              <p className="text-sm font-semibold">
                LOGIN {roleName.toUpperCase()}
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Masuk ke Akun
            </h2>
            <p className="text-gray-500">
              Masukkan email dan kata sandi akun {roleName.toLowerCase()} kamu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  autoComplete="email"
                  className="w-full border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-[#CC0000] focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Kata Sandi
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Masukkan kata sandi"
                  autoComplete="current-password"
                  className="w-full border border-gray-200 rounded-xl py-3.5 pl-12 pr-12 outline-none focus:border-[#CC0000] focus:ring-2 focus:ring-red-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? 'Sembunyikan kata sandi'
                      : 'Tampilkan kata sandi'
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword
                    ? <EyeOff size={19} />
                    : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="text-sm text-red-600 bg-red-50 rounded-lg p-3"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#CC0000] hover:bg-red-800 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
            >
              Masuk
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Belum punya akun?{' '}
            <Link
              to={`/register?role=${role}`}
              className="text-[#CC0000] font-semibold hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>

          <div className="text-center mt-6">
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