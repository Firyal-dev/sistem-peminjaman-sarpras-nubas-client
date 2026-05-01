import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/common/components/ui/button"
import { Checkbox } from "@/common/components/ui/checkbox"
import type { ApiTransaction } from "@/common/api/services"

export type { ApiTransaction as Pengembalian }

const formatWaktu = (waktu: string | null) => {
    if (!waktu) return '-'
    const date = new Date(waktu)
    return date.toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export const columns: ColumnDef<ApiTransaction>[] = [
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
        id: "namaPeminjam",
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
        accessorFn: (row) => row.student?.name ?? '-',
    },
    {
        id: "namaBarang",
        header: "Barang",
        cell: ({ row }) => {
            const details = row.original.details ?? []
            const names = details.map(d => d.unit?.item?.name ?? '-')
            return (
                <div className="space-y-0.5">
                    {names.length > 0
                        ? names.map((n, i) => <div key={i} className="text-sm">{n}</div>)
                        : <span className="text-muted-foreground">-</span>
                    }
                </div>
            )
        },
    },
    {
        id: "kelas",
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
        accessorFn: (row) => {
            const c = row.student?.class
            return c ? `${c.class} ${c.major}` : '-'
        },
    },
    {
        accessorKey: "borrow_time",
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
        cell: ({ row }) => formatWaktu(row.getValue("borrow_time")),
    },
    {
        accessorKey: "return_time",
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
        cell: ({ row }) => formatWaktu(row.getValue("return_time")),
    },
]
