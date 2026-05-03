import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, RotateCcw, Clock, AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router"

import { Button } from "@/common/components/ui/button"
import { Checkbox } from "@/common/components/ui/checkbox"
import { Badge } from "@/common/components/ui/badge"
import type { ApiTransaction } from "@/common/api/services"
import { isTerlambatAktif } from "../../rekap/utils/waktu"

export type { ApiTransaction as Peminjaman }

const formatTanggalJam = (waktu: string) =>
    new Date(waktu).toLocaleString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    })

const formatJam = (waktu: string) =>
    new Date(waktu).toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit" })

const ReturnButton = ({ tx }: { tx: ApiTransaction }) => {
    const navigate = useNavigate()
    return (
        <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/scan', {
                state: {
                    mode: 'return',
                    transaction_id: tx.id,
                    student_name: tx.student?.name ?? `Transaksi #${tx.id}`,
                }
            })}
        >
            <RotateCcw className="size-4 mr-1" />
            Kembalikan
        </Button>
    )
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
            <div className="w-[40px] font-mono text-muted-foreground">{row.getValue("id")}</div>
        ),
    },
    {
        id: "namaPeminjam",
        header: ({ column }) => (
            <Button variant="ghost" size="sm" className="-ml-3"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Nama Peminjam <ArrowUpDown className="size-4" />
            </Button>
        ),
        accessorFn: (row) => row.student?.name ?? '-',
        cell: ({ row }) => (
            <div>
                <p className="font-medium">{row.original.student?.name ?? '-'}</p>
                <p className="text-xs text-muted-foreground">
                    NIS: {row.original.student?.nis ?? '-'}
                </p>
            </div>
        ),
    },
    {
        id: "namaBarang",
        header: "Barang Dipinjam",
        cell: ({ row }) => {
            const names = [...new Map(
                (row.original.details ?? [])
                    .filter(d => d.unit?.item)
                    .map(d => [d.unit.item.id, d.unit.item.name])
            ).values()]
            return (
                <div className="space-y-0.5">
                    {names.length > 0
                        ? names.map((n, i) => <div key={i} className="text-sm">{n}</div>)
                        : <span className="text-muted-foreground">-</span>}
                </div>
            )
        },
    },
    {
        id: "kelas",
        header: "Kelas",
        accessorFn: (row) => row.student?.class?.full_name ?? '-',
    },
    {
        accessorKey: "borrow_time",
        header: ({ column }) => (
            <Button variant="ghost" size="sm" className="-ml-3"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Dipinjam Sejak <ArrowUpDown className="size-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const waktu = row.getValue<string>("borrow_time")
            const terlambat = isTerlambatAktif(row.original.due_time)
            return (
                <div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="font-medium">{formatJam(waktu)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(waktu).toLocaleDateString('id-ID', {
                            day: '2-digit', month: 'short', year: 'numeric'
                        })}
                    </p>
                    {terlambat && (
                        <Badge variant="destructive" className="mt-1 gap-1 text-[10px] px-1.5 py-0">
                            <AlertTriangle className="size-2.5" /> Terlambat
                        </Badge>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "due_time",
        header: "Batas Kembali",
        cell: ({ row }) => {
            const waktu = row.getValue<string>("due_time")
            const terlambat = isTerlambatAktif(waktu)
            return (
                <span className={terlambat ? "text-destructive font-medium" : "text-muted-foreground"}>
                    {formatTanggalJam(waktu)}
                </span>
            )
        },
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => <ReturnButton tx={row.original} />,
    },
]
