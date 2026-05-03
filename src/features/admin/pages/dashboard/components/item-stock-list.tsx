import { useNavigate } from "react-router"
import { Package, ChevronRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { itemsService } from "@/common/api/services"
import { queryKeys } from "@/common/query/keys"

export const ItemStockList = () => {
    const navigate = useNavigate()
    const { data: items = [], isLoading } = useQuery({
        queryKey: queryKeys.items.all,
        queryFn: itemsService.getAll,
    })

    // Urutkan: stok habis dulu, lalu by paling banyak dipinjam
    const sorted = [...items].sort((a, b) => {
        const aPct = a.units_count > 0 ? a.available_units_count / a.units_count : 1
        const bPct = b.units_count > 0 ? b.available_units_count / b.units_count : 1
        return aPct - bPct
    })

    if (isLoading) {
        return (
            <div className="space-y-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 rounded-xl border bg-muted/30 animate-pulse" />
                ))}
            </div>
        )
    }

    if (sorted.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-8 text-center">
                <Package className="size-7 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Belum ada barang terdaftar.</p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border overflow-hidden">
            {sorted.map((item, i) => {
                const pct = item.units_count > 0
                    ? Math.round((item.available_units_count / item.units_count) * 100)
                    : 0
                const habis = item.available_units_count === 0
                const kritis = !habis && pct <= 30

                return (
                    <div
                        key={item.id}
                        className={[
                            "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                            i < sorted.length - 1 ? "border-b" : "",
                            habis ? "bg-destructive/5 hover:bg-destructive/10" : "hover:bg-muted/40"
                        ].join(" ")}
                        onClick={() => navigate(`/admin/barang/${item.id}/units`)}
                    >
                        {/* Icon */}
                        <div className={[
                            "flex size-8 shrink-0 items-center justify-center rounded-lg",
                            habis ? "bg-destructive/10" : kritis ? "bg-yellow-500/10" : "bg-primary/10"
                        ].join(" ")}>
                            <Package className={[
                                "size-4",
                                habis ? "text-destructive" : kritis ? "text-yellow-600" : "text-primary"
                            ].join(" ")} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                <span className={[
                                    "text-xs font-semibold shrink-0 tabular-nums",
                                    habis ? "text-destructive" : kritis ? "text-yellow-600" : "text-muted-foreground"
                                ].join(" ")}>
                                    {item.available_units_count}/{item.units_count}
                                </span>
                            </div>
                            {/* Progress bar */}
                            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                <div
                                    className={[
                                        "h-full rounded-full transition-all",
                                        habis ? "bg-destructive" : kritis ? "bg-yellow-500" : "bg-primary"
                                    ].join(" ")}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                                {habis ? "Stok habis" : kritis ? `Kritis — ${pct}% tersedia` : `${pct}% tersedia`}
                            </p>
                        </div>

                        <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                    </div>
                )
            })}
        </div>
    )
}
