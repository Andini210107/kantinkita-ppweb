import { Link, NavLink } from 'react-router-dom'
import { ShoppingCart, UserRound } from 'lucide-react'
import Logo from './Logo'

const navItems = [
  { label: 'Beranda', path: '/' },
  { label: 'Jelajahi Kantin', path: '/kantin' },
  { label: 'Pesanan Saya', path: '/riwayat-pesanan' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-8">

        {/* LOGO */}
        <Link to="/" aria-label="KantinKita - Beranda">
          <Logo />
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-[#CC0000]'
                    : 'text-gray-600 hover:text-[#CC0000]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3">

          {/* KERANJANG */}
          <Link
            to="/keranjang"
            aria-label="Keranjang belanja"
            title="Keranjang"
            className="relative rounded-xl p-2.5 text-gray-700 transition hover:bg-red-50 hover:text-[#CC0000]"
          >
            <ShoppingCart size={21} />
          </Link>

          {/* PROFIL */}
          <Link
            to="/profil"
            aria-label="Profil pengguna"
            title="Profil pengguna"
            className="rounded-xl p-2.5 text-gray-700 transition hover:bg-red-50 hover:text-[#CC0000]"
          >
            <UserRound size={21} />
          </Link>

          {/* MASUK */}
          <Link
            to="/pilih-peran?mode=login"
            className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:inline-flex"
          >
            Masuk
          </Link>

          {/* DAFTAR */}
          <Link
            to="/pilih-peran?mode=register"
            className="rounded-xl bg-[#CC0000] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#A80000]"
          >
            Daftar
          </Link>

        </div>
      </div>
    </header>
  )
}