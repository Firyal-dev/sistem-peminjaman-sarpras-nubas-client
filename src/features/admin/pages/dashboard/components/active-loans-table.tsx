import { useNavigate } from "react-router"
import { AlertTriangle, Clock, ChevronRight } from "lucide-react"
import { Badge } from "@/common/components/ui/badge"
import { Button } from "@/common/components/ui/button"
import { useTransactions } from "@/common/hooks/useTransactions"
import { isTerlambatAktif } from "../../rekap/utils/waktu"

const formatJam = (waktu: string) =>
    new Date(waktu).toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit" })

const formatTanggal = (waktu: string) =>
    new Date(waktu).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })

export const ActiveLoansTable = () => {
    const navigate = useNavigate()
    const { data, loading } = useTransactions({ status: 'active' })
    const loans = data?.data ?? []

    // Urutkan: terlambat dulu, lalu by borrow_time terbaru
    const sorted = [...loans].sort((a, b) => {
        const aLate = isTerlambatAktif(a.due_time) ? 1 : 0
        const bLate = isTerlambatAktif(b.due_time) ? 1 : 0
        if (bLate !== aLate) return bLate - aLate
        return new Date(b.borrow_time).getTime() - new Date(a.borrow_time).getTime()
    })

    if (loading) {
        return (
            <div className="space-y-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 rounded-xl border bg-muted/30 animate-pulse" />
                ))}
            </div>
        )
    }

    if (sorted.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-10 text-center">
                <Clock className="size-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Tidak ada peminjaman aktif saat ini.</p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b bg-muted/50">
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Peminjam</th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Barang</th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Dipinjam</th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Batas</th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-2.5 w-8" />
                    </tr>
                </thead>
                <tbody>
                    {sorted.slice(0, 8).map(loan => {
                        const terlambat = isTerlambatAktif(loan.due_time)
                        const kelas = loan.student?.class?.full_name ?? '-'
                        const barangNames = [...new Map(
                            (loan.details ?? [])
                                .filter(d => d.unit?.item)
                                .map(d => [d.unit.item.id, d.unit.item.name])
                        ).values()]

                        return (
                            <tr
                                key={loan.id}
                                className={[
                                    "border-b last:border-0 cursor-pointer transition-colors",
                                    terlambat ? "bg-destructive/5 hover:bg-destructive/10" : "hover:bg-muted/40"
                                ].join(" ")}
                                onClick={() => navigate('/admin/dipinjam')}
                            >
                                <td className="px-4 py-3">
                                    <p className="font-medium">{loan.student?.name ?? '-'}</p>
                                    <p className="text-xs text-muted-foreground">{kelas}</p>
                                </td>
                                <td className="px-4 py-3 max-w-[160px]">
                                    {barangNames.length === 0 ? (
                                        <span className="text-muted-foreground">-</span>
                                    ) : barangNames.length === 1 ? (
                                        <span>{barangNames[0]}</span>
                                    ) : (
                                        <span>
                                            {barangNames[0]}
                                            <span className="ml-1 text-xs text-muted-foreground">
                                                +{barangNames.length - 1}
                                            </span>
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <p className="font-medium tabular-nums">{formatJam(loan.borrow_time)}</p>
                                    <p className="text-xs text-muted-foreground">{formatTanggal(loan.borrow_time)}</p>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <p className={["text-xs tabular-nums", terlambat ? "text-destructive font-semibold" : "text-muted-foreground"].join(" ")}>
                                        {formatJam(loan.due_time)}
                                    </p>
                                    <p className={["text-xs", terlambat ? "text-destructive" : "text-muted-foreground"].join(" ")}>
                                        {formatTanggal(loan.due_time)}
                                    </p>
                                </td>
                                <td className="px-4 py-3">
                                    {terlambat ? (
                                        <Badge variant="destructive" className="gap-1 text-xs">
                                            <AlertTriangle className="size-3" /> Terlambat
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="gap-1 text-xs bg-blue-100 text-blue-700 border-blue-200">
                                            <Clock className="size-3" /> Aktif
                                        </Badge>
                                    )}
                                </td>
                                <td className="px-2 py-3">
                                    <ChevronRight className="size-4 text-muted-foreground" />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {sorted.length > 8 && (
                <div className="border-t bg-muted/30 px-4 py-2 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">+{sorted.length - 8} peminjaman lainnya</p>
                    <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => navigate('/admin/dipinjam')}>
                        Lihat semua
                    </Button>
                </div>
            )}
        </div>
    )
}
