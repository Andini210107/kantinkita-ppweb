import { useEffect, useMemo, useState } from 'react'
import {
  ClipboardList,
  Search,
  RefreshCw,
  Clock3,
  ChevronDown,
  PackageCheck,
} from 'lucide-react'

const ORDER_KEY = 'kantinkita_orders'

const STATUSES = [
  'Menunggu Konfirmasi',
  'Diproses',
  'Siap Diambil',
  'Selesai',
  'Dibatalkan',
]

function readOrders() {
  try {
    const data = JSON.parse(localStorage.getItem(ORDER_KEY) || '[]')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function rupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

function getItems(order) {
  if (Array.isArray(order.items)) return order.items
  if (Array.isArray(order.menuItems)) return order.menuItems
  return []
}

function getTotal(order) {
  if (order.totalPayment != null) return Number(order.totalPayment)
  if (order.total != null) return Number(order.total)

  return getItems(order).reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  )
}

function statusStyle(status) {
  if (status === 'Selesai') return 'bg-green-50 text-green-700'
  if (status === 'Dibatalkan') return 'bg-red-50 text-red-700'
  if (status === 'Diproses') return 'bg-blue-50 text-blue-700'
  if (status === 'Siap Diambil') return 'bg-purple-50 text-purple-700'
  return 'bg-amber-50 text-amber-700'
}

function formatDate(value) {
  if (!value) return 'Waktu tidak tersedia'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return date.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function PesananMasuk() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Semua')
  const [expandedOrder, setExpandedOrder] = useState(null)

  const loadOrders = () => {
    setOrders(readOrders())
  }

  useEffect(() => {
    loadOrders()

    const handleStorage = () => loadOrders()
    window.addEventListener('storage', handleStorage)

    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const filteredOrders = useMemo(() => {
    return [...orders]
      .reverse()
      .filter((order) => {
        const id = String(order.id || '')
        const customer = String(
          order.name || order.customerName || order.customer || ''
        )

        const matchesSearch =
          id.toLowerCase().includes(search.toLowerCase()) ||
          customer.toLowerCase().includes(search.toLowerCase())

        const matchesStatus =
          filter === 'Semua' || order.status === filter

        return matchesSearch && matchesStatus
      })
  }, [orders, search, filter])

  const updateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      String(order.id) === String(orderId)
        ? { ...order, status: newStatus }
        : order
    )

    setOrders(updatedOrders)
    localStorage.setItem(ORDER_KEY, JSON.stringify(updatedOrders))
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-[#CC0000]">
            MANAJEMEN TRANSAKSI
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
            Pesanan Masuk
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Lihat detail pesanan dan perbarui proses pemesanan mahasiswa.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Muat Ulang
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Semua Pesanan</p>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">
            {orders.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Menunggu Konfirmasi</p>
          <p className="mt-2 text-3xl font-extrabold text-amber-600">
            {orders.filter((order) =>
              ['Menunggu Konfirmasi', 'Menunggu konfirmasi', 'Pending'].includes(
                order.status
              )
            ).length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Selesai</p>
          <p className="mt-2 text-3xl font-extrabold text-green-600">
            {orders.filter((order) => order.status === 'Selesai').length}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nomor pesanan atau nama mahasiswa..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#CC0000]"
          />
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#CC0000]"
        >
          <option value="Semua">Semua Status</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </section>

      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center">
          <ClipboardList size={42} className="mx-auto text-gray-300" />
          <h2 className="mt-4 font-bold text-gray-800">
            Belum ada pesanan
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Pesanan yang masuk akan ditampilkan di halaman ini.
          </p>
        </div>
      ) : (
        <section className="space-y-4">
          {filteredOrders.map((order, index) => {
            const orderId = order.id || `order-${index}`
            const items = getItems(order)
            const isExpanded = expandedOrder === orderId

            return (
              <article
                key={orderId}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-extrabold text-gray-900">
                        {orderId}
                      </h2>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(order.status)}`}
                      >
                        {order.status || 'Menunggu Konfirmasi'}
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-gray-700">
                      {order.name || order.customerName || order.customer || 'Mahasiswa'}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      <Clock3 size={14} />
                      {formatDate(order.createdAt || order.date)}
                    </p>
                    <p className="mt-2 text-sm font-bold text-gray-900">
                      {rupiah(getTotal(order))}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:w-56">
                    <label className="text-xs font-semibold text-gray-500">
                      Ubah Status Pesanan
                    </label>
                    <div className="relative">
                      <select
                        value={
                          STATUSES.includes(order.status)
                            ? order.status
                            : 'Menunggu Konfirmasi'
                        }
                        onChange={(event) =>
                          updateStatus(orderId, event.target.value)
                        }
                        className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-3 pr-9 text-sm font-semibold text-gray-700 outline-none focus:border-[#CC0000]"
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedOrder(isExpanded ? null : orderId)
                      }
                      className="rounded-xl bg-gray-50 px-3 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100"
                    >
                      {isExpanded ? 'Tutup Detail' : 'Lihat Detail'}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/70 p-5 sm:p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-gray-800">
                      <PackageCheck size={17} />
                      Rincian Pesanan
                    </h3>

                    {items.length > 0 ? (
                      <div className="space-y-3">
                        {items.map((item, itemIndex) => (
                          <div
                            key={item.id || itemIndex}
                            className="flex items-center justify-between gap-4 rounded-xl bg-white p-3"
                          >
                            <div>
                              <p className="text-sm font-bold text-gray-800">
                                {item.name || item.menuName || 'Menu'}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {item.quantity || 1} × {rupiah(item.price)}
                              </p>
                            </div>
                            <p className="shrink-0 text-sm font-bold text-gray-800">
                              {rupiah(
                                (Number(item.price) || 0) *
                                  (Number(item.quantity) || 1)
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Rincian item tidak tersedia pada data pesanan ini.
                      </p>
                    )}

                    <div className="mt-4 grid gap-3 rounded-xl bg-white p-4 text-sm sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-gray-400">Nomor HP</p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {order.phone || order.customerPhone || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Metode Pembayaran</p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {order.paymentMethod || order.payment || '-'}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs text-gray-400">Catatan</p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {order.note || order.notes || 'Tidak ada catatan'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </section>
      )}
    </div>
  )
}