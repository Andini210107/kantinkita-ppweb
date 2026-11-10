import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Search,
  Store,
  ChevronRight,
  Star,
  Clock3,
  Bike,
  Zap,
  Utensils,
  Coffee,
  Cookie,
  Plus,
  SlidersHorizontal,
  CheckCircle2,
} from 'lucide-react'

const categories = ['Semua', 'Makanan', 'Minuman', 'Camilan']

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function Beranda() {
  const [canteens, setCanteens] = useState([])
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [notification, setNotification] = useState('')

  useEffect(() => {
    async function fetchHomeData() {
      try {
        setLoading(true)
        setError('')

        const [canteenResponse, menuResponse] = await Promise.all([
          fetch('/data/canteens.json'),
          fetch('/data/menus.json'),
        ])

        if (!canteenResponse.ok || !menuResponse.ok) {
          throw new Error('Data KantinKita gagal dimuat.')
        }

        const canteenData = await canteenResponse.json()
        const menuData = await menuResponse.json()

        setCanteens(canteenData)
        setMenus(menuData)
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat mengambil data.')
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      const matchesCategory =
        activeCategory === 'Semua' ||
        menu.category === activeCategory

      const keyword = search.toLowerCase()

      const matchesSearch =
        menu.name.toLowerCase().includes(keyword) ||
        menu.canteen.toLowerCase().includes(keyword) ||
        menu.description.toLowerCase().includes(keyword)

      return matchesCategory && matchesSearch
    })
  }, [menus, activeCategory, search])

  const filteredCanteens = useMemo(() => {
    const keyword = search.toLowerCase()

    return canteens.filter((canteen) =>
      canteen.name.toLowerCase().includes(keyword) ||
      canteen.description.toLowerCase().includes(keyword)
    )
  }, [canteens, search])

  // MENAMBAHKAN MENU KE KERANJANG
  function addToCart(menu) {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem('kantinkita_cart') || '[]'
      )

      if (!Array.isArray(savedCart)) {
        throw new Error('Data keranjang tidak valid.')
      }

      const existingItem = savedCart.find(
        (item) => item.id === menu.id
      )

      if (existingItem) {
        existingItem.quantity = (Number(existingItem.quantity) || 0) + 1
      } else {
        savedCart.push({
          ...menu,
          quantity: 1,
        })
      }

      localStorage.setItem(
        'kantinkita_cart',
        JSON.stringify(savedCart)
      )

      setNotification(`${menu.name} berhasil ditambahkan ke keranjang.`)

      window.setTimeout(() => {
        setNotification('')
      }, 2500)
    } catch (err) {
      console.error('Gagal menambahkan menu:', err)
      setNotification('Menu gagal ditambahkan. Silakan coba lagi.')

      window.setTimeout(() => {
        setNotification('')
      }, 2500)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-8 lg:px-8">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50 via-white to-slate-50 p-6 shadow-sm md:p-9">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-red-100/70 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="flex max-w-3xl flex-col gap-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-rose-100 bg-white px-4 py-2 text-xs font-bold text-[#CC0000] shadow-sm">
                <MapPin size={15} />
                Kantin Kampus TEL-U Purwokerto
              </div>

              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
                Halo, Mahasiswa! <span>👋</span>
              </h1>

              <p className="max-w-xl text-sm leading-7 text-slate-500 md:text-base">
                Mau makan apa hari ini sebelum kelas? Pesan lebih awal,
                ambil santai tanpa antre.
              </p>

              <div className="mt-2 flex flex-col gap-3">
                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-[#CC0000]">
                  <Search size={19} className="shrink-0 text-slate-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Cari geprek, mie ayam, atau es teh..."
                    className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    aria-label="Cari kantin atau menu"
                  />

                  <SlidersHorizontal size={18} className="shrink-0 text-slate-400" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const active = activeCategory === category

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveCategory(category)}
                        className={`rounded-full px-5 py-2.5 text-xs font-bold transition ${
                          active
                            ? 'bg-[#CC0000] text-white shadow-md shadow-red-200'
                            : 'border border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:text-[#CC0000]'
                        }`}
                      >
                        {category === 'Semua' && <Utensils size={14} className="mr-1.5 inline" />}
                        {category === 'Makanan' && <Utensils size={14} className="mr-1.5 inline" />}
                        {category === 'Minuman' && <Coffee size={14} className="mr-1.5 inline" />}
                        {category === 'Camilan' && <Cookie size={14} className="mr-1.5 inline" />}
                        {category}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="w-full shrink-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:max-w-xs">
              <div className="flex items-center gap-3 text-[#CC0000]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                  <Zap size={21} fill="currentColor" />
                </div>
                <h2 className="font-bold">Self-Pickup Fast-Lane</h2>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Pesan duluan saat masih di kelas, tinggal ambil di kios
                pas bel istirahat bunyi. Santai tanpa desak-desakan!
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Semua loket express beroperasi normal
              </div>
            </div>
          </div>
        </section>

        {/* LOADING */}
        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Sedang memuat data kantin dan menu...
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 rounded-lg bg-[#CC0000] px-4 py-2 text-sm font-semibold text-white"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* CANTEEN SECTION */}
            <section>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Store className="text-[#CC0000]" size={23} />
                  <h2 className="text-xl font-extrabold text-slate-900 md:text-2xl">
                    Pilih Kantin Kampus
                  </h2>
                </div>

                <Link
                  to="/kantin"
                  className="flex items-center gap-1 text-sm font-bold text-[#CC0000] hover:text-red-800"
                >
                  Semua Kantin <ChevronRight size={17} />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {filteredCanteens.map((canteen) => (
                  <article
                    key={canteen.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={canteen.image}
                        alt={canteen.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <span className="absolute left-3 top-3 rounded-full border border-slate-100 bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                        <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-green-500" />
                        Buka • {canteen.hours}
                      </span>

                      <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm">
                        <Star size={13} fill="#F59E0B" className="text-amber-500" />
                        {canteen.rating}
                        <span className="font-normal text-slate-500">
                          ({canteen.reviews})
                        </span>
                      </span>

                      <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-slate-900/85 px-2.5 py-1 text-[11px] font-medium text-white">
                        <Bike size={13} />
                        {canteen.distance}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-5 p-5">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#CC0000]">
                            {canteen.name}
                          </h3>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">
                            {canteen.location}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {canteen.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {canteen.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-rose-50 px-3 py-1 text-[11px] font-semibold text-[#CC0000]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                            <Clock3 size={15} />
                            Estimasi {canteen.estimate}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {canteen.menuCount} menu siap dipesan
                          </p>
                        </div>

                        <Link
                          to={`/kantin/${canteen.id}`}
                          className="flex items-center gap-2 rounded-full bg-[#CC0000] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-800"
                        >
                          Lihat Menu & Pesan
                          <ChevronRight size={15} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredCanteens.length === 0 && (
                <p className="rounded-xl bg-white p-8 text-center text-sm text-slate-500">
                  Kantin tidak ditemukan.
                </p>
              )}
            </section>

            {/* POPULAR MENU SECTION */}
            <section>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <h2 className="text-xl font-extrabold text-slate-900 md:text-2xl">
                    Menu Populer Favorit Mahasiswa
                  </h2>
                </div>

                <span className="text-xs text-slate-400">
                  Paling sering dipesan jam makan siang
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredMenus.map((menu) => (
                  <article
                    key={menu.id}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden rounded-xl">
                        <img
                          src={menu.image}
                          alt={menu.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <span className="absolute left-2 top-2 rounded-full bg-green-100/95 px-3 py-1 text-[11px] font-bold text-green-700">
                          • Tersedia
                        </span>
                      </div>

                      <div className="px-1 pt-4">
                        <p className="text-xs font-bold text-[#CC0000]">
                          {menu.canteen}
                        </p>
                        <h3 className="mt-1 font-bold text-slate-900 group-hover:text-[#CC0000]">
                          {menu.name}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                          {menu.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 px-1 pt-3">
                      <span className="font-extrabold text-[#CC0000]">
                        {formatPrice(menu.price)}
                      </span>

                      <button
                        type="button"
                        onClick={() => addToCart(menu)}
                        aria-label={`Tambah ${menu.name} ke keranjang`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#CC0000] text-white transition hover:bg-red-800 active:scale-95"
                      >
                        <Plus size={19} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {filteredMenus.length === 0 && (
                <p className="rounded-xl bg-white p-8 text-center text-sm text-slate-500">
                  Menu tidak ditemukan. Coba kata kunci atau kategori lain.
                </p>
              )}
            </section>
          </>
        )}
      </div>

      {/* NOTIFICATION */}
      {notification && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-3 rounded-xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white shadow-xl"
        >
          <CheckCircle2 size={20} className="shrink-0 text-green-400" />
          {notification}
        </div>
      )}
    </div>
  )
}