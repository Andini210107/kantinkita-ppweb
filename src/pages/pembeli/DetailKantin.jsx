import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Search,
  MapPin,
  Star,
  Clock3,
  Plus,
  Minus,
  ShoppingCart,
  ChevronLeft,
  Utensils,
  Coffee,
  Cookie,
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

export default function DetailKantin() {
  const { id } = useParams()

  const [canteen, setCanteen] = useState(null)
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [notification, setNotification] = useState('')

  useEffect(() => {
    async function fetchDetailData() {
      try {
        setLoading(true)
        setError('')

        const [canteenResponse, menuResponse] = await Promise.all([
          fetch('/data/canteens.json'),
          fetch('/data/menus.json'),
        ])

        if (!canteenResponse.ok || !menuResponse.ok) {
          throw new Error('Data kantin atau menu gagal dimuat.')
        }

        const canteenData = await canteenResponse.json()
        const menuData = await menuResponse.json()

        const selectedCanteen = canteenData.find(
          (item) => item.id === id
        )

        if (!selectedCanteen) {
          throw new Error('Kantin tidak ditemukan.')
        }

        setCanteen(selectedCanteen)

        const availableMenus = menuData.filter((menu) => {
          return (
            menu.canteen === selectedCanteen.name ||
            menu.canteen.includes('&')
          )
        })

        setMenus(availableMenus)
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan.')
      } finally {
        setLoading(false)
      }
    }

    fetchDetailData()
  }, [id])

  const filteredMenus = useMemo(() => {
    const keyword = search.toLowerCase()

    return menus.filter((menu) => {
      const matchesCategory =
        activeCategory === 'Semua' ||
        menu.category === activeCategory

      const matchesSearch =
        menu.name.toLowerCase().includes(keyword) ||
        menu.description.toLowerCase().includes(keyword)

      return matchesCategory && matchesSearch
    })
  }, [menus, search, activeCategory])

  function addToCart(menu) {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem('kantinkita_cart') || '[]'
      )

      const existingItem = savedCart.find(
        (item) => item.id === menu.id
      )

      if (existingItem) {
        existingItem.quantity += 1
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
    } catch {
      setNotification('Menu gagal ditambahkan. Silakan coba lagi.')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <p className="text-sm text-slate-500">
          Sedang memuat detail kantin...
        </p>
      </div>
    )
  }

  if (error || !canteen) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center px-5 text-center">
        <h2 className="text-2xl font-extrabold text-slate-900">
          Kantin tidak ditemukan
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {error}
        </p>

        <Link
          to="/kantin"
          className="mt-5 rounded-xl bg-[#CC0000] px-5 py-3 text-sm font-bold text-white"
        >
          Kembali ke Daftar Kantin
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">

        {/* BREADCRUMB */}
        <Link
          to="/kantin"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#CC0000]"
        >
          <ChevronLeft size={18} />
          Kembali ke Daftar Kantin
        </Link>

        {/* CANTEEN PROFILE */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-64 md:h-80">
            <img
              src={canteen.image}
              alt={canteen.name}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white md:bottom-8 md:left-9">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold">
                <CheckCircle2 size={14} />
                Kantin tersedia
              </span>

              <h1 className="text-3xl font-extrabold md:text-4xl">
                {canteen.name}
              </h1>

              <p className="mt-2 flex items-center gap-2 text-sm text-white/90">
                <MapPin size={16} />
                {canteen.location}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-3 md:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                <Star size={21} fill="currentColor" />
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  {canteen.rating} / 5.0
                </p>
                <p className="text-xs text-slate-500">
                  {canteen.reviews}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#CC0000]">
                <Clock3 size={21} />
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  Jam Operasional
                </p>
                <p className="text-xs text-slate-500">
                  {canteen.hours}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <Utensils size={21} />
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  {canteen.menuCount} Menu
                </p>
                <p className="text-xs text-slate-500">
                  Estimasi {canteen.estimate}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CANTEEN DESCRIPTION */}
        <section className="mt-8">
          <h2 className="text-xl font-extrabold text-slate-900">
            Tentang Kantin
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
            {canteen.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {canteen.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-[#CC0000]"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* MENU HEADER */}
        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#CC0000]">
                PILIHAN MENU
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-slate-900 md:text-3xl">
                Menu {canteen.name}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Pilih makanan dan minuman favoritmu.
              </p>
            </div>

            <Link
              to="/keranjang"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#CC0000] hover:text-[#CC0000]"
            >
              <ShoppingCart size={18} />
              Lihat Keranjang
            </Link>
          </div>
        </section>

        {/* SEARCH */}
        <section className="mt-6">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 focus-within:border-[#CC0000]">
            <Search size={19} className="text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama makanan atau minuman..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              aria-label="Cari menu"
            />
          </div>
        </section>

        {/* CATEGORY FILTER */}
        <section className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => {
            const active = activeCategory === category

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-5 py-2.5 text-xs font-bold transition ${
                  active
                    ? 'bg-[#CC0000] text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:text-[#CC0000]'
                }`}
              >
                {category === 'Makanan' && (
                  <Utensils size={14} className="mr-1.5 inline" />
                )}
                {category === 'Minuman' && (
                  <Coffee size={14} className="mr-1.5 inline" />
                )}
                {category === 'Camilan' && (
                  <Cookie size={14} className="mr-1.5 inline" />
                )}
                {category}
              </button>
            )
          })}
        </section>

        {/* MENU COUNT */}
        <p className="mt-6 text-sm text-slate-500">
          Menampilkan <strong>{filteredMenus.length}</strong> menu
        </p>

        {/* MENU GRID */}
        <section className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMenus.map((menu) => (
            <article
              key={menu.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <div className="relative h-48 overflow-hidden rounded-xl">
                  <img
                    src={menu.image}
                    alt={menu.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-green-100 px-3 py-1.5 text-[11px] font-bold text-green-700">
                    Tersedia
                  </span>
                </div>

                <div className="px-1 pt-4">
                  <span className="text-xs font-bold text-[#CC0000]">
                    {menu.category}
                  </span>

                  <h3 className="mt-1 text-base font-extrabold text-slate-900">
                    {menu.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                    {menu.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 px-1 pt-4">
                <span className="font-extrabold text-[#CC0000]">
                  {formatPrice(menu.price)}
                </span>

                <button
                  onClick={() => addToCart(menu)}
                  aria-label={`Tambah ${menu.name} ke keranjang`}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CC0000] text-white transition hover:bg-red-800"
                >
                  <Plus size={20} />
                </button>
              </div>
            </article>
          ))}
        </section>

        {filteredMenus.length === 0 && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <Utensils className="mx-auto text-slate-300" size={40} />
            <h3 className="mt-4 font-bold text-slate-800">
              Menu tidak ditemukan
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Coba kata kunci atau kategori yang berbeda.
            </p>
            <button
              onClick={() => {
                setSearch('')
                setActiveCategory('Semua')
              }}
              className="mt-4 text-sm font-bold text-[#CC0000]"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* BOTTOM CTA */}
        <section className="mt-12 flex flex-col justify-between gap-5 rounded-2xl bg-red-50 p-7 md:flex-row md:items-center md:p-9">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Sudah selesai memilih menu?
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Periksa pesananmu sebelum melanjutkan checkout.
            </p>
          </div>

          <Link
            to="/keranjang"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#CC0000] px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800"
          >
            <ShoppingCart size={18} />
            Buka Keranjang
          </Link>
        </section>
      </div>

      {/* NOTIFICATION */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-3 rounded-xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white shadow-xl">
          <CheckCircle2 size={20} className="shrink-0 text-green-400" />
          {notification}
        </div>
      )}
    </div>
  )
}