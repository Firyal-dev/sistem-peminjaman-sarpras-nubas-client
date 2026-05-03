# Sistem Peminjaman Sarpras — Frontend

Aplikasi web untuk sistem peminjaman sarana dan prasarana (sarpras) sekolah. Terdiri dari dua sisi: panel admin untuk mengelola data dan memantau transaksi, serta halaman publik untuk siswa melakukan peminjaman via scan QR code.

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Routing | React Router v7 |
| State / Cache | TanStack Query v5 |
| Tabel | TanStack Table v8 |
| UI Components | shadcn/ui + Base UI + Radix UI |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios |
| QR Scanner | html5-qrcode |
| Notifikasi | Sonner |
| Icons | Lucide React |

---

## Persyaratan

- Node.js >= 18
- Backend API berjalan di `http://localhost:8000`

---

## Instalasi

```bash
# 1. Masuk ke folder
cd sistem-peminjaman-sarpras-nubas-client

# 2. Install dependencies
npm install

# 3. Salin file environment
cp .env.example .env
# atau buat manual:
echo "VITE_API_URL=http://localhost:8000/api" > .env

# 4. Jalankan dev server
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`.

---

## Environment Variables

```env
VITE_API_URL=http://localhost:8000/api
```

---

## Build Production

```bash
npm run build
# Output ada di folder dist/
```

---

## Struktur Halaman

### Halaman Publik (Siswa)

| Path | Halaman | Keterangan |
|---|---|---|
| `/` | Landing Page | Halaman awal, pilih aksi pinjam atau kembali |
| `/form` | Form Peminjaman | Pilih jurusan → kelas → siswa, lanjut ke scan |
| `/scan` | Scan QR Pinjam | Scan QR code barang yang akan dipinjam |
| `/return` | Pengembalian | Cari transaksi aktif, scan QR untuk kembalikan |

### Panel Admin (Butuh Login)

| Path | Halaman | Keterangan |
|---|---|---|
| `/admin/login` | Login | Autentikasi admin |
| `/admin/dashboard` | Dashboard | Statistik + tabel peminjaman aktif |
| `/admin/barang` | Daftar Barang | CRUD barang + kelola unit QR |
| `/admin/barang/:id/units` | Kelola Unit | Generate & hapus unit QR per barang |
| `/admin/dipinjam` | Barang Dipinjam | List transaksi aktif + tombol kembalikan |
| `/admin/dikembalikan` | Barang Dikembalikan | List transaksi selesai |
| `/admin/rekap` | Rekap Transaksi | Semua transaksi + filter + export Excel |
| `/admin/kelas` | Manajemen Kelas | CRUD kelas (grade, jurusan, rombel) |
| `/admin/kelas/:id/siswa` | Daftar Siswa | CRUD siswa per kelas |

---

## Alur Peminjaman (Siswa)

```
Landing Page
    ↓ Klik "Pinjam"
Form Peminjaman
    → Pilih Jurusan
    → Pilih Kelas
    → Pilih Nama Siswa
    ↓ Klik "Scan"
Halaman Scan
    → Scan QR code barang (bisa multiple)
    → Review daftar barang yang dipindai
    → Set batas waktu kembali
    ↓ Klik "Konfirmasi Pinjam"
Transaksi tersimpan ✓
```

## Alur Pengembalian (Siswa)

```
Landing Page
    ↓ Klik "Kembalikan"
Halaman Return
    → Cari transaksi aktif (by nama / NIS)
    → Pilih transaksi
    ↓ Scan QR code barang yang dikembalikan
Transaksi diperbarui ✓
```

---

## Struktur Folder

```
src/
├── common/
│   ├── api/
│   │   ├── axios.ts          — konfigurasi Axios + base URL
│   │   └── services.ts       — semua service calls + TypeScript types
│   ├── auth/
│   │   ├── authStore.ts      — state login (localStorage)
│   │   └── RequireAuth.tsx   — guard route admin
│   ├── components/
│   │   ├── ui/               — komponen UI (button, dialog, table, dll)
│   │   ├── confirm-dialog.tsx
│   │   └── result-dialog.tsx
│   ├── hooks/
│   │   ├── useClasses.ts
│   │   ├── useStudents.ts
│   │   ├── useItems.ts
│   │   └── useTransactions.ts
│   └── query/
│       └── keys.ts           — centralized TanStack Query cache keys
│
├── features/
│   ├── admin/
│   │   ├── components/       — layout, sidebar, data-table, header
│   │   ├── layout.tsx        — shell admin (sidebar + breadcrumb)
│   │   └── pages/
│   │       ├── dashboard/
│   │       ├── barang/
│   │       ├── units/
│   │       ├── peminjaman/
│   │       ├── pengembalian/
│   │       ├── rekap/
│   │       └── kelas/        — manajemen kelas & siswa
│   │
│   └── user/
│       ├── components/
│       └── pages/
│           ├── landing-page/
│           ├── form/         — form peminjaman (pilih jurusan → kelas → siswa)
│           ├── scan/         — scan QR pinjam
│           └── return/       — pengembalian barang
│
└── route.tsx                 — definisi semua routes
```

---

## TypeScript Types Utama

```ts
// Kelas
interface ApiClass {
  id: number
  grade: number        // 10 | 11 | 12 | 13
  major: string        // "PPLG" | "Farmasi" | "Analis Kimia" | ...
  rombel: number       // 1, 2, 3, ...
  full_name: string    // "10 PPLG 1"
  students_count?: number
}

// Siswa
interface ApiStudent {
  id: number
  name: string
  nis: string
  class_id: number
  class: ApiClass
}

// Transaksi
interface ApiTransaction {
  id: number
  student_id: number
  borrow_time: string
  due_time: string
  return_time: string | null
  status: "active" | "done"
  notes: string | null
  student: ApiStudent & { class: ApiClass }
  details: ApiTransactionDetail[]
}
```

---

## Catatan Pengembangan

- Semua cache key TanStack Query terpusat di `src/common/query/keys.ts`
- Komponen UI menggunakan shadcn/ui — tambah komponen baru via `npx shadcn add <component>`
- Admin routes dilindungi `RequireAuth` — redirect ke `/admin/login` jika belum login
- Token disimpan di `localStorage` via `authStore`
- `GET /classes` dan `GET /students` adalah public endpoint — dibutuhkan form siswa tanpa login
