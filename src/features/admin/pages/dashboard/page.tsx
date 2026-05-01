import { useQueries } from "@tanstack/react-query"
import { Package, PackageCheck, PackageOpen, Users } from "lucide-react"

import { Header } from "../../components/header"
import { RecentLoans } from "./components/recent-loans"
import { StatCard } from "./components/stat-card"
import { itemsService, transactionsService, studentsService } from "@/common/api/services"
import { queryKeys } from "@/common/query/keys"

export const Dashboard = () => {
    const today = new Date().toDateString()

    const results = useQueries({
        queries: [
            {
                queryKey: queryKeys.items.all,
                queryFn: itemsService.getAll,
            },
            {
                queryKey: queryKeys.transactions.all({ status: 'active' }),
                queryFn: () => transactionsService.getAll({ status: 'active' }),
            },
            {
                queryKey: queryKeys.transactions.all({ status: 'done' }),
                queryFn: () => transactionsService.getAll({ status: 'done' }),
            },
            {
                queryKey: queryKeys.students.all,
                queryFn: () => studentsService.getAll(),
            },
        ],
    })

    const loading = results.some(r => r.isLoading)
    const [items, active, done, students] = results.map(r => r.data)

    const dikembalikanHariIni = (done as Awaited<ReturnType<typeof transactionsService.getAll>> | undefined)
        ?.data.filter(t => t.return_time && new Date(t.return_time).toDateString() === today).length ?? 0

    const stats = [
        {
            title: "Total Barang",
            value: loading ? '-' : (items as unknown[])?.length ?? 0,
            icon: Package,
            desc: "Seluruh barang terdaftar",
        },
        {
            title: "Sedang Dipinjam",
            value: loading ? '-' : (active as { total?: number } | undefined)?.total ?? 0,
            icon: PackageOpen,
            desc: "Barang belum dikembalikan",
        },
        {
            title: "Dikembalikan Hari Ini",
            value: loading ? '-' : dikembalikanHariIni,
            icon: PackageCheck,
            desc: "Pengembalian hari ini",
        },
        {
            title: "Total Siswa",
            value: loading ? '-' : (students as unknown[])?.length ?? 0,
            icon: Users,
            desc: "Siswa yang terdaftar",
        },
    ]

    return (
        <div className="space-y-6">
            <Header title="Dashboard" desc="Ringkasan data peminjaman barang sarpras." />

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            <div className="space-y-3">
                <h2 className="text-base font-medium">Peminjaman Terbaru</h2>
                <RecentLoans />
            </div>
        </div>
    )
}
