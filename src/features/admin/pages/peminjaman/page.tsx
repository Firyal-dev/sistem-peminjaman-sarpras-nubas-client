import { DataTable } from "../../components/data-table"
import { Header } from "../../components/header"
import { columns } from "./components/columns"
import { useTransactions } from "@/common/hooks/useTransactions"

export const DaftarPeminjamanBarang = () => {
    const { data, loading, error, refetch } = useTransactions({ status: 'active' })

    const transactions = data?.data ?? []

    return (
        <div className="space-y-6">
            <Header
                title="Barang Dipinjam"
                desc="Daftar seluruh barang yang sedang dipinjam."
            />

            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}

            <DataTable
                columns={columns}
                data={loading ? [] : transactions}
                searchKey="namaPeminjam"
                searchPlaceholder="Cari nama peminjam..."
                onBulkDelete={() => refetch()}
            />
        </div>
    )
}
