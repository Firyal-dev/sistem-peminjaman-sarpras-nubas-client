import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/common/components/ui/button"
import { Checkbox } from "@/common/components/ui/checkbox"
import { DataTableDeleteAction } from "@/features/admin/components/data-table-button-action"

type Kelas =
    | "X AK" | "XI AK" | "XII AK"
    | "X FARMASI" | "XI FARMASI" | "XII FARMASI"
    | "X PPLG" | "XI PPLG" | "XII PPLG"

export interface Peminjaman {
    id: number
    namaPeminjam: string
    kelas: Kelas
    namaBarang: string
    waktuPeminjaman: string
}

export const dummyData: Peminjaman[] = [
    { id: 1, namaPeminjam: "Andi Saputra", kelas: "X AK", namaBarang: "Proyektor Epson", waktuPeminjaman: "2025-04-28 08:00" },
    { id: 2, namaPeminjam: "Budi Santoso", kelas: "XI PPLG", namaBarang: "Laptop Lenovo", waktuPeminjaman: "2025-04-28 09:15" },
    { id: 3, namaPeminjam: "Citra Dewi", kelas: "XII FARMASI", namaBarang: "Microphone Wireless", waktuPeminjaman: "2025-04-28 10:30" },
    { id: 4, namaPeminjam: "Dian Pratama", kelas: "X PPLG", namaBarang: "Speaker Aktif", waktuPeminjaman: "2025-04-29 07:45" },
    { id: 5, namaPeminjam: "Eka Rahayu", kelas: "XI AK", namaBarang: "Kamera DSLR", waktuPeminjaman: "2025-04-29 08:00" },
    { id: 6, namaPeminjam: "Fajar Nugroho", kelas: "XII AK", namaBarang: "Tripod Kamera", waktuPeminjaman: "2025-04-29 11:00" },
    { id: 7, namaPeminjam: "Gita Lestari", kelas: "X FARMASI", namaBarang: "Layar Proyektor", waktuPeminjaman: "2025-04-30 08:30" },
    { id: 8, namaPeminjam: "Hendra Wijaya", kelas: "XI FARMASI", namaBarang: "Whiteboard", waktuPeminjaman: "2025-04-30 09:00" },
    { id: 9, namaPeminjam: "Indah Permata", kelas: "XII PPLG", namaBarang: "Kursi Lipat", waktuPeminjaman: "2025-04-30 13:00" },
    { id: 10, namaPeminjam: "Joko Susilo", kelas: "X AK", namaBarang: "Meja Panjang", waktuPeminjaman: "2025-05-01 07:30" },
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

export const columns: ColumnDef<Peminjaman>[] = [
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
