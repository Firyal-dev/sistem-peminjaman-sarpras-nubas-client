import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { RotateCcw, ArrowRight, Package, Search } from "lucide-react"

import { Button } from "@/common/components/ui/button"
import { Input } from "@/common/components/ui/input"
import { Card, CardContent } from "@/common/components/ui/card"
import { UserHeader } from "../../components/header"
import { transactionsService, type ApiTransaction } from "@/common/api/services"

const formatWaktu = (waktu: string) =>
    new Date(waktu).toLocaleString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    })

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
        <div className="flex min-h-svh flex-col items-center bg-background px-4 py-10">
            <div className="w-full max-w-sm space-y-4">

                <UserHeader
                    icon={RotateCcw}
                    title="Kembalikan Barang"
                    desc="Pilih transaksi yang ingin dikembalikan"
                />

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama siswa atau barang..."
                        className="pl-9"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* List */}
                {loading ? (
                    <p className="text-center text-sm text-muted-foreground py-8">Memuat data...</p>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-12 text-center">
                        <Package className="size-12 text-muted-foreground" />
                        <p className="text-sm font-medium">
                            {search ? 'Tidak ada hasil' : 'Tidak ada peminjaman aktif'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {search ? 'Coba kata kunci lain' : 'Semua barang sudah dikembalikan'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(tx => {
                            const barangList = tx.details
                                ?.map(d => d.unit?.item?.name)
                                .filter(Boolean)
                                .join(', ') || '-'
                            const kelas = tx.student?.class
                                ? `${tx.student.class.class} ${tx.student.class.major}`
                                : '-'

                            return (
                                <Card key={tx.id}>
                                    <CardContent className="flex items-center gap-3 pt-4 pb-4">
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <p className="text-sm font-semibold truncate">
                                                {tx.student?.name ?? '-'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{kelas}</p>
                                            <p className="text-xs truncate">{barangList}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Batas: {formatWaktu(tx.due_time)}
                                            </p>
                                        </div>
                                        <Button size="sm" className="shrink-0" onClick={() => handlePilih(tx)}>
                                            Pilih
                                            <ArrowRight className="size-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}

                <p className="text-center text-xs text-muted-foreground">
                    Pastikan data yang dipilih sudah benar sebelum melanjutkan
                </p>
            </div>
        </div>
    )
}
