import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, AlertTriangle, CheckCircle2 } from "lucide-react"

import { Button } from "@/common/components/ui/button"
import { Checkbox } from "@/common/components/ui/checkbox"
import { Badge } from "@/common/components/ui/badge"
import type { ApiTransaction } from "@/common/api/services"
import { isBedaHari, hitungDurasi } from "../../rekap/utils/waktu"

export type { ApiTransaction as Pengembalian }

const formatJam = (waktu: string | null) => {
    if (!waktu) return '-'
    return new Date(waktu).toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit" })
}

const formatTanggalJam = (waktu: string | null) => {
    if (!waktu) return '-'
    return new Date(waktu).toLocaleString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
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
        header: "Barang",
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
        id: "waktu_pinjam_kembali",
        header: "Waktu Pinjam → Kembali",
        cell: ({ row }) => {
            const tx = row.original
            const bedaHari = isBedaHari(tx.borrow_time, tx.return_time)
            const durasi = hitungDurasi(tx.borrow_time, tx.return_time)

            return (
                <div className="space-y-1">
                    {bedaHari ? (
                        // Beda hari — tampilkan tanggal + jam lengkap
                        <div className="space-y-0.5">
                            <p className="text-xs text-muted-foreground">
                                Pinjam: {formatTanggalJam(tx.borrow_time)}
                            </p>
                            <p className="text-xs text-destructive font-medium flex items-center gap-1">
                                <AlertTriangle className="size-3" />
                                Kembali: {formatTanggalJam(tx.return_time)}
                            </p>
                        </div>
                    ) : (
                        // Hari yang sama — tampilkan "HH:mm – HH:mm"
                        <div>
                            <p className="font-medium tabular-nums">
                                {formatJam(tx.borrow_time)}
                                <span className="mx-1.5 text-muted-foreground">→</span>
                                {formatJam(tx.return_time)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(tx.borrow_time).toLocaleDateString('id-ID', {
                                    day: '2-digit', month: 'short', year: 'numeric'
                                })}
                            </p>
                        </div>
                    )}
                    {/* Durasi */}
                    <p className={[
                        "text-xs",
                        bedaHari ? "text-destructive font-semibold" : "text-muted-foreground"
                    ].join(" ")}>
                        {durasi !== '-' ? `⏱ ${durasi}` : ''}
                    </p>
                </div>
            )
        },
    },
    {
        id: "status_waktu",
        header: "Keterangan",
        cell: ({ row }) => {
            const tx = row.original
            const bedaHari = isBedaHari(tx.borrow_time, tx.return_time)
            return (
                <div className="flex flex-col gap-1">
                    <Badge variant="secondary" className="w-fit gap-1 bg-green-100 text-green-700 border-green-200 text-xs">
                        <CheckCircle2 className="size-3" />
                        Dikembalikan
                    </Badge>
                    {bedaHari && (
                        <Badge variant="destructive" className="w-fit gap-1 text-xs">
                            <AlertTriangle className="size-3" />
                            Beda Hari
                        </Badge>
                    )}
                </div>
            )
        },
    },
]
