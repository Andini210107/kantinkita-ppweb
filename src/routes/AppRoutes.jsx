import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

// Halaman mahasiswa
import Beranda from '../pages/pembeli/Beranda'
import DaftarKantin from '../pages/pembeli/DaftarKantin'
import DetailKantin from '../pages/pembeli/DetailKantin'
import Keranjang from '../pages/pembeli/Keranjang'
import Checkout from '../pages/pembeli/Checkout'
import RiwayatPesanan from '../pages/pembeli/RiwayatPesanan'
import TrackingPesanan from '../pages/pembeli/TrackingPesanan'
import ProfilPengguna from '../pages/pembeli/ProfilPengguna'

// Halaman autentikasi
import Welcome from '../pages/Welcome'
import PilihPeran from '../pages/PilihPeran'
import Login from '../pages/Login'
import Register from '../pages/Register'

// Layout dan halaman penjual
import LayoutPenjual from '../components/penjual/LayoutPenjual'
import DashboardPenjual from '../pages/penjual/DashboardPenjual'
import KelolaMenu from '../pages/penjual/KelolaMenu'
import PesananMasuk from '../pages/penjual/PesananMasuk'
import UlasanPembeli from '../pages/penjual/UlasanPembeli'
import JamOperasional from '../pages/penjual/JamOperasional'
import KeuanganPenjual from '../pages/penjual/KeuanganPenjual'
import ProfilPenjual from '../pages/penjual/ProfilPenjual'
import PengaturanPenjual from '../pages/penjual/PengaturanPenjual'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Halaman awal dan autentikasi */}
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/pilih-peran" element={<PilihPeran />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Halaman mahasiswa */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Beranda />} />
        <Route path="/kantin" element={<DaftarKantin />} />
        <Route path="/kantin/:id" element={<DetailKantin />} />
        <Route path="/keranjang" element={<Keranjang />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/riwayat-pesanan" element={<RiwayatPesanan />} />
        <Route path="/pesanan/:id" element={<TrackingPesanan />} />
        <Route path="/profil" element={<ProfilPengguna />} />
      </Route>

      {/* Halaman penjual */}
      <Route
        path="/penjual"
        element={<Navigate to="/penjual/dashboard" replace />}
      />

      <Route element={<LayoutPenjual />}>
        <Route path="/penjual/dashboard" element={<DashboardPenjual />} />
        <Route path="/penjual/pesanan" element={<PesananMasuk />} />
        <Route path="/penjual/kelola-menu" element={<KelolaMenu />} />
        <Route path="/penjual/operasional" element={<JamOperasional />} />
        <Route path="/penjual/ulasan" element={<UlasanPembeli />} />
        <Route path="/penjual/keuangan" element={<KeuanganPenjual />} />
        <Route path="/penjual/profil" element={<ProfilPenjual />} />
        <Route path="/penjual/pengaturan" element={<PengaturanPenjual />} />
      </Route>

      {/* Halaman tidak ditemukan */}
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  )
}