import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/common/components/ui/dialog"
import { Badge } from "@/common/components/ui/badge"
import { Clock, User, Package, CalendarClock, AlertTriangle, CheckCircle2 } from "lucide-react"
import type { ApiTransaction } from "@/common/api/services"
import {
    formatTanggalJam, formatJam, hitungDurasi, isBedaHari, isTerlambatAktif
} from "../utils/waktu"

interface DetailDialogProps {
    tx: ApiTransaction | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const DetailDialog = ({ tx, open, onOpenChange }: DetailDialogProps) => {
    if (!tx) return null

    const isDone = tx.status === 'done'
    const bedaHari = isBedaHari(tx.borrow_time, tx.return_time)
    const terlambatAktif = !isDone && isTerlambatAktif(tx.due_time)
    const durasi = hitungDurasi(tx.borrow_time, tx.return_time)

    const kelas = tx.student?.class
        ? `${tx.student.class.class} ${tx.student.class.major}`
        : '-'

    // Unique item names
    const barangList = [
        ...new Map(
            (tx.details ?? [])
                .filter(d => d.unit?.item)
                .map(d => [d.unit.item.id, d.unit.item.name])
        ).values()
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Detail Transaksi
                        <span className="font-mono text-sm text-muted-foreground">#{tx.id}</span>
                    </DialogTitle>
                    <DialogDescription>
                        Informasi lengkap peminjaman barang
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Status badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {isDone ? (
                            <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700 border-green-200">
                                <CheckCircle2 className="size-3" />
                                Dikembalikan
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="gap-1 bg-blue-100 text-blue-700 border-blue-200">
                                <Clock className="size-3" />
                                Sedang Dipinjam
                            </Badge>
                        )}
                        {(bedaHari || terlambatAktif) && (
                            <Badge variant="destructive" className="gap-1">
                                <AlertTriangle className="size-3" />
                                {terlambatAktif ? 'Terlambat Belum Kembali' : 'Beda Hari'}
                            </Badge>
                        )}
                    </div>

                    {/* Peminjam */}
                    <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                            <User className="size-3.5" /> Peminjam
                        </p>
                        <p className="font-semibold">{tx.student?.name ?? '-'}</p>
                        <p className="text-sm text-muted-foreground">
                            NIS: {tx.student?.nis ?? '-'} · {kelas}
                        </p>
                    </div>

                    {/* Barang */}
                    <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                            <Package className="size-3.5" /> Barang ({barangList.length})
                        </p>
                        <ul className="space-y-1">
                            {barangList.map((nama, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm">
                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                        {i + 1}
                                    </span>
                                    {nama}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Waktu */}
                    <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                            <CalendarClock className="size-3.5" /> Waktu
                        </p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-xs text-muted-foreground">Dipinjam</p>
                                <p className="font-medium">{formatTanggalJam(tx.borrow_time)}</p>
                            </div>
                            {isDone && tx.return_time ? (
                                <div>
                                    <p className="text-xs text-muted-foreground">Dikembalikan</p>
                                    <p className={["font-medium", bedaHari ? "text-destructive" : ""].join(" ")}>
                                        {formatTanggalJam(tx.return_time)}
                                        {bedaHari && (
                                            <span className="ml-1 text-[10px] font-bold text-destructive">
                                                ⚠ BEDA HARI
                                            </span>
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-xs text-muted-foreground">Batas Kembali</p>
                                    <p className={["font-medium", terlambatAktif ? "text-destructive" : ""].join(" ")}>
                                        {formatTanggalJam(tx.due_time)}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Durasi — hanya jika sudah kembali */}
                        {isDone && durasi !== '-' && (
                            <div className="mt-1 flex items-center gap-2 rounded-md bg-background px-3 py-2 text-sm">
                                <Clock className="size-4 text-muted-foreground shrink-0" />
                                <span>
                                    Durasi pinjam: <span className="font-semibold">{durasi}</span>
                                </span>
                                {bedaHari && (
                                    <span className="ml-auto text-xs font-semibold text-destructive flex items-center gap-1">
                                        <AlertTriangle className="size-3" /> Beda hari
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Ringkasan jam untuk yang sudah kembali di hari yang sama */}
                        {isDone && tx.return_time && !bedaHari && (
                            <p className="text-xs text-muted-foreground text-center">
                                {formatJam(tx.borrow_time)} – {formatJam(tx.return_time)}
                            </p>
                        )}
                    </div>

                    {/* Catatan */}
                    {tx.notes && (
                        <div className="rounded-lg border bg-muted/30 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Catatan</p>
                            <p className="text-sm">{tx.notes}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
