import { Package, PackageCheck, PackageOpen, Users } from "lucide-react"

import { Header } from "../../components/header"
import { RecentLoans } from "./components/recent-loans"
import { StatCard } from "./components/stat-card"

const stats = [
    {
        title: "Total Barang",
        value: 48,
        icon: Package,
        desc: "Seluruh barang terdaftar",
    },
    {
        title: "Sedang Dipinjam",
        value: 10,
        icon: PackageOpen,
        desc: "Barang belum dikembalikan",
    },
    {
        title: "Dikembalikan Hari Ini",
        value: 3,
        icon: PackageCheck,
        desc: "Pengembalian hari ini",
    },
    {
        title: "Total Peminjam",
        value: 24,
        icon: Users,
        desc: "Siswa yang pernah meminjam",
    },
]

export const Dashboard = () => {
    return (
        <div className="space-y-6">
            <Header
                title="Dashboard"
                desc="Ringkasan data peminjaman barang sarpras."
            />

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Recent loans */}
            <div className="space-y-3">
                <h2 className="text-base font-medium">Peminjaman Terbaru</h2>
                <RecentLoans />
            </div>
        </div>
    )
}
