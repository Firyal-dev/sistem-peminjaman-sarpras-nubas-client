import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/common/components/ui/button"
import { Checkbox } from "@/common/components/ui/checkbox"
import { DataTableDeleteAction } from "@/features/admin/components/data-table-button-action"

type Kelas =
    | "X AK" | "XI AK" | "XII AK"
    | "X FARMASI" | "XI FARMASI" | "XII FARMASI"
    | "X PPLG" | "XI PPLG" | "XII PPLG"

export interface Pengembalian {
    id: number
    namaPeminjam: string
    namaBarang: string
    kelas: Kelas
    waktuPeminjaman: string
    waktuPengembalian: string
}

export const dummyData: Pengembalian[] = [
    { id: 1, namaPeminjam: "Andi Saputra", namaBarang: "Proyektor Epson", kelas: "X AK", waktuPeminjaman: "2025-04-21 08:00", waktuPengembalian: "2025-04-28 08:00" },
    { id: 2, namaPeminjam: "Budi Santoso", namaBarang: "Laptop Lenovo", kelas: "XI PPLG", waktuPeminjaman: "2025-04-21 09:15", waktuPengembalian: "2025-04-28 09:00" },
    { id: 3, namaPeminjam: "Citra Dewi", namaBarang: "Microphone Wireless", kelas: "XII FARMASI", waktuPeminjaman: "2025-04-22 10:30", waktuPengembalian: "2025-04-29 10:00" },
    { id: 4, namaPeminjam: "Dian Pratama", namaBarang: "Speaker Aktif", kelas: "X PPLG", waktuPeminjaman: "2025-04-22 07:45", waktuPengembalian: "2025-04-29 08:00" },
    { id: 5, namaPeminjam: "Eka Rahayu", namaBarang: "Kamera DSLR", kelas: "XI AK", waktuPeminjaman: "2025-04-23 08:00", waktuPengembalian: "2025-04-30 08:00" },
    { id: 6, namaPeminjam: "Fajar Nugroho", namaBarang: "Tripod Kamera", kelas: "XII AK", waktuPeminjaman: "2025-04-23 11:00", waktuPengembalian: "2025-04-30 11:00" },
    { id: 7, namaPeminjam: "Gita Lestari", namaBarang: "Layar Proyektor", kelas: "X FARMASI", waktuPeminjaman: "2025-04-24 08:30", waktuPengembalian: "2025-05-01 08:00" },
    { id: 8, namaPeminjam: "Hendra Wijaya", namaBarang: "Whiteboard", kelas: "XI FARMASI", waktuPeminjaman: "2025-04-24 09:00", waktuPengembalian: "2025-05-01 09:00" },
    { id: 9, namaPeminjam: "Indah Permata", namaBarang: "Kursi Lipat", kelas: "XII PPLG", waktuPeminjaman: "2025-04-25 13:00", waktuPengembalian: "2025-05-01 13:00" },
    { id: 10, namaPeminjam: "Joko Susilo", namaBarang: "Meja Panjang", kelas: "X AK", waktuPeminjaman: "2025-04-25 07:30", waktuPengembalian: "2025-05-01 07:30" },
]

const formatWaktu = (waktu: string) => {
    const date = new Date(waktu)
    return date.toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export const columns: ColumnDef<Pengembalian>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected()
                        ? true
                        : table.getIsSomePageRowsSelected()
                            ? "indeterminate"
                            : false
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Pilih semua"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Pilih baris"
            />
        ),
        enableSorting: false,
        enableColumnFilter: false,
    },
    {
        accessorKey: "id",
        header: "No",
        cell: ({ row }) => (
            <div className="w-[40px] font-mono">{row.getValue("id")}</div>
        ),
    },
    {
        accessorKey: "namaPeminjam",
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Nama Peminjam
                <ArrowUpDown className="size-4" />
            </Button>
        ),
    },
    {
        accessorKey: "namaBarang",
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Nama Barang
                <ArrowUpDown className="size-4" />
            </Button>
        ),
    },
    {
        accessorKey: "kelas",
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Kelas
                <ArrowUpDown className="size-4" />
            </Button>
        ),
    },
    {
        accessorKey: "waktuPeminjaman",
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Waktu Peminjaman
                <ArrowUpDown className="size-4" />
            </Button>
        ),
        cell: ({ row }) => formatWaktu(row.getValue("waktuPeminjaman")),
    },
    {
        accessorKey: "waktuPengembalian",
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Waktu Pengembalian
                <ArrowUpDown className="size-4" />
            </Button>
        ),
        cell: ({ row }) => formatWaktu(row.getValue("waktuPengembalian")),
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
            <DataTableDeleteAction
                id={row.original.id}
                onDelete={(id) => console.log("Delete:", id)}
            />
        ),
    },
]
