import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Store,
} from 'lucide-react'
import Logo from '../components/Logo'

export default function PilihPeran() {
  const [searchParams] = useSearchParams()

  // Membaca pilihan dari halaman Welcome
  const isLogin = searchParams.get('mode') === 'login'
  const mode = isLogin ? 'login' : 'register'

  const actionLabel = isLogin ? 'Masuk sebagai' : 'Daftar sebagai'

  const roles = [
    {
      id: 'mahasiswa',
      title: 'Mahasiswa',
      description:
        'Jelajahi kantin kampus, pesan makanan, pantau pesanan, dan berikan ulasan.',
      icon: GraduationCap,
      iconColor: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'penjual',
      title: 'Penjual',
      description:
        'Kelola kantin, menu, stok, pesanan masuk, jam operasional, dan laporan usaha.',
      icon: Store,
      iconColor: 'bg-red-50 text-[#CC0000]',
    },
  ]

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-5 py-8">
      <div className="mx-auto max-w-5xl">

        {/* BACK BUTTON */}
        <Link
          to="/welcome"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#CC0000]"
        >
          <ArrowLeft size={17} />
          Kembali
        </Link>

        {/* HEADER */}
        <div className="mt-10 text-center">
          <div className="flex justify-center">
            <Logo />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            {isLogin ? 'Masuk ke Akun' : 'Pilih Jenis Akun'}
          </h1>

          <p className="mt-2 text-gray-500">
            {isLogin
              ? 'Pilih jenis akun yang sudah kamu miliki.'
              : 'Pilih jenis akun untuk mendaftar di KantinKita.'}
          </p>
        </div>

        {/* ROLE CARDS */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {roles.map((role) => {
            const Icon = role.icon

            return (
              <article
                key={role.id}
                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* ICON */}
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${role.iconColor}`}
                >
                  <Icon size={32} />
                </div>

                {/* TITLE */}
                <h2 className="mt-6 text-2xl font-bold text-gray-900">
                  {role.title}
                </h2>

                {/* DESCRIPTION */}
                <p className="mt-3 min-h-[52px] text-sm leading-relaxed text-gray-500">
                  {role.description}
                </p>

                {/* ACTION */}
                <Link
                  to={`/${mode}?role=${role.id}`}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#CC0000] px-5 py-4 text-sm font-bold !text-white transition hover:bg-red-800"
                >
                  <span className="!text-white">
                    {actionLabel} {role.title}
                  </span>

                  <ArrowRight size={17} color="#FFFFFF" />
                </Link>
              </article>
            )
          })}
        </div>

        {/* FOOTER */}
        <p className="mt-8 text-center text-xs text-gray-400">
          KantinKita · Pesan Mudah, Makan Nyaman
        </p>
      </div>
    </main>
  )
}