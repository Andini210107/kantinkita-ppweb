import { useEffect, useMemo, useState } from 'react'
import { Star, MessageSquare, Search, UserRound, CalendarDays } from 'lucide-react'

const readStorage = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

export default function UlasanPembeli() {
  const [reviews, setReviews] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Semua')

  const account = readStorage('kantinkita_user', {})
  const seller = readStorage('kantinkita_seller_canteen', {})
  const canteenId = seller.canteenId || account.canteenId || account.id
  const canteenName = seller.canteenName || account.canteenName || account.businessName || 'Kantin Saya'

  useEffect(() => {
    const load = () => {
      const data = readStorage('kantinkita_reviews', [])
      setReviews(Array.isArray(data) ? data : [])
    }
    load()
    window.addEventListener('storage', load)
    window.addEventListener('kantinkita-reviews-changed', load)
    return () => {
      window.removeEventListener('storage', load)
      window.removeEventListener('kantinkita-reviews-changed', load)
    }
  }, [])

  const myReviews = useMemo(() => reviews.filter((review) => {
    if (review.canteenId && canteenId) {
      return String(review.canteenId) === String(canteenId)
    }
    return String(review.canteenName || '').toLowerCase() === canteenName.toLowerCase()
  }), [reviews, canteenId, canteenName])

  const average = myReviews.length
    ? (myReviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / myReviews.length).toFixed(1)
    : '0.0'

  const filtered = myReviews.filter((review) => {
    const name = review.studentName || 'Mahasiswa'
    const comment = review.comment || ''
    const matchSearch = `${name} ${comment}`.toLowerCase().includes(search.toLowerCase())
    return matchSearch && (filter === 'Semua' || Number(review.rating) === Number(filter))
  })

  const dateText = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#CC0000]">Layanan Pelanggan</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Ulasan Pembeli</h1>
        <p className="mt-1 text-sm text-gray-500">Penilaian mahasiswa untuk {canteenName}.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Rating Rata-rata</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-4xl font-bold text-gray-900">{average}</span>
            <div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className={`h-4 w-4 ${n <= Math.round(Number(average)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-400">Dari {myReviews.length} ulasan</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Ulasan</p>
          <div className="mt-2 flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-[#CC0000]" />
            <span className="text-4xl font-bold text-gray-900">{myReviews.length}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau komentar..." className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#CC0000]" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#CC0000]">
            <option value="Semua">Semua Rating</option>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Bintang</option>)}
          </select>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Daftar Ulasan</h2>
          <span className="text-xs text-gray-400">{filtered.length} ulasan</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-14 text-center">
            <MessageSquare className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 font-semibold text-gray-700">Belum ada ulasan</p>
            <p className="mt-1 text-sm text-gray-400">Ulasan dari mahasiswa akan muncul di sini.</p>
          </div>
        ) : (
          <div className="mt-2 divide-y divide-gray-100">
            {filtered.slice().reverse().map((review, index) => (
              <div key={review.id || index} className="flex gap-3 py-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                  <UserRound className="h-5 w-5 text-[#CC0000]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{review.studentName || 'Mahasiswa'}</p>
                      <div className="mt-1 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} className={`h-3.5 w-3.5 ${n <= Number(review.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                        ))}
                        <span className="ml-1 text-xs text-gray-500">{review.rating}/5</span>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-gray-400"><CalendarDays className="h-3.5 w-3.5" />{dateText(review.createdAt)}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{review.comment || 'Tidak ada komentar.'}</p>
                  <p className="mt-2 text-xs text-gray-400">ID Pesanan: {review.orderId || '-'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}