import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3 lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">
            Solusi pemesanan makanan dan minuman kantin kampus yang lebih
            praktis, cepat, dan nyaman.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-gray-900">Navigasi</h3>
          <div className="flex flex-col gap-3 text-sm text-gray-500">
            <Link to="/" className="hover:text-[#CC0000]">Beranda</Link>
            <Link to="/kantin" className="hover:text-[#CC0000]">Jelajahi Kantin</Link>
            <Link to="/pesanan" className="hover:text-[#CC0000]">Pesanan Saya</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-gray-900">KantinKita</h3>
          <p className="text-sm leading-6 text-gray-500">
            Mendukung pengalaman pemesanan makanan yang lebih terorganisir
            di lingkungan Telkom University.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 px-5 py-5 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} KantinKita. All rights reserved.
      </div>
    </footer>
  )
}