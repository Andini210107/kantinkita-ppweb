import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Utensils,
  ClipboardList,
  Store,
  LogOut,
  Menu,
  X,
  Clock,
  Star,
  Wallet,
  Settings,
  UserRound,
} from 'lucide-react'
import Logo from '../Logo'

const links = [
  {
    label: 'Dashboard',
    path: '/penjual/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Pesanan Masuk',
    path: '/penjual/pesanan',
    icon: ClipboardList,
  },
  {
    label: 'Kelola Menu & Stok',
    path: '/penjual/kelola-menu',
    icon: Utensils,
  },
  {
    label: 'Jam Operasional',
    path: '/penjual/operasional',
    icon: Clock,
  },
  {
    label: 'Ulasan Pembeli',
    path: '/penjual/ulasan',
    icon: Star,
  },
  {
    label: 'Buku Kas & Payout',
    path: '/penjual/keuangan',
    icon: Wallet,
  },
  {
    label: 'Profil Penjual',
    path: '/penjual/profil',
    icon: UserRound,
  },
  {
    label: 'Pengaturan',
    path: '/penjual/pengaturan',
    icon: Settings,
  },
]

export default function LayoutPenjual() {
  const navigate = useNavigate()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [seller, setSeller] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const savedUser = JSON.parse(
        localStorage.getItem('kantinkita_user') || 'null'
      )

      if (!savedUser || savedUser.role !== 'penjual') {
        navigate('/login?role=penjual', { replace: true })
        return
      }

      const canteenId =
        savedUser.canteenId || savedUser.id

      const canteenName =
        savedUser.canteenName ||
        savedUser.businessName ||
        'Kantin Saya'

      const sellerData = {
        ...savedUser,
        canteenId,
        canteenName,
      }

      setSeller(sellerData)

      localStorage.setItem(
        'kantinkita_seller_canteen',
        String(canteenId)
      )

      localStorage.setItem(
        'kantinkita_user',
        JSON.stringify(sellerData)
      )

      window.dispatchEvent(
        new Event('kantinkita-canteen-changed')
      )
    } catch (error) {
      console.error('Gagal membaca akun penjual:', error)
      navigate('/login?role=penjual', { replace: true })
    } finally {
      setLoading(false)
    }
  }, [navigate])

  function handleLogout() {
    localStorage.removeItem('kantinkita_user')
    localStorage.removeItem('kantinkita_seller_canteen')

    navigate('/welcome', { replace: true })
  }

  const SidebarLinks = () => (
    <>
      {links.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-red-50 text-[#CC0000]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#CC0000]'
              }`
            }
          >
            <Icon size={19} />
            {item.label}
          </NavLink>
        )
      })}
    </>
  )

  if (loading || !seller) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 border-red-100 border-t-[#CC0000]" />
          <p className="text-sm text-gray-500">
            Memuat panel penjual...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]">

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 lg:px-8">

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
              aria-label="Buka navigasi"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link to="/penjual/dashboard">
              <Logo />
            </Link>

            <span className="hidden rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-[#CC0000] sm:inline-flex">
              PANEL PENJUAL
            </span>
          </div>

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-xs text-gray-400">
                Mengelola kantin
              </p>
              <p className="text-sm font-bold text-gray-800">
                {seller.canteenName}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#CC0000]">
              <Store size={19} />
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Keluar dari akun"
              className="hidden items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-[#CC0000] sm:flex"
            >
              <LogOut size={16} />
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">

        {/* SIDEBAR DESKTOP */}
        <aside className="hidden min-h-[calc(100vh-73px)] w-72 shrink-0 border-r border-gray-100 bg-white p-5 lg:block">

          <div className="mb-7 rounded-2xl bg-red-50 p-4">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#CC0000] shadow-sm">
              <Store size={22} />
            </div>

            <p className="text-xs text-gray-500">
              Selamat datang,
            </p>

            <p className="mt-1 font-bold text-gray-900">
              {seller.name}
            </p>

            <p className="mt-1 text-xs text-gray-600">
              {seller.canteenName}
            </p>
          </div>

          <p className="mb-4 px-4 text-xs font-bold uppercase tracking-wider text-gray-400">
            Menu Utama
          </p>

          <nav className="space-y-1.5">
            <SidebarLinks />
          </nav>

          <div className="mt-10 rounded-2xl border border-gray-100 p-4">
            <div className="mb-2 flex items-center gap-2 text-[#CC0000]">
              <Store size={18} />
              <span className="text-sm font-bold">
                KantinKita
              </span>
            </div>

            <p className="text-xs leading-5 text-gray-500">
              Kelola bisnis kantin dan berikan pengalaman terbaik bagi pelanggan.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-500 transition hover:bg-red-50 hover:text-[#CC0000]"
          >
            <LogOut size={19} />
            Keluar dari Akun
          </button>
        </aside>

        {/* SIDEBAR MOBILE */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <aside
              className="h-full w-80 max-w-[85%] overflow-y-auto bg-white p-5 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-8 flex items-center justify-between">
                <Logo />

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Tutup navigasi"
                  className="rounded-lg p-2 hover:bg-gray-100"
                >
                  <X size={21} />
                </button>
              </div>

              <div className="mb-6 rounded-2xl bg-red-50 p-4">
                <p className="text-xs text-gray-500">
                  Akun Penjual
                </p>
                <p className="mt-1 font-bold text-gray-900">
                  {seller.name}
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  {seller.canteenName}
                </p>
              </div>

              <nav className="space-y-1.5">
                <SidebarLinks />
              </nav>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-8 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-[#CC0000]"
              >
                <LogOut size={18} />
                Keluar dari Akun
              </button>
            </aside>
          </div>
        )}

        {/* KONTEN */}
        <main className="min-w-0 flex-1 p-5 sm:p-7 lg:p-9">
          <Outlet />
        </main>
      </div>
    </div>
  )
}