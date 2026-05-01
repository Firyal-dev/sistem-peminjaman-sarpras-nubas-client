import { DataTable } from "../../components/data-table"
import { Header } from "../../components/header"
import { columns } from "./components/columns"
import { useTransactions } from "@/common/hooks/useTransactions"

export const DaftarPengembalianBarang = () => {
    const { data, loading, error, refetch } = useTransactions({ status: 'done' })

    const transactions = data?.data ?? []

    return (
        <div className="space-y-6">
            <Header
                title="Barang Dikembalikan"
                desc="Daftar seluruh barang yang telah dikembalikan."
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
