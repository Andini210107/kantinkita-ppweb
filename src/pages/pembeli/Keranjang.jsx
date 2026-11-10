import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Utensils,
} from 'lucide-react'

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)
}

function getSavedCart() {
  try {
    const savedCart = JSON.parse(
      localStorage.getItem('kantinkita_cart') || '[]'
    )

    return Array.isArray(savedCart) ? savedCart : []
  } catch {
    return []
  }
}

export default function Keranjang() {
  const [cart, setCart] = useState(getSavedCart)

  useEffect(() => {
    localStorage.setItem('kantinkita_cart', JSON.stringify(cart))
  }, [cart])

  function increaseQuantity(id) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  function decreaseQuantity(id) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  function removeItem(id) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    )
  }

  function clearCart() {
    setCart([])
  }

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const deliveryFee = cart.length > 0 ? 0 : 0
  const totalPayment = subtotal + deliveryFee

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#F8FAFC] px-5 py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
            <ShoppingCart size={42} className="text-[#CC0000]" />
          </div>

          <h1 className="mt-7 text-2xl font-extrabold text-slate-900">
            Keranjangmu Masih Kosong
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
            Sepertinya kamu belum memilih menu apa pun.
            Yuk, cari makanan dan minuman favoritmu!
          </p>

          <Link
            to="/kantin"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#CC0000] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-red-800"
          >
            <Utensils size={18} />
            Jelajahi Kantin
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">

        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wider text-[#CC0000]">
            Pesanan Saya
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Keranjang Belanja
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Periksa kembali menu pilihanmu sebelum checkout.
          </p>
        </div>

        {/* CART CONTENT */}
        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-3">

          {/* LIST MENU */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Menu Pilihan
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {totalItems} item dalam keranjang
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearCart}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition hover:text-red-800"
                >
                  <Trash2 size={16} />
                  Kosongkan Keranjang
                </button>
              </div>

              <div className="space-y-5">
                {cart.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col gap-4 border-b border-slate-100 pb-5 last:border-0 last:pb-0 sm:flex-row"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-28 w-full rounded-xl object-cover sm:h-28 sm:w-32"
                    />

                    <div className="flex flex-1 flex-col justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-[#CC0000]">
                          {item.category}
                        </span>

                        <h3 className="mt-1 font-extrabold text-slate-900">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {item.canteen}
                        </p>

                        <p className="mt-2 font-bold text-[#CC0000]">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.id)}
                            aria-label={`Kurangi jumlah ${item.name}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-[#CC0000] hover:text-[#CC0000]"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="min-w-5 text-center text-sm font-bold text-slate-800">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => increaseQuantity(item.id)}
                            aria-label={`Tambah jumlah ${item.name}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#CC0000] text-white transition hover:bg-red-800"
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <p className="text-sm font-extrabold text-slate-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Hapus ${item.name} dari keranjang`}
                            className="text-slate-400 transition hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <Link
              to="/kantin"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#CC0000] transition hover:text-red-800"
            >
              <ShoppingBag size={17} />
              Tambah Menu Lain
            </Link>
          </section>

          {/* ORDER SUMMARY */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900">
              Ringkasan Pesanan
            </h2>

            <div className="mt-6 space-y-4 border-b border-slate-100 pb-5 text-sm">
              <div className="flex justify-between gap-3 text-slate-500">
                <span>Total Item</span>
                <span className="font-semibold text-slate-800">
                  {totalItems} item
                </span>
              </div>

              <div className="flex justify-between gap-3 text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between gap-3 text-slate-500">
                <span>Biaya tambahan</span>
                <span className="font-semibold text-green-600">
                  Gratis
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="font-bold text-slate-800">
                Total Pembayaran
              </span>

              <span className="text-lg font-extrabold text-[#CC0000]">
                {formatPrice(totalPayment)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#CC0000] px-5 py-4 text-sm font-bold text-white transition hover:bg-red-800"
            >
              Lanjut ke Checkout
              <ArrowRight size={18} />
            </Link>

            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
              Pastikan pilihan menu dan jumlah pesananmu sudah benar.
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}