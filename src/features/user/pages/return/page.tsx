import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { RotateCcw, ArrowRight, Package, Search, Clock, AlertCircle, User } from "lucide-react"

import { Button } from "@/common/components/ui/button"
import { Input } from "@/common/components/ui/input"
import { UserHeader } from "../../components/header"
import { transactionsService, type ApiTransaction } from "@/common/api/services"

const formatWaktu = (waktu: string) =>
    new Date(waktu).toLocaleString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    })

const isOverdue = (dueTime: string) => new Date(dueTime) < new Date()

export function ReturnPage() {
    const navigate = useNavigate()
    const [transactions, setTransactions] = useState<ApiTransaction[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        transactionsService.getAll({ status: 'active' })
            .then(res => setTransactions(res.data))
            .catch(() => setTransactions([]))
            .finally(() => setLoading(false))
    }, [])

    const filtered = transactions.filter(tx => {
        const q = search.toLowerCase()
        if (!q) return true
        const nama = tx.student?.name?.toLowerCase() ?? ''
        const kelas = tx.student?.class
            ? `${tx.student.class.class} ${tx.student.class.major}`.toLowerCase()
            : ''
        const barang = tx.details
            ?.map(d => d.unit?.item?.name?.toLowerCase() ?? '')
            .join(' ') ?? ''
        return nama.includes(q) || kelas.includes(q) || barang.includes(q)
    })

    const handlePilih = (tx: ApiTransaction) => {
        navigate('/scan', {
            state: {
                mode: 'return',
                transaction_id: tx.id,
                student_name: tx.student?.name ?? `Transaksi #${tx.id}`,
            }
        })
    }

    return (
        <div className="flex min-h-svh flex-col bg-background px-4 py-6">
            <div className="mx-auto w-full max-w-lg space-y-5">

                {/* Header — horizontal */}
                <UserHeader
                    icon={RotateCcw}
                    title="Kembalikan Barang"
                    desc="Pilih transaksi yang ingin dikembalikan"
                    backTo="/"
                    horizontal
                    badge={!loading && transactions.length > 0 ? `${transactions.length} aktif` : undefined}
                />

                <div className="h-px bg-border" />

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama siswa, kelas, atau barang..."
                        className="pl-9 h-11"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => setSearch("")}
                        >
                            Hapus
                        </button>
                    )}
                </div>

                {/* List */}
                {loading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 rounded-xl border bg-muted/30 animate-pulse" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-16 text-center">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
                            <Package className="size-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-semibold">
                                {search ? 'Tidak ada hasil' : 'Tidak ada peminjaman aktif'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {search ? 'Coba kata kunci lain' : 'Semua barang sudah dikembalikan'}
                            </p>
                        </div>
                        {search && (
                            <Button variant="outline" size="sm" onClick={() => setSearch("")}>
                                Hapus pencarian
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {search && (
                            <p className="text-xs text-muted-foreground">
                                {filtered.length} hasil untuk &quot;{search}&quot;
                            </p>
                        )}
                        {filtered.map(tx => {
                            const barangList = tx.details
                                ?.map(d => d.unit?.item?.name)
                                .filter(Boolean)
                                .join(', ') || '-'
                            const kelas = tx.student?.class
                                ? `${tx.student.class.class} ${tx.student.class.major}`
                                : '-'
                            const overdue = isOverdue(tx.due_time)

                            return (
                                <div
                                    key={tx.id}
                                    className={[
                                        "flex items-center gap-3 rounded-xl border bg-card px-4 py-3 transition-colors hover:bg-muted/30",
                                        overdue ? "border-destructive/30 bg-destructive/5 hover:bg-destructive/10" : ""
                                    ].join(" ")}
                                >
                                    {/* Avatar */}
                                    <div className={[
                                        "flex size-10 shrink-0 items-center justify-center rounded-full",
                                        overdue ? "bg-destructive/10" : "bg-muted"
                                    ].join(" ")}>
                                        <User className={[
                                            "size-5",
                                            overdue ? "text-destructive" : "text-muted-foreground"
                                        ].join(" ")} />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold truncate">
                                                {tx.student?.name ?? '-'}
                                            </p>
                                            {overdue && (
                                                <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-medium text-destructive">
                                                    <AlertCircle className="size-2.5" />
                                                    Terlambat
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">{kelas}</p>
                                        <p className="text-xs truncate text-foreground/70">{barangList}</p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="size-3 shrink-0" />
                                            <span className={overdue ? "text-destructive font-medium" : ""}>
                                                {formatWaktu(tx.due_time)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <Button
                                        size="sm"
                                        variant={overdue ? "destructive" : "default"}
                                        className="shrink-0"
                                        onClick={() => handlePilih(tx)}
                                    >
                                        Pilih
                                        <ArrowRight className="size-3.5" />
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                )}

                <p className="text-center text-xs text-muted-foreground pb-4">
                    Pastikan data yang dipilih sudah benar sebelum melanjutkan
                </p>
            </div>
        </div>
    )
}
