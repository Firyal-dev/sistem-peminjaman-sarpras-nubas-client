import { CheckCircle2, AlertTriangle } from "lucide-react"
import { useTransactions } from "@/common/hooks/useTransactions"
import { isBedaHari } from "../../rekap/utils/waktu"

const formatJam = (waktu: string) =>
    new Date(waktu).toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit" })

export const RecentReturns = () => {
    const { data, loading } = useTransactions({ status: 'done' })
    const today = new Date().toDateString()

    const todayReturns = (data?.data ?? [])
        .filter(t => t.return_time && new Date(t.return_time).toDateString() === today)
        .sort((a, b) => new Date(b.return_time!).getTime() - new Date(a.return_time!).getTime())
        .slice(0, 5)

    if (loading) {
        return (
            <div className="space-y-2">
                {[1, 2].map(i => (
                    <div key={i} className="h-12 rounded-xl border bg-muted/30 animate-pulse" />
                ))}
            </div>
        )
    }

    if (todayReturns.length === 0) {
        return (
            <div className="rounded-xl border border-dashed px-4 py-6 text-center">
                <p className="text-sm text-muted-foreground">Belum ada pengembalian hari ini.</p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {todayReturns.map(tx => {
                const bedaHari = isBedaHari(tx.borrow_time, tx.return_time)
                const barang = [...new Map(
                    (tx.details ?? [])
                        .filter(d => d.unit?.item)
                        .map(d => [d.unit.item.id, d.unit.item.name])
                ).values()].join(', ')

                return (
                    <div
                        key={tx.id}
                        className={[
                            "flex items-center gap-3 rounded-xl border px-3 py-2.5",
                            bedaHari ? "border-destructive/30 bg-destructive/5" : "bg-card"
                        ].join(" ")}
                    >
                        <div className={[
                            "flex size-7 shrink-0 items-center justify-center rounded-full",
                            bedaHari ? "bg-destructive/10" : "bg-green-500/10"
                        ].join(" ")}>
                            {bedaHari
                                ? <AlertTriangle className="size-3.5 text-destructive" />
                                : <CheckCircle2 className="size-3.5 text-green-600" />
                            }
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{tx.student?.name ?? '-'}</p>
                            <p className="text-xs text-muted-foreground truncate">{barang || '-'}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-xs font-medium tabular-nums">
                                {formatJam(tx.borrow_time)} → {formatJam(tx.return_time!)}
                            </p>
                            {bedaHari && (
                                <p className="text-[10px] text-destructive font-semibold">Beda hari</p>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
