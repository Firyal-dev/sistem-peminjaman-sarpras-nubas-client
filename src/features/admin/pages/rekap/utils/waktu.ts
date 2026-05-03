/**
 * Format tanggal + jam: "12 Mei 2026, 08:30"
 */
export const formatTanggalJam = (waktu: string | null): string => {
    if (!waktu) return '-'
    return new Date(waktu).toLocaleString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
}

/**
 * Format jam saja: "08:30"
 */
export const formatJam = (waktu: string | null): string => {
    if (!waktu) return '-'
    return new Date(waktu).toLocaleString('id-ID', {
        hour: '2-digit', minute: '2-digit',
    })
}

/**
 * Format tanggal saja: "12 Mei 2026"
 */
export const formatTanggal = (waktu: string | null): string => {
    if (!waktu) return '-'
    return new Date(waktu).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
    })
}

/**
 * Hitung durasi antara dua waktu, return string "X jam Y menit" atau "Y menit"
 */
export const hitungDurasi = (mulai: string | null, selesai: string | null): string => {
    if (!mulai || !selesai) return '-'
    const diffMs = new Date(selesai).getTime() - new Date(mulai).getTime()
    if (diffMs <= 0) return '-'
    const totalMenit = Math.floor(diffMs / 60000)
    const jam = Math.floor(totalMenit / 60)
    const menit = totalMenit % 60
    if (jam > 0) return `${jam} jam ${menit} menit`
    return `${menit} menit`
}

/**
 * Cek apakah tanggal pengembalian berbeda dengan tanggal pinjam (terlambat / beda hari)
 */
export const isBedaHari = (mulai: string | null, selesai: string | null): boolean => {
    if (!mulai || !selesai) return false
    const a = new Date(mulai).toDateString()
    const b = new Date(selesai).toDateString()
    return a !== b
}

/**
 * Cek apakah transaksi aktif sudah melewati due_time (terlambat belum kembali)
 */
export const isTerlambatAktif = (dueTime: string | null): boolean => {
    if (!dueTime) return false
    return new Date(dueTime) < new Date()
}
