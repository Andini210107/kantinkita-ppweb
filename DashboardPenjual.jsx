import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  Utensils,
  ArrowRight,
  RefreshCw,
} from 'lucide-react'

const ORDER_KEY = 'kantinkita_orders'
const STATUS_OPTIONS = [
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

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

function getOrderTotal(order) {
  if (order.totalPayment != null) return Number(order.totalPayment)
  if (order.total != null) return Number(order.total)

  return (order.items || []).reduce((sum, item) => {
    return sum + (Number(item.price) || 0) * (Number(item.quantity) || 1)
  }, 0)
}

function getOrderItems(order) {
  if (Array.isArray(order.items)) return order.items
  if (Array.isArray(order.menuItems)) return order.menuItems
  return []
}

export default function DashboardPenjual() {
  const [orders, setOrders] = useState([])
  const [menus, setMenus] = useState([])
  const [canteen, setCanteen] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)

    try {
      const [canteenResponse, menuResponse] = await Promise.all([
        fetch('/data/canteens.json'),
        fetch('/data/menus.json'),
      ])

      if (!canteenResponse.ok || !menuResponse.ok) {
        throw new Error('Data gagal dimuat')
      }

      const canteenData = await canteenResponse.json()
      const menuData = await menuResponse.json()

      const canteenList = Array.isArray(canteenData)
        ? canteenData
        : canteenData.canteens || []

      const menuList = Array.isArray(menuData)
        ? menuData
        : menuData.menus || []

      const selectedId = localStorage.getItem('kantinkita_seller_canteen')
      const selectedCanteen = canteenList.find(
        (item) => String(item.id) === String(selectedId)
      ) || canteenList[0] || null

      const savedMenus = JSON.parse(
        localStorage.getItem('kantinkita_seller_menus') || 'null'
      )

      setCanteen(selectedCanteen)
      setMenus(Array.isArray(savedMenus) ? savedMenus : menuList)
      setOrders(readOrders())
    } catch (error) {
      console.error(error)
      setOrders(readOrders())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()

    const handleStorage = () => loadData()
    window.addEventListener('storage', handleStorage)
    window.addEventListener('kantinkita-canteen-changed', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('kantinkita-canteen-changed', handleStorage)
    }
  }, [])

  const stats = useMemo(() => {
    const waiting = orders.filter((order) =>
      ['Menunggu Konfirmasi', 'Menunggu konfirmasi', 'Pending'].includes(
        order.status
      )
    ).length

    const processing = orders.filter((order) =>
      ['Diproses', 'Siap Diambil'].includes(order.status)
    ).length

    const completed = orders.filter(
      (order) => order.status === 'Selesai'
    ).length

    const revenue = orders
      .filter((order) => order.status === 'Selesai')
      .reduce((sum, order) => sum + getOrderTotal(order), 0)

    return {
      total: orders.length,
      waiting,
      processing,
      completed,
      revenue,
    }
  }, [orders])

  const updateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      String(order.id) === String(orderId)
        ? { ...order, status: newStatus }
        : order
    )

    setOrders(updatedOrders)
    localStorage.setItem(ORDER_KEY, JSON.stringify(updatedOrders))
  }

  const statCards = [
    {
      label: 'Total Pesanan',
      value: stats.total,
      icon: ClipboardList,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Menunggu Konfirmasi',
      value: stats.waiting,
      icon: Clock3,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Sedang Diproses',
      value: stats.processing,
      icon: Utensils,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Pesanan Selesai',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'bg-green-50 text-green-600',
    },
  ]

  if (loading) {
    return <p className="py-20 text-center text-gray-500">Memuat dashboard...</p>
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-[#CC0000]">
            PANEL PENJUAL
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Selamat datang! Pantau aktivitas kantin kamu di sini.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Muat Ulang
        </button>
      </div>

      <section className="rounded-2xl bg-[#CC0000] p-6 text-white sm:p-8">
        <p className="text-sm font-medium text-red-100">
          Kantin yang sedang dikelola
        </p>
        <h2 className="mt-2 text-2xl font-extrabold">
          {canteen?.name || 'KantinKita'}
        </h2>
        <p className="mt-2 text-sm text-red-100">
          {canteen?.location || 'Kelola aktivitas kantin kamu melalui dashboard ini.'}
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-extrabold text-gray-900">
                    {card.value}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${card.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          )
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Pendapatan dari pesanan selesai</p>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            {formatRupiah(stats.revenue)}
          </h2>
          <p className="mt-2 text-xs text-gray-400">
            Dihitung dari pesanan dengan status Selesai.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Menu terdaftar</p>
              <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
                {menus.length}
              </h2>
            </div>
            <div className="rounded-xl bg-red-50 p-3 text-[#CC0000]">
              <Utensils size={23} />
            </div>
          </div>
          <Link
            to="/penjual/kelola-menu"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#CC0000] hover:underline"
          >
            Kelola menu
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              Pesanan Terbaru
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Pantau pesanan yang masuk dari mahasiswa.
            </p>
          </div>
          <Link
            to="/penjual/pesanan"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#CC0000] hover:underline"
          >
            Lihat semua
            <ArrowRight size={16} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardList
              size={38}
              className="mx-auto text-gray-300"
            />
            <p className="mt-3 font-semibold text-gray-700">
              Belum ada pesanan masuk
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Pesanan mahasiswa akan muncul di sini setelah checkout.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {[...orders].reverse().slice(0, 5).map((order, index) => {
              const items = getOrderItems(order)
              const orderId = order.id || `Pesanan-${index + 1}`

              return (
                <div
                  key={orderId}
                  className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900">
                      {orderId}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {order.name || order.customerName || 'Mahasiswa'}
                      {' · '}
                      {items.length} item
                    </p>
                    <p className="mt-1 text-sm font-bold text-gray-800">
                      {formatRupiah(getOrderTotal(order))}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={STATUS_OPTIONS.includes(order.status) ? order.status : 'Menunggu Konfirmasi'}
                      onChange={(event) =>
                        updateStatus(orderId, event.target.value)
                      }
                      className="max-w-[190px] rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-[#CC0000]"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}