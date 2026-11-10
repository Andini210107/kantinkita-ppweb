import { useEffect, useMemo, useState } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Utensils,
  ImagePlus,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

const MENU_KEY = 'kantinkita_seller_menus'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'Makanan',
  image: '',
  available: true,
}

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

function getMenuAvailability(menu) {
  return menu.available !== false && menu.stock !== 0
}

export default function KelolaMenu() {
  const [menus, setMenus] = useState([])
  const [canteens, setCanteens] = useState([])
  const [selectedCanteen, setSelectedCanteen] = useState('')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Semua')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [menuResponse, canteenResponse] = await Promise.all([
          fetch('/data/menus.json'),
          fetch('/data/canteens.json'),
        ])

        if (!menuResponse.ok || !canteenResponse.ok) {
          throw new Error('Gagal memuat data')
        }

        const menuData = await menuResponse.json()
        const canteenData = await canteenResponse.json()

        const baseMenus = Array.isArray(menuData)
          ? menuData
          : menuData.menus || []

        const canteenList = Array.isArray(canteenData)
          ? canteenData
          : canteenData.canteens || []

        const savedMenus = JSON.parse(
          localStorage.getItem(MENU_KEY) || 'null'
        )

        setMenus(Array.isArray(savedMenus) ? savedMenus : baseMenus)
        setCanteens(canteenList)

        const savedCanteen = localStorage.getItem(
          'kantinkita_seller_canteen'
        )

        const validCanteen = canteenList.find(
          (item) => String(item.id) === String(savedCanteen)
        )

        setSelectedCanteen(
          validCanteen
            ? String(validCanteen.id)
            : canteenList[0]
              ? String(canteenList[0].id)
              : ''
        )
      } catch (error) {
        console.error(error)

        try {
          const savedMenus = JSON.parse(
            localStorage.getItem(MENU_KEY) || '[]'
          )
          setMenus(Array.isArray(savedMenus) ? savedMenus : [])
        } catch {
          setMenus([])
        }
      }
    }

    load()
  }, [])

  const currentCanteen = canteens.find(
    (item) => String(item.id) === String(selectedCanteen)
  )

  const currentCanteenMenus = useMemo(() => {
    if (!currentCanteen) return menus

    return menus.filter((menu) => {
      const menuCanteen = String(menu.canteenId || menu.canteen || '')
      return (
        menuCanteen === String(currentCanteen.id) ||
        menuCanteen === String(currentCanteen.name)
      )
    })
  }, [menus, currentCanteen])

  const filteredMenus = useMemo(() => {
    return currentCanteenMenus.filter((menu) => {
      const matchesSearch = menu.name
        ?.toLowerCase()
        .includes(search.toLowerCase())

      const matchesCategory =
        categoryFilter === 'Semua' ||
        menu.category === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [currentCanteenMenus, search, categoryFilter])

  const saveMenus = (updatedMenus) => {
    setMenus(updatedMenus)
    localStorage.setItem(MENU_KEY, JSON.stringify(updatedMenus))
    setMessage('Perubahan menu berhasil disimpan.')
  }

  const openAddForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setMessage('')
    setShowForm(true)
  }

  const openEditForm = (menu) => {
    setEditingId(menu.id)
    setForm({
      name: menu.name || '',
      description: menu.description || '',
      price: String(menu.price || ''),
      category: menu.category || 'Makanan',
      image: menu.image || '',
      available: getMenuAvailability(menu),
    })
    setMessage('')
    setShowForm(true)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.price || Number(form.price) <= 0) {
      setMessage('Nama dan harga menu wajib diisi dengan benar.')
      return
    }

    if (!currentCanteen) {
      setMessage('Data kantin belum tersedia.')
      return
    }

    if (editingId !== null) {
      const updatedMenus = menus.map((menu) =>
        String(menu.id) === String(editingId)
          ? {
              ...menu,
              name: form.name.trim(),
              description: form.description.trim(),
              price: Number(form.price),
              category: form.category,
              image: form.image.trim(),
              available: form.available,
            }
          : menu
      )

      saveMenus(updatedMenus)
    } else {
      const newMenu = {
        id: `menu-${Date.now()}`,
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        image: form.image.trim(),
        canteen: currentCanteen.name,
        canteenId: currentCanteen.id,
        available: form.available,
      }

      saveMenus([...menus, newMenu])
    }

    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const deleteMenu = (menuId) => {
    const confirmed = window.confirm(
      'Apakah kamu yakin ingin menghapus menu ini?'
    )

    if (!confirmed) return

    const updatedMenus = menus.filter(
      (menu) => String(menu.id) !== String(menuId)
    )

    saveMenus(updatedMenus)
  }

  const toggleAvailability = (menuId) => {
    const updatedMenus = menus.map((menu) =>
      String(menu.id) === String(menuId)
        ? { ...menu, available: !getMenuAvailability(menu) }
        : menu
    )

    saveMenus(updatedMenus)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-[#CC0000]">
            MANAJEMEN KANTIN
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
            Kelola Menu
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Tambah, ubah, dan atur ketersediaan menu kantin.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#CC0000] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#A80000]"
        >
          <Plus size={18} />
          Tambah Menu
        </button>
      </div>

      {message && !showForm && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Pilih Kantin
        </label>
        <select
          value={selectedCanteen}
          onChange={(event) => {
            setSelectedCanteen(event.target.value)
            localStorage.setItem(
              'kantinkita_seller_canteen',
              event.target.value
            )
          }}
          className="w-full max-w-md rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#CC0000]"
        >
          {canteens.map((canteen) => (
            <option key={canteen.id} value={String(canteen.id)}>
              {canteen.name}
            </option>
          ))}
        </select>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Menu</p>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">
            {currentCanteenMenus.length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Menu Tersedia</p>
          <p className="mt-2 text-3xl font-extrabold text-green-600">
            {currentCanteenMenus.filter(getMenuAvailability).length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Menu Habis</p>
          <p className="mt-2 text-3xl font-extrabold text-red-600">
            {currentCanteenMenus.filter((menu) => !getMenuAvailability(menu)).length}
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
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama menu..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#CC0000]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#CC0000]"
        >
          <option value="Semua">Semua Kategori</option>
          <option value="Makanan">Makanan</option>
          <option value="Minuman">Minuman</option>
          <option value="Camilan">Camilan</option>
        </select>
      </section>

      {filteredMenus.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center">
          <Utensils size={40} className="mx-auto text-gray-300" />
          <h3 className="mt-4 font-bold text-gray-800">
            Menu tidak ditemukan
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Coba ubah pencarian atau tambahkan menu baru.
          </p>
        </div>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredMenus.map((menu) => {
            const available = getMenuAvailability(menu)

            return (
              <article
                key={menu.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="relative h-44 bg-gray-100">
                  {menu.image ? (
                    <img
                      src={menu.image}
                      alt={menu.name}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300">
                      <ImagePlus size={42} />
                    </div>
                  )}

                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                      available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {available ? 'Tersedia' : 'Habis'}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-[#CC0000]">
                        {menu.category || 'Menu'}
                      </span>
                      <h3 className="mt-1 font-extrabold text-gray-900">
                        {menu.name}
                      </h3>
                    </div>
                    <p className="shrink-0 text-sm font-extrabold text-gray-900">
                      {formatRupiah(menu.price)}
                    </p>
                  </div>

                  <p className="mt-2 min-h-10 text-sm leading-5 text-gray-500">
                    {menu.description || 'Belum ada deskripsi menu.'}
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(menu)}
                      className="col-span-1 inline-flex items-center justify-center gap-1 rounded-lg border border-gray-200 px-2 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleAvailability(menu.id)}
                      className={`col-span-1 rounded-lg px-2 py-2 text-xs font-bold ${
                        available
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {available ? 'Habis' : 'Tersedia'}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteMenu(menu.id)}
                      className="col-span-1 inline-flex items-center justify-center gap-1 rounded-lg bg-red-50 px-2 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                    >
                      <Trash2 size={14} />
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  {editingId !== null ? 'Edit Menu' : 'Tambah Menu Baru'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Lengkapi informasi menu kantin.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Tutup formulir"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Nama Menu
                </label>
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Contoh: Nasi Ayam Geprek"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#CC0000]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Deskripsi
                </label>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  rows={3}
                  placeholder="Deskripsi singkat menu..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#CC0000]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.price}
                    onChange={(event) =>
                      setForm({ ...form, price: event.target.value })
                    }
                    placeholder="15000"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#CC0000]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Kategori
                  </label>
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#CC0000]"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Camilan">Camilan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  URL Gambar Menu
                </label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(event) =>
                    setForm({ ...form, image: event.target.value })
                  }
                  placeholder="https://contoh.com/gambar.jpg"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#CC0000]"
                />
              </div>

              <label className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 text-sm font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(event) =>
                    setForm({ ...form, available: event.target.checked })
                  }
                  className="h-4 w-4 accent-[#CC0000]"
                />
                Menu tersedia untuk dipesan
              </label>

              {message && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle size={17} />
                  {message}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#CC0000] px-6 py-3 text-sm font-bold text-white hover:bg-[#A80000]"
                >
                  {editingId !== null ? 'Simpan Perubahan' : 'Tambah Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}