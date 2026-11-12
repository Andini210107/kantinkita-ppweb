import { useMemo, useState } from 'react'
import { Wallet, TrendingUp, ShoppingBag, Download } from 'lucide-react'

const readStorage = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

export default function KeuanganPenjual() {
  const [notice, setNotice] = useState('')
  const account = readStorage('kantinkita_user', {})
  const seller = readStorage('kantinkita_seller_canteen', {})
  const canteenId = seller.canteenId || account.canteenId || account.id

  const orders = readStorage('kantinkita_orders', [])
  const myOrders = (Array.isArray(orders) ? orders : []).filter((order) => {
    const orderCanteenId = order.canteenId || order.sellerCanteenId
    return !orderCanteenId || !canteenId || String(orderCanteenId) === String(canteenId)
  })

  const completed = myOrders.filter((order) => order.status === 'Selesai')
  const revenue = completed.reduce((sum, order) => sum + Number(order.totalPayment || order.total || order.totalPrice || 0), 0)
  const pending = myOrders.filter((order) => !['Selesai', 'Dibatalkan'].includes(order.status)).reduce((sum, order) => sum + Number(order.totalPayment || order.total || 0), 0)

  const format = (value) => Number(value || 0).toLocaleString('id-ID')

  const requestPayout = () => {
    const payout = readStorage('kantinkita_payouts', [])
    const updated = [...payout, {
      id: `PAYOUT-${Date.now()}`,
      amount: revenue,
      status: 'Menunggu Diproses',
      createdAt: new Date().toISOString(),
      canteenId,
    }]
    localStorage.setItem('kantinkita_payouts', JSON.stringify(updated))
    setNotice('Permintaan pencairan simulasi berhasil dicatat.')
  }

  const exportData = () => {
    const rows = [
      ['ID Pesanan', 'Tanggal', 'Status', 'Total'],
      ...myOrders.map((order) => [
        order.id,
        order.createdAt || '',
        order.status || '',
        order.totalPayment || order.total || 0,
      ]),
    ]
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'laporan-keuangan-kantinkita.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#CC0000]">Laporan Penjualan</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Keuangan & Payout</h1>
          <p className="mt-1 text-sm text-gray-500">Ringkasan transaksi kantin kamu.</p>
        </div>
        <button onClick={exportData} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
          <Download className="h-4 w-4" /> Ekspor CSV
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex justify-between"><p className="text-sm text-gray-500">Total Pendapatan Selesai</p><TrendingUp className="h-5 w-5 text-green-600" /></div>
          <p className="mt-3 text-2xl font-bold text-gray-900">Rp{format(revenue)}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex justify-between"><p className="text-sm text-gray-500">Pesanan Selesai</p><ShoppingBag className="h-5 w-5 text-[#CC0000]" /></div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{completed.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex justify-between"><p className="text-sm text-gray-500">Nilai Pesanan Berjalan</p><Wallet className="h-5 w-5 text-yellow-600" /></div>
          <p className="mt-3 text-2xl font-bold text-gray-900">Rp{format(pending)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">Pencairan Dana</h2>
        <p className="mt-1 text-sm text-gray-500">Ajukan pencairan simulasi berdasarkan pendapatan dari pesanan selesai.</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-gray-50 p-4">
          <div>
            <p className="text-xs text-gray-500">Saldo simulasi tersedia</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">Rp{format(revenue)}</p>
          </div>
          <button onClick={requestPayout} disabled={revenue <= 0} className="rounded-xl bg-[#CC0000] px-5 py-3 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-gray-300">
            Ajukan Payout
          </button>
        </div>
        {notice && <p className="mt-3 text-sm text-green-700">{notice}</p>}
        <p className="mt-3 text-xs text-gray-400">Catatan: fitur payout ini hanya simulasi penyimpanan data pada browser.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5"><h2 className="font-semibold text-gray-900">Riwayat Transaksi</h2></div>
        {myOrders.length === 0 ? (
          <p className="p-10 text-center text-sm text-gray-400">Belum ada transaksi.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr><th className="px-5 py-3">ID Pesanan</th><th className="px-5 py-3">Tanggal</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Total</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myOrders.slice().reverse().map((order, index) => (
                  <tr key={order.id || index}>
                    <td className="px-5 py-4 font-medium text-gray-800">#{order.id}</td>
                    <td className="px-5 py-4 text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="px-5 py-4">{order.status || 'Menunggu Konfirmasi'}</td>
                    <td className="px-5 py-4 text-right font-semibold">Rp{format(order.totalPayment || order.total || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}