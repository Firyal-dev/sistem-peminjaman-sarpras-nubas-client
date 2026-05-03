import { useQueries } from "@tanstack/react-query"
import {
    Package, PackageOpen, PackageCheck,
    Users, AlertTriangle, BarChart3,
} from "lucide-react"
import { useNavigate } from "react-router"

import { Header } from "../../components/header"
import { Button } from "@/common/components/ui/button"
import { StatCard } from "./components/stat-card"
import { ActiveLoansTable } from "./components/active-loans-table"
import { ItemStockList } from "./components/item-stock-list"
import { RecentReturns } from "./components/recent-returns"
import { itemsService, transactionsService, studentsService } from "@/common/api/services"
import { queryKeys } from "@/common/query/keys"
import { isTerlambatAktif, isBedaHari } from "../rekap/utils/waktu"

export const Dashboard = () => {
    const navigate = useNavigate()
    const today = new Date().toDateString()

    const results = useQueries({
        queries: [
            {
                queryKey: queryKeys.items.all,
                queryFn: itemsService.getAll,
            },
            {
                queryKey: queryKeys.transactions.all({ status: 'active' }),
                queryFn: () => transactionsService.getAllFull({ status: 'active' }),
            },
            {
                queryKey: queryKeys.transactions.all({ status: 'done' }),
                queryFn: () => transactionsService.getAllFull({ status: 'done' }),
            },
            {
                queryKey: queryKeys.students.all,
                queryFn: () => studentsService.getAll(),
            },
        ],
    })

    const loading = results.some(r => r.isLoading)
    const [itemsRes, activeRes, doneRes, studentsRes] = results

    const items     = (itemsRes.data ?? []) as Awaited<ReturnType<typeof itemsService.getAll>>
    const active    = (activeRes.data?.data ?? [])
    const done      = (doneRes.data?.data ?? [])
    const students  = (studentsRes.data ?? []) as Awaited<ReturnType<typeof studentsService.getAll>>

    // Derived stats
    const totalUnits     = items.reduce((s, i) => s + i.units_count, 0)
    const availableUnits = items.reduce((s, i) => s + i.available_units_count, 0)
    const borrowedUnits  = totalUnits - availableUnits

    const terlambatCount = active.filter(t => isTerlambatAktif(t.due_time)).length

    const dikembalikanHariIni = done.filter(
        t => t.return_time && new Date(t.return_time).toDateString() === today
    ).length

    const bedaHariCount = done.filter(
        t => isBedaHari(t.borrow_time, t.return_time)
    ).length

    const val = (n: number | string) => loading ? '-' : n

    const now = new Date()
    const jamStr = now.toLocaleString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })

    return (
        <div className="space-y-6">
            <Header
                title="Dashboard"
                desc={`${jamStr} — Ringkasan sistem peminjaman sarpras.`}
                actions={
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/admin/rekap')}>
                        <BarChart3 className="size-4" />
                        Lihat Rekap
                    </Button>
                }
            />

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard
                    title="Unit Dipinjam"
                    value={val(borrowedUnits)}
                    icon={PackageOpen}
                    desc={`dari ${val(totalUnits)} total unit`}
                    variant={borrowedUnits > 0 ? "info" : "default"}
                    sub={totalUnits > 0 ? `${val(availableUnits)} unit tersedia` : undefined}
                />
                <StatCard
                    title="Terlambat"
                    value={val(terlambatCount)}
                    icon={AlertTriangle}
                    desc="Peminjaman melewati batas waktu"
                    variant={terlambatCount > 0 ? "warning" : "default"}
                />
                <StatCard
                    title="Kembali Hari Ini"
                    value={val(dikembalikanHariIni)}
                    icon={PackageCheck}
                    desc="Pengembalian hari ini"
                    variant={dikembalikanHariIni > 0 ? "success" : "default"}
                    sub={bedaHariCount > 0 ? `${bedaHariCount} pernah beda hari` : undefined}
                />
                <StatCard
                    title="Total Siswa"
                    value={val(students.length)}
                    icon={Users}
                    desc={`${val(items.length)} jenis barang terdaftar`}
                    variant="default"
                />
            </div>

            {/* ── Main content: 2 kolom ── */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Kiri — peminjaman aktif (2/3 lebar) */}
                <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold">Peminjaman Aktif</h2>
                            <p className="text-xs text-muted-foreground">
                                {loading ? '...' : `${active.length} transaksi berjalan`}
                                {terlambatCount > 0 && (
                                    <span className="ml-2 text-destructive font-medium">
                                        · {terlambatCount} terlambat
                                    </span>
                                )}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => navigate('/admin/dipinjam')}
                        >
                            Lihat semua
                        </Button>
                    </div>
                    <ActiveLoansTable />
                </div>

                {/* Kanan — stok barang + pengembalian hari ini */}
                <div className="space-y-6">

                    {/* Stok barang */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold">Stok Barang</h2>
                                <p className="text-xs text-muted-foreground">
                                    {loading ? '...' : `${items.length} jenis barang`}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-7"
                                onClick={() => navigate('/admin/barang')}
                            >
                                Kelola
                            </Button>
                        </div>
                        <ItemStockList />
                    </div>

                    {/* Pengembalian hari ini */}
                    <div className="space-y-3">
                        <div>
                            <h2 className="text-sm font-semibold">Pengembalian Hari Ini</h2>
                            <p className="text-xs text-muted-foreground">
                                {loading ? '...' : `${dikembalikanHariIni} transaksi selesai`}
                            </p>
                        </div>
                        <RecentReturns />
                    </div>

                </div>
            </div>
        </div>
    )
}
