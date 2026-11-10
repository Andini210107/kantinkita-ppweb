import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  ShoppingBag,
  User,
  Phone,
  MessageSquare,
} from 'lucide-react'

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)
}

function readCart() {
  try {
    const data = JSON.parse(
      localStorage.getItem('kantinkita_cart') || '[]'
    )

    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export default function Checkout() {
  const navigate = useNavigate()
  const [cart] = useState(readCart)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    paymentMethod: 'Tunai - Bayar di Kantin',
    note: '',
  })

  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successOrder, setSuccessOrder] = useState(null)

  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  )

  const totalItems = cart.reduce(
    (total, item) => total + Number(item.quantity),
    0
  )

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (cart.length === 0) {
      setError('Keranjang masih kosong. Silakan pilih menu terlebih dahulu.')
      return
    }

    if (!form.name.trim()) {
      setError('Nama mahasiswa wajib diisi.')
      return
    }

    if (!/^[0-9+\-\s]{10,15}$/.test(form.phone.trim())) {
      setError('Masukkan nomor HP yang valid (10–15 digit).')
      return
    }

    setIsSubmitting(true)

    try {
      const savedOrders = JSON.parse(
        localStorage.getItem('kantinkita_orders') || '[]'
      )

      const orderId = `KK-${Date.now()}`

      const newOrder = {
        id: orderId,
        customerName: form.name.trim(),
        phone: form.phone.trim(),
        paymentMethod: form.paymentMethod,
        note: form.note.trim(),
        items: cart,
        totalItems,
        subtotal,
        totalPayment: subtotal,
        status: 'Menunggu Konfirmasi',
        createdAt: new Date().toISOString(),
      }

      const orders = Array.isArray(savedOrders)
        ? savedOrders
        : []

      orders.unshift(newOrder)

      localStorage.setItem(
        'kantinkita_orders',
        JSON.stringify(orders)
      )

      localStorage.removeItem('kantinkita_cart')

      setSuccessOrder(newOrder)
    } catch {
      setError('Pesanan gagal disimpan. Silakan coba kembali.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cart.length === 0 && !successOrder) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center bg-[#F8FAFC] px-5 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <ShoppingBag size={36} className="text-[#CC0000]" />
        </div>

        <h1 className="mt-6 text-2xl font-extrabold text-slate-900">
          Keranjang Masih Kosong
        </h1>

        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Tambahkan menu terlebih dahulu sebelum melanjutkan checkout.
        </p>

        <Link
          to="/kantin"
          className="mt-6 rounded-xl bg-[#CC0000] px-6 py-3 text-sm font-bold text-white hover:bg-red-800"
        >
          Jelajahi Kantin
        </Link>
      </div>
    )
  }

  if (successOrder) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F8FAFC] px-5 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 size={42} className="text-green-600" />
          </div>

          <h1 className="mt-6 text-2xl font-extrabold text-slate-900">
            Pesanan Berhasil Dibuat!
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Pesananmu berhasil disimpan. Silakan tunggu konfirmasi dari penjual.
          </p>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">
              Nomor Pesanan
            </p>
            <p className="mt-1 text-lg font-extrabold text-[#CC0000]">
              {successOrder.id}
            </p>

            <div className="mt-4 flex justify-between text-sm">
              <span className="text-slate-500">Total pembayaran</span>
              <strong className="text-slate-900">
                {formatPrice(successOrder.totalPayment)}
              </strong>
            </div>

            <div className="mt-2 flex justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <strong className="text-amber-600">
                {successOrder.status}
              </strong>
            </div>
          </div>

          <Link
            to="/riwayat-pesanan"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#CC0000] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-800"
          >
            Lihat Riwayat Pesanan
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/"
            className="mt-4 inline-block text-sm font-semibold text-slate-500 hover:text-[#CC0000]"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">

        {/* HEADER */}
        <Link
          to="/keranjang"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#CC0000]"
        >
          <ArrowLeft size={18} />
          Kembali ke Keranjang
        </Link>

        <div className="mb-8 mt-6">
          <p className="text-sm font-bold uppercase tracking-wider text-[#CC0000]">
            Selesaikan Pesanan
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Lengkapi informasi berikut untuk menyelesaikan pesananmu.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-3">

            {/* FORM DATA */}
            <div className="space-y-6 lg:col-span-2">

              {/* CUSTOMER */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#CC0000]">
                    <User size={21} />
                  </div>

                  <div>
                    <h2 className="font-extrabold text-slate-900">
                      Informasi Pemesan
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Isi data diri untuk keperluan pesanan.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="customer-name"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Nama Mahasiswa
                    </label>

                    <input
                      id="customer-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap"
                      required
                      maxLength={80}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-red-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="customer-phone"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Nomor HP / WhatsApp
                    </label>

                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-[#CC0000] focus-within:ring-2 focus-within:ring-red-100">
                      <Phone size={18} className="text-slate-400" />

                      <input
                        id="customer-phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Contoh: 081234567890"
                        required
                        maxLength={15}
                        className="w-full py-3 text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* PAYMENT */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#CC0000]">
                    <CreditCard size={21} />
                  </div>

                  <div>
                    <h2 className="font-extrabold text-slate-900">
                      Metode Pembayaran
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Pilih metode pembayaran pesanan.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    'Tunai - Bayar di Kantin',
                    'QRIS',
                  ].map((method) => (
                    <label
                      key={method}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                        form.paymentMethod === method
                          ? 'border-[#CC0000] bg-red-50'
                          : 'border-slate-200 hover:border-red-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={form.paymentMethod === method}
                        onChange={handleChange}
                        className="accent-[#CC0000]"
                      />

                      <span className="text-sm font-semibold text-slate-700">
                        {method}
                      </span>
                    </label>
                  ))}
                </div>

                <p className="mt-4 text-xs leading-5 text-slate-400">
                    Pilih tunai untuk membayar langsung di kantin atau QRIS untuk pembayaran menggunakan kode QR.
                    Pembayaran QRIS pada aplikasi ini masih berupa simulasi.
                </p>
              </section>

              {/* NOTE */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#CC0000]">
                    <MessageSquare size={21} />
                  </div>

                  <div>
                    <h2 className="font-extrabold text-slate-900">
                      Catatan untuk Penjual
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Tambahkan permintaan khusus jika ada.
                    </p>
                  </div>
                </div>

                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  rows={4}
                  maxLength={300}
                  placeholder="Contoh: Tidak pakai sambal, saus dipisah..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#CC0000] focus:ring-2 focus:ring-red-100"
                />

                <p className="mt-2 text-right text-xs text-slate-400">
                  {form.note.length}/300 karakter
                </p>
              </section>
            </div>

            {/* ORDER SUMMARY */}
            <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <ClipboardList size={21} className="text-[#CC0000]" />
                <h2 className="text-lg font-extrabold text-slate-900">
                  Ringkasan Pesanan
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                {totalItems} item dipilih
              </p>

              <div className="mt-5 max-h-72 space-y-4 overflow-y-auto border-b border-slate-100 pb-5">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-bold text-slate-800">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm text-slate-500">
                <span>Biaya tambahan</span>
                <span className="font-semibold text-green-600">
                  Gratis
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
                <span className="font-bold text-slate-800">
                  Total
                </span>
                <span className="text-lg font-extrabold text-[#CC0000]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {error && (
                <p
                  role="alert"
                  className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#CC0000] px-5 py-4 text-sm font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Memproses...' : 'Buat Pesanan'}
                {!isSubmitting && <ArrowRight size={18} />}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                Dengan membuat pesanan, kamu menyetujui detail pesanan yang telah diisi.
              </p>
            </aside>
          </div>
        </form>
      </div>
    </div>
  )
}