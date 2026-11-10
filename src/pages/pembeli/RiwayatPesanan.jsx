import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Package, Clock, CheckCircle2, XCircle } from 'lucide-react'

const readStorage = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

export default function RiwayatPesanan() {
  const [orders, setOrders] = useState([])
  const [reviews, setReviews] = useState([])
  const [ratings, setRatings] = useState({})
  const [comments, setComments] = useState({})
  const [message, setMessage] = useState('')

  const user = readStorage('kantinkita_user', {})

  const loadData = () => {
    const savedOrders = readStorage('kantinkita_orders', [])
    const savedReviews = readStorage('kantinkita_reviews', [])
    setOrders(Array.isArray(savedOrders) ? savedOrders : [])
    setReviews(Array.isArray(savedReviews) ? savedReviews : [])
  }

  useEffect(() => {
    loadData()
    window.addEventListener('storage', loadData)
    window.addEventListener('kantinkita-orders-changed', loadData)
    window.addEventListener('kantinkita-reviews-changed', loadData)

    return () => {
      window.removeEventListener('storage', loadData)
      window.removeEventListener('kantinkita-orders-changed', loadData)
      window.removeEventListener('kantinkita-reviews-changed', loadData)
    }
  }, [])

  const myOrders = orders.filter((order) => {
    const orderEmail = order.email || order.customerEmail
    const orderUserId = order.userId || order.customerId

    if (user.email && orderEmail) {
      return String(orderEmail).toLowerCase() === String(user.email).toLowerCase()
    }

    if (user.id && orderUserId) {
      return String(orderUserId) === String(user.id)
    }

    // Jika data pesanan lama belum menyimpan identitas pembeli,
    // tetap tampilkan agar riwayat lama tidak hilang.
    return true
  })

  const getReview = (order) =>
    reviews.find((review) => String(review.orderId) === String(order.id))

  const submitReview = (order) => {
    const rating = Number(ratings[order.id] || 0)
    const comment = (comments[order.id] || '').trim()

    if (rating < 1 || rating > 5) {
      setMessage('Pilih rating bintang terlebih dahulu.')
      return
    }

    const currentReviews = readStorage('kantinkita_reviews', [])
    if (currentReviews.some((review) => String(review.orderId) === String(order.id))) {
      setMessage('Pesanan ini sudah pernah diberi ulasan.')
      loadData()
      return
    }

    const seller = readStorage('kantinkita_seller_canteen', {})
    const firstItem = order.items?.[0] || order.menuItems?.[0] || {}

    const review = {
      id: `REVIEW-${Date.now()}`,
      orderId: order.id,
      canteenId:
        order.canteenId ||
        order.sellerCanteenId ||
        firstItem.canteenId ||
        '',
      canteenName:
        order.canteenName ||
        order.canteen ||
        firstItem.canteenName ||
        firstItem.canteen ||
        seller.canteenName ||
        'Kantin',
      studentName:
        user.name ||
        user.fullName ||
        order.name ||
        order.customerName ||
        'Mahasiswa',
      studentEmail: user.email || '',
      rating,
      comment,
      createdAt: new Date().toISOString(),
    }

    const updated = [...currentReviews, review]
    localStorage.setItem('kantinkita_reviews', JSON.stringify(updated))
    window.dispatchEvent(new Event('kantinkita-reviews-changed'))

    setMessage('Terima kasih! Ulasan berhasil dikirim.')
    loadData()
  }

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString('id-ID')

  const formatDate = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    return Number.isNaN(date.getTime())
      ? '-'
      : date.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
  }

  const statusStyle = (status) => {
    if (status === 'Selesai') return 'bg-green-50 text-green-700'
    if (status === 'Dibatalkan') return 'bg-red-50 text-red-700'
    if (status === 'Siap Diambil') return 'bg-blue-50 text-blue-700'
    return 'bg-yellow-50 text-yellow-700'
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold text-[#CC0000]">Aktivitas</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Pesanan Saya</h1>
        <p className="mt-2 text-sm text-gray-500">
          Pantau pesanan dan berikan penilaian untuk pesanan yang sudah selesai.
        </p>
      </div>

      {message && (
        <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-[#CC0000]">
          {message}
        </div>
      )}

      {myOrders.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white px-5 py-16 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-300" />
          <h2 className="mt-4 font-semibold text-gray-800">Belum ada pesanan</h2>
          <p className="mt-1 text-sm text-gray-500">
            Pesanan yang kamu buat akan muncul di sini.
          </p>
          <Link
            to="/kantin"
            className="mt-5 inline-flex rounded-xl bg-[#CC0000] px-5 py-3 text-sm font-semibold text-white"
          >
            Jelajahi Kantin
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {myOrders.slice().reverse().map((order) => {
            const status = order.status || 'Menunggu Konfirmasi'
            const items = order.items || order.menuItems || []
            const existingReview = getReview(order)
            const isCompleted = status.toLowerCase() === 'selesai'

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {order.canteenName || order.canteen || 'Pesanan Kantin'}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      #{order.id} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle(status)}`}>
                    {status}
                  </span>
                </div>

                <div className="space-y-3 px-5 py-4">
                  {items.map((item, index) => (
                    <div key={item.id || index} className="flex justify-between gap-3 text-sm">
                      <span className="text-gray-600">
                        {item.name || item.menuName || 'Menu'} × {item.quantity || item.qty || 1}
                      </span>
                      <span className="font-medium text-gray-800">
                        Rp{formatPrice((item.price || 0) * (item.quantity || item.qty || 1))}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4">
                  <div>
                    <p className="text-xs text-gray-500">Total Pembayaran</p>
                    <p className="mt-1 font-bold text-[#CC0000]">
                      Rp{formatPrice(order.totalPayment || order.total || order.totalPrice)}
                    </p>
                  </div>
                  <Link
                    to={`/pesanan/${order.id}`}
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Lihat Detail
                  </Link>
                </div>

                {isCompleted && (
                  <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-5">
                    {existingReview ? (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                          <CheckCircle2 className="h-4 w-4" />
                          Kamu sudah memberikan ulasan
                        </div>
                        <div className="mt-2 flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= existingReview.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        {existingReview.comment && (
                          <p className="mt-2 text-sm text-gray-600">
                            “{existingReview.comment}”
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Bagaimana pengalamanmu?
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Berikan rating dan komentar untuk kantin ini.
                        </p>

                        <div className="mt-3 flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setRatings((old) => ({ ...old, [order.id]: star }))
                              }
                              aria-label={`${star} bintang`}
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  star <= (ratings[order.id] || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>

                        <textarea
                          value={comments[order.id] || ''}
                          onChange={(event) =>
                            setComments((old) => ({
                              ...old,
                              [order.id]: event.target.value,
                            }))
                          }
                          rows={3}
                          placeholder="Ceritakan pengalamanmu (opsional)..."
                          className="mt-3 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-[#CC0000]"
                        />

                        <button
                          type="button"
                          onClick={() => submitReview(order)}
                          className="mt-3 rounded-xl bg-[#CC0000] px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
                        >
                          Kirim Ulasan
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}