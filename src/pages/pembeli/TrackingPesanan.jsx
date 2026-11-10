import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Package,
  ShoppingBag,
  XCircle,
  RefreshCw,
  ClipboardList,
  MapPin,
} from 'lucide-react'

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(price) || 0)
}

function formatDate(date) {
  if (!date) return '-'

  return new Date(date).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const steps = [
  {
    title: 'Menunggu Konfirmasi',
    description: 'Pesanan berhasil dibuat dan menunggu konfirmasi penjual.',
    icon: Clock,
  },
  {
    title: 'Sedang Diproses',
    description: 'Penjual sedang menyiapkan pesananmu.',
    icon: Package,
  },
  {
    title: 'Siap Diambil',
    description: 'Pesanan sudah siap dan bisa diambil di kantin.',
    icon: ShoppingBag,
  },
  {
    title: 'Selesai',
    description: 'Pesanan telah selesai. Selamat menikmati!',
    icon: CheckCircle2,
  },
]

const statusOrder = steps.map((step) => step.title)

export default function PelacakanPesanan() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  function loadOrder() {
    setLoading(true)

    try {
      const savedOrders = JSON.parse(
        localStorage.getItem('kantinkita_orders') || '[]'
      )

      const orders = Array.isArray(savedOrders) ? savedOrders : []

      const selectedOrder = orders.find(
        (item) => item.id === id
      )

      if (selectedOrder) {
        setOrder(selectedOrder)
        setNotFound(false)
      } else {
        setOrder(null)
        setNotFound(true)
      }
    } catch {
      setOrder(null)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrder()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            className="mx-auto animate-spin text-[#CC0000]"
            size={32}
          />
          <p className="mt-3 text-sm text-slate-500">
            Memuat informasi pesanan...
          </p>
        </div>
      </div>
    )
  }

  if (notFound || !order) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[#F8FAFC] px-5">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <ClipboardList size={36} className="text-[#CC0000]" />
          </div>

          <h1 className="mt-5 text-xl font-extrabold text-slate-900">
            Pesanan Tidak Ditemukan
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Nomor pesanan tidak ditemukan. Periksa kembali riwayat pesananmu.
          </p>

          <Link
            to="/riwayat-pesanan"
            className="mt-6 inline-flex rounded-xl bg-[#CC0000] px-6 py-3 text-sm font-bold text-white hover:bg-red-800"
          >
            Kembali ke Riwayat
          </Link>
        </div>
      </main>
    )
  }

  const currentStatusIndex = statusOrder.indexOf(order.status)
  const isCancelled = order.status === 'Dibatalkan'
  const isValidStatus = currentStatusIndex !== -1

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">

        {/* HEADER */}
        <Link
          to="/riwayat-pesanan"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#CC0000]"
        >
          <ArrowLeft size={18} />
          Kembali ke Riwayat Pesanan
        </Link>

        <div className="mb-8 mt-6">
          <p className="text-sm font-bold uppercase tracking-wider text-[#CC0000]">
            Status Pemesanan
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Lacak Pesanan
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Pantau perkembangan pesananmu melalui KantinKita.
          </p>
        </div>

        {/* ORDER ID */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold text-slate-400">
                NOMOR PESANAN
              </p>

              <h2 className="mt-2 text-xl font-extrabold text-slate-900">
                {order.id}
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Dibuat pada {formatDate(order.createdAt)}
              </p>
            </div>

            <button
              type="button"
              onClick={loadOrder}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-[#CC0000] hover:text-[#CC0000]"
            >
              <RefreshCw size={16} />
              Perbarui Status
            </button>
          </div>
        </section>

        {/* TRACKING STATUS */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-extrabold text-slate-900">
            Perjalanan Pesanan
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Berikut perkembangan pesananmu saat ini.
          </p>

          {isCancelled ? (
            <div className="mt-7 rounded-2xl border border-red-100 bg-red-50 p-6">
              <div className="flex items-center gap-3">
                <XCircle size={30} className="text-red-600" />

                <div>
                  <h3 className="font-extrabold text-red-700">
                    Pesanan Dibatalkan
                  </h3>

                  <p className="mt-1 text-sm text-red-600">
                    Pesanan ini telah dibatalkan dan tidak akan diproses lebih lanjut.
                  </p>
                </div>
              </div>
            </div>
          ) : isValidStatus ? (
            <div className="mt-8">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = index <= currentStatusIndex
                const isCurrent = index === currentStatusIndex

                return (
                  <div key={step.title} className="relative flex gap-4 pb-9 last:pb-0">
                    {index !== steps.length - 1 && (
                      <div
                        className={`absolute left-[19px] top-10 h-full w-0.5 ${
                          index < currentStatusIndex
                            ? 'bg-green-500'
                            : 'bg-slate-200'
                        }`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        isCompleted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <Icon size={20} />
                    </div>

                    <div className="pt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-sm font-extrabold ${
                            isCurrent
                              ? 'text-[#CC0000]'
                              : isCompleted
                                ? 'text-slate-800'
                                : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </h3>

                        {isCurrent && (
                          <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-[#CC0000]">
                            Status Saat Ini
                          </span>
                        )}

                        {isCompleted && !isCurrent && (
                          <span className="text-[10px] font-bold text-green-600">
                            Selesai
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
              Status pesanan belum dikenali: {order.status}
            </div>
          )}
        </section>

        {/* ORDER DETAILS */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-extrabold text-slate-900">
            Detail Pesanan
          </h2>

          <div className="space-y-4">
            {(order.items || []).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-50">
                      <ShoppingBag className="text-[#CC0000]" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                </div>

                <p className="shrink-0 text-sm font-bold text-slate-800">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Nama pemesan</span>
              <span className="font-semibold text-slate-800">
                {order.customerName}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Nomor HP</span>
              <span className="font-semibold text-slate-800">
                {order.phone}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Pembayaran</span>
              <span className="text-right font-semibold text-slate-800">
                {order.paymentMethod}
              </span>
            </div>

            {order.note && (
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Catatan</span>
                <span className="max-w-[60%] text-right font-semibold text-slate-800">
                  {order.note}
                </span>
              </div>
            )}

            <div className="flex justify-between border-t border-slate-100 pt-4">
              <span className="font-bold text-slate-800">
                Total Pembayaran
              </span>
              <span className="text-lg font-extrabold text-[#CC0000]">
                {formatPrice(order.totalPayment)}
              </span>
            </div>
          </div>
        </section>

        <div className="mt-6 flex items-start gap-3 rounded-xl bg-red-50 p-4">
          <MapPin size={20} className="mt-0.5 shrink-0 text-[#CC0000]" />

          <p className="text-xs leading-5 text-slate-600">
            Pastikan kamu mengambil pesanan di kantin tempat menu dipesan setelah status berubah menjadi Siap Diambil.
          </p>
        </div>
      </div>
    </main>
  )
}