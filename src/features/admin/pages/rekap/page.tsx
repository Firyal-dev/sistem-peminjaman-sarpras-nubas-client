import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import {
    FileDown, Loader2, Search, AlertTriangle, CheckCircle2,
    Clock, ChevronRight, Filter
} from "lucide-react"

import { Header } from "../../components/header"
import { Button } from "@/common/components/ui/button"
import { Input } from "@/common/components/ui/input"
import { Badge } from "@/common/components/ui/badge"
import { ConfirmDialog } from "@/common/components/confirm-dialog"
import { ResultDialog } from "@/common/components/result-dialog"
import { DetailDialog } from "./components/detail-dialog"
import { transactionsService, type ApiTransaction } from "@/common/api/services"
import {
    formatTanggalJam, formatJam, hitungDurasi, isBedaHari, isTerlambatAktif
} from "./utils/waktu"

type FilterStatus = 'all' | 'active' | 'done'

export const RekapPage = () => {
    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
    const [selectedTx, setSelectedTx] = useState<ApiTransaction | null>(null)
    const [detailOpen, setDetailOpen] = useState(false)
    const [confirmExport, setConfirmExport] = useState(false)
    const [exporting, setExporting] = useState(false)
    const [exportResult, setExportResult] = useState<{ type: "success" | "error"; title: string; desc: string } | null>(null)

    const { data, isLoading, error } = useQuery({
        queryKey: ['transactions', 'rekap'],
        queryFn: () => transactionsService.getAllFull(),
    })

    const allTransactions: ApiTransaction[] = useMemo(() => {
        const list = data?.data ?? []
        // Urutkan berdasarkan borrow_time terbaru
        return [...list].sort(
            (a, b) => new Date(b.borrow_time).getTime() - new Date(a.borrow_time).getTime()
        )
    }, [data])

    const filtered = useMemo(() => {
        return allTransactions.filter(tx => {
            if (filterStatus !== 'all' && tx.status !== filterStatus) return false
            if (!search.trim()) return true
            const q = search.toLowerCase()
            const nama = tx.student?.name?.toLowerCase() ?? ''
            const nis = tx.student?.nis?.toLowerCase() ?? ''
            const kelas = tx.student?.class?.full_name?.toLowerCase() ?? ''
            const barang = (tx.details ?? [])
                .map(d => d.unit?.item?.name?.toLowerCase() ?? '')
                .join(' ')
            return nama.includes(q) || nis.includes(q) || kelas.includes(q) || barang.includes(q)
        })
    }, [allTransactions, search, filterStatus])

    const stats = useMemo(() => ({
        total: allTransactions.length,
        active: allTransactions.filter(t => t.status === 'active').length,
        done: allTransactions.filter(t => t.status === 'done').length,
        terlambat: allTransactions.filter(t =>
            (t.status === 'done' && isBedaHari(t.borrow_time, t.return_time)) ||
            (t.status === 'active' && isTerlambatAktif(t.due_time))
        ).length,
    }), [allTransactions])

    const handleExport = async () => {
        setConfirmExport(false)
        setExporting(true)
        try {
            await transactionsService.exportRekap('rekap-transaksi.xlsx')
            setExportResult({ type: "success", title: "Export Berhasil", desc: "File rekap-transaksi.xlsx berhasil diunduh." })
        } catch {
            setExportResult({ type: "error", title: "Export Gagal", desc: "Terjadi kesalahan saat mengunduh rekap." })
        } finally {
            setExporting(false)
        }
    }

    const handleRowClick = (tx: ApiTransaction) => {
        setSelectedTx(tx)
        setDetailOpen(true)
    }

    return (
        <div className="space-y-6">
            <Header
                title="Rekap Transaksi"
                desc="Semua data peminjaman dan pengembalian diurutkan berdasarkan waktu."
                actions={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmExport(true)}
                        disabled={exporting}
                        className="gap-2"
                    >
                        {exporting ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
                        Export Rekap
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                    { label: "Total", value: stats.total, color: "text-foreground" },
                    { label: "Dipinjam", value: stats.active, color: "text-blue-600" },
                    { label: "Dikembalikan", value: stats.done, color: "text-green-600" },
                    { label: "Terlambat", value: stats.terlambat, color: "text-destructive" },
                ].map(s => (
                    <div key={s.label} className="rounded-xl border bg-card px-4 py-3">
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Filter + Search */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama, NIS, kelas, atau barang..."
                        className="pl-9"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Filter className="size-4 text-muted-foreground" />
                    {(['all', 'active', 'done'] as FilterStatus[]).map(f => (
                        <Button
                            key={f}
                            size="sm"
                            variant={filterStatus === f ? "default" : "outline"}
                            onClick={() => setFilterStatus(f)}
                            className="text-xs"
                        >
                            {f === 'all' ? 'Semua' : f === 'active' ? 'Dipinjam' : 'Dikembalikan'}
                        </Button>
                    ))}
                </div>
            </div>

            {error && <p className="text-sm text-destructive">Gagal memuat data transaksi.</p>}

            {/* Tabel */}
            <div className="rounded-xl border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-10">#</th>
                                <th className="px-4 py-3 text-left font-medium">Peminjam</th>
                                <th className="px-4 py-3 text-left font-medium">Barang</th>
                                <th className="px-4 py-3 text-left font-medium">Waktu Pinjam</th>
                                <th className="px-4 py-3 text-left font-medium">Pengembalian</th>
                                <th className="px-4 py-3 text-left font-medium">Durasi</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 w-8" />
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                                        <Loader2 className="size-5 animate-spin mx-auto mb-2" />
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                                        Tidak ada data ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((tx, idx) => {
                                    const isDone = tx.status === 'done'
                                    const bedaHari = isBedaHari(tx.borrow_time, tx.return_time)
                                    const terlambatAktif = !isDone && isTerlambatAktif(tx.due_time)
                                    const flagged = bedaHari || terlambatAktif
                                    const durasi = hitungDurasi(tx.borrow_time, tx.return_time)

                                    const barangNames = [
                                        ...new Map(
                                            (tx.details ?? [])
                                                .filter(d => d.unit?.item)
                                                .map(d => [d.unit.item.id, d.unit.item.name])
                                        ).values()
                                    ]

                                    return (
                                        <tr
                                            key={tx.id}
                                            className={[
                                                "border-b last:border-0 cursor-pointer transition-colors",
                                                flagged
                                                    ? "bg-destructive/5 hover:bg-destructive/10"
                                                    : "hover:bg-muted/40"
                                            ].join(" ")}
                                            onClick={() => handleRowClick(tx)}
                                        >
                                            {/* No */}
                                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                                {idx + 1}
                                            </td>

                                            {/* Peminjam */}
                                            <td className="px-4 py-3">
                                                <p className="font-medium">{tx.student?.name ?? '-'}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {tx.student?.class?.full_name ?? '-'}
                                                </p>
                                            </td>

                                            {/* Barang */}
                                            <td className="px-4 py-3 max-w-[180px]">
                                                {barangNames.length === 0 ? (
                                                    <span className="text-muted-foreground">-</span>
                                                ) : barangNames.length === 1 ? (
                                                    <span>{barangNames[0]}</span>
                                                ) : (
                                                    <span>
                                                        {barangNames[0]}
                                                        <span className="ml-1 text-xs text-muted-foreground">
                                                            +{barangNames.length - 1} lainnya
                                                        </span>
                                                    </span>
                                                )}
                                            </td>

                                            {/* Waktu Pinjam */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(tx.borrow_time).toLocaleDateString('id-ID', {
                                                        day: '2-digit', month: 'short', year: 'numeric'
                                                    })}
                                                </p>
                                                <p className="font-medium">{formatJam(tx.borrow_time)}</p>
                                            </td>

                                            {/* Pengembalian */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {isDone && tx.return_time ? (
                                                    <>
                                                        {bedaHari ? (
                                                            <p className="text-xs text-destructive font-medium">
                                                                {formatTanggalJam(tx.return_time)}
                                                            </p>
                                                        ) : (
                                                            <>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {formatJam(tx.borrow_time)} – {formatJam(tx.return_time)}
                                                                </p>
                                                                <p className="font-medium text-green-700">
                                                                    {formatJam(tx.return_time)}
                                                                </p>
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className={[
                                                        "text-xs",
                                                        terlambatAktif ? "text-destructive font-medium" : "text-muted-foreground"
                                                    ].join(" ")}>
                                                        {terlambatAktif ? "Terlambat" : "Belum kembali"}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Durasi */}
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                {isDone ? (
                                                    <span className={bedaHari ? "text-destructive font-medium" : "text-muted-foreground"}>
                                                        {durasi}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1">
                                                    {isDone ? (
                                                        <Badge variant="secondary" className="w-fit gap-1 bg-green-100 text-green-700 border-green-200 text-xs">
                                                            <CheckCircle2 className="size-3" />
                                                            Kembali
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="w-fit gap-1 bg-blue-100 text-blue-700 border-blue-200 text-xs">
                                                            <Clock className="size-3" />
                                                            Dipinjam
                                                        </Badge>
                                                    )}
                                                    {flagged && (
                                                        <Badge variant="destructive" className="w-fit gap-1 text-xs">
                                                            <AlertTriangle className="size-3" />
                                                            {terlambatAktif ? 'Terlambat' : 'Beda Hari'}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Arrow */}
                                            <td className="px-2 py-3">
                                                <ChevronRight className="size-4 text-muted-foreground" />
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoading && filtered.length > 0 && (
                    <div className="border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                        Menampilkan {filtered.length} dari {allTransactions.length} transaksi
                    </div>
                )}
            </div>

            {/* Detail dialog */}
            <DetailDialog
                tx={selectedTx}
                open={detailOpen}
                onOpenChange={setDetailOpen}
            />

            {/* Export confirm */}
            <ConfirmDialog
                open={confirmExport}
                onOpenChange={setConfirmExport}
                title="Export Rekap Transaksi"
                description="Unduh rekap gabungan semua transaksi (peminjaman & pengembalian) ke file .xlsx?"
                confirmLabel="Ya, Unduh"
                onConfirm={handleExport}
                loading={exporting}
            />

            {/* Export result */}
            {exportResult && (
                <ResultDialog
                    open={!!exportResult}
                    onOpenChange={(open) => { if (!open) setExportResult(null) }}
                    type={exportResult.type}
                    title={exportResult.title}
                    description={exportResult.desc}
                />
            )}
        </div>
    )
}
