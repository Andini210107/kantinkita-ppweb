import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  MapPin,
  Star,
  Clock3,
  ChevronRight,
  Store,
  Utensils,
  RefreshCw,
} from 'lucide-react'

export default function DaftarKantin() {
  const [canteens, setCanteens] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchCanteens() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch('/data/canteens.json')

        if (!response.ok) {
          throw new Error('Data kantin gagal dimuat.')
        }

        const data = await response.json()
        setCanteens(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan.')
      } finally {
        setLoading(false)
      }
    }

    fetchCanteens()
  }, [])

  const filteredCanteens = canteens.filter((canteen) => {
    const keyword = search.toLowerCase()
    const name = (canteen.name || '').toLowerCase()
    const location = (canteen.location || '').toLowerCase()
    const description = (canteen.description || '').toLowerCase()
    const tags = Array.isArray(canteen.tags) ? canteen.tags : []

    return (
      name.includes(keyword) ||
      location.includes(keyword) ||
      description.includes(keyword) ||
      tags.some((tag) => String(tag).toLowerCase().includes(keyword))
    )
  })

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">

        {/* PAGE HEADER */}
        <section className="mb-9">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#CC0000]">
            <Store size={18} />
            Eksplorasi Kantin
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Jelajahi Kantin Kampus
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
            Temukan berbagai pilihan makanan dan minuman favoritmu.
            Pilih kantin, lihat menunya, dan pesan tanpa harus mengantre.
          </p>
        </section>

        {/* SEARCH */}
        <section className="mb-8">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition focus-within:border-[#CC0000]">
            <Search className="shrink-0 text-slate-400" size={21} />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama kantin, lokasi, atau jenis makanan..."
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              aria-label="Cari kantin"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-xs font-semibold text-[#CC0000]"
              >
                Hapus
              </button>
            )}
          </div>
        </section>

        {/* SUMMARY */}
        <section className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Pilihan Kantin
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? 'Sedang mengambil data...'
                : `${filteredCanteens.length} kantin ditemukan`}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-[#CC0000]">
            <MapPin size={15} />
            Telkom University
          </div>
        </section>

        {/* LOADING */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <RefreshCw
              className="mx-auto animate-spin text-[#CC0000]"
              size={28}
            />

            <p className="mt-4 text-sm text-slate-500">
              Sedang memuat daftar kantin...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-[#CC0000] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Muat Ulang
            </button>
          </div>
        )}

        {/* CANTEEN CARDS */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredCanteens.map((canteen) => (
                <article
                  key={canteen.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* IMAGE */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={canteen.image}
                      alt={canteen.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    <span className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow">
                      <Store
                        size={14}
                        className="mr-1.5 inline text-[#CC0000]"
                      />
                      {canteen.menuCount} Menu
                    </span>

                    <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow">
                      <Star
                        size={14}
                        fill="#F59E0B"
                        className="text-amber-500"
                      />
                      {canteen.rating}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900 transition group-hover:text-[#CC0000]">
                          {canteen.name}
                        </h3>

                        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                          <MapPin size={15} className="text-[#CC0000]" />
                          {canteen.location}
                        </p>
                      </div>

                      <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                        {canteen.estimate}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      {canteen.description}
                    </p>

                    {/* TAGS */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(canteen.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-[#CC0000]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* INFO */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div>
                        <p className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                          <Clock3 size={15} className="text-[#CC0000]" />
                          {canteen.hours}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {canteen.reviews}
                        </p>
                      </div>

                      <Link
                        to={`/kantin/${canteen.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#CC0000] px-4 py-3 text-xs font-bold !text-white transition hover:bg-red-800"
                      >
                        Lihat Menu
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* EMPTY STATE */}
            {filteredCanteens.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <Utensils className="mx-auto text-slate-300" size={40} />

                <h3 className="mt-4 font-bold text-slate-800">
                  Kantin tidak ditemukan
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Coba gunakan kata kunci pencarian yang berbeda.
                </p>

                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="mt-4 font-semibold text-[#CC0000]"
                >
                  Reset Pencarian
                </button>
              </div>
            )}
          </>
        )}

        {/* BOTTOM INFORMATION */}
        <section className="mt-12 rounded-2xl bg-[#CC0000] p-7 text-white md:p-9">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-extrabold text-white">
                Sudah menemukan kantin favoritmu?
              </h2>

              <p className="mt-2 text-sm leading-6 text-red-100">
                Pilih menu favorit dan pesan sekarang melalui KantinKita.
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex w-fit items-center gap-2 rounded-xl !bg-white px-5 py-3 text-sm font-bold !text-[#CC0000] transition hover:!bg-red-50"
              style={{
                color: '#CC0000',
                backgroundColor: '#FFFFFF',
              }}
            >
              <span style={{ color: '#CC0000' }}>
                Kembali ke Beranda
              </span>

              <ChevronRight size={17} color="#CC0000" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}