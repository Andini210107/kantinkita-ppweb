import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Utensils,
  ShoppingBag,
  Clock,
  Store,
  CheckCircle2,
} from 'lucide-react'
import Logo from '../components/Logo'

export default function Welcome() {
  return (
    <main className="min-h-screen overflow-hidden bg-white">
      {/* NAVBAR */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link to="/welcome" className="inline-flex">
          <Logo />
        </Link>
      </nav>

      {/* HERO */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-12 lg:grid-cols-2 lg:px-10 lg:pb-28 lg:pt-20">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-bold text-[#CC0000]">
            <span className="h-2 w-2 rounded-full bg-[#CC0000]" />
            Solusi Pesan Makanan di Kampus
          </div>

          <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Lapar di Kampus?
            <span className="mt-2 block text-[#CC0000]">
              Pesan Aja di KantinKita!
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-500">
            Temukan makanan favoritmu, pesan dari kantin kampus, dan pantau
            pesanan tanpa harus mengantre lama. Semua jadi lebih praktis dalam
            satu aplikasi.
          </p>

          {/* ACTION BUTTONS */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {/* Tombol Daftar */}
            <Link
                to="/pilih-peran?mode=register"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#CC0000] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-red-100 transition hover:-translate-y-0.5 hover:bg-red-800"
            >
                Mulai Sekarang
                <ArrowRight size={19} />
            </Link>

            {/* Tombol Masuk */}
            <Link
                to="/pilih-peran?mode=login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-700 transition hover:border-[#CC0000] hover:text-[#CC0000]"
            >
                Saya Sudah Punya Akun
            </Link>
            </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600" />
              Praktis dan mudah
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600" />
              Pantau pesanan
            </span>
          </div>
        </div>

        {/* VISUAL */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -right-5 -top-5 h-40 w-40 rounded-full bg-red-100 blur-3xl" />
          <div className="absolute -bottom-5 -left-5 h-40 w-40 rounded-full bg-orange-100 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] bg-[#FFF5F2] p-5 sm:p-8">
            <div className="rounded-2xl bg-white p-5 shadow-xl shadow-red-100/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Selamat datang!
                  </p>

                  <h2 className="mt-1 text-lg font-extrabold text-slate-900">
                    Mau makan apa hari ini?
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#CC0000]">
                  <ShoppingBag size={22} />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-orange-50 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-orange-600">
                    <Utensils size={22} />
                  </div>

                  <p className="mt-4 text-sm font-extrabold text-slate-800">
                    Pilih Menu
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Temukan makanan favorit
                  </p>
                </div>

                <div className="rounded-2xl bg-red-50 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#CC0000]">
                    <Store size={22} />
                  </div>

                  <p className="mt-4 text-sm font-extrabold text-slate-800">
                    Pilih Kantin
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Jelajahi kantin kampus
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 text-green-600">
                    <Clock size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Pesanan Lebih Teratur
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Pantau status pesananmu dengan mudah.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[#CC0000] p-5 text-white">
              <p className="text-xs font-medium text-red-100">
                Pengalaman pesan makanan
              </p>

              <p className="mt-1 text-xl font-extrabold text-white">
                Lebih Mudah, Lebih Praktis!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-slate-100 bg-[#F8FAFC] px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#CC0000]">
              Kenapa KantinKita?
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
              Pesan Makanan Jadi Lebih Praktis
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Nikmati kemudahan memesan makanan dari kantin kampus melalui
              beberapa langkah sederhana.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Store,
                title: 'Banyak Pilihan Kantin',
                description:
                  'Jelajahi berbagai kantin dan temukan menu favoritmu.',
              },
              {
                icon: ShoppingBag,
                title: 'Pemesanan Mudah',
                description:
                  'Pilih menu, masukkan keranjang, dan buat pesanan.',
              },
              {
                icon: Clock,
                title: 'Pantau Pesanan',
                description:
                  'Ketahui perkembangan pesanan tanpa harus bertanya langsung.',
              },
            ].map((feature) => {
              const Icon = feature.icon

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#CC0000]">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 font-extrabold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white px-6 py-7">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="font-extrabold text-slate-900">
            Kantin<span className="text-[#CC0000]">Kita.</span>
          </p>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} KantinKita. Pemesanan makanan kampus
            lebih praktis.
          </p>
        </div>
      </footer>
    </main>
  )
}