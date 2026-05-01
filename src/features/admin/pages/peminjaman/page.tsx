import { DataTable } from "../../components/data-table"
import { Header } from "../../components/header"
import { columns, dummyData } from "./components/columns"

export const DaftarPeminjamanBarang = () => {
    return (
        <div className="space-y-6">
            <Header
                title="Barang Dipinjam"
                desc="Daftar seluruh barang yang sedang dipinjam."
            />
            <DataTable
                columns={columns}
                data={dummyData}
                searchKey="namaPeminjam"
                searchPlaceholder="Cari nama peminjam..."
                onBulkDelete={(rows) => console.log("Bulk delete:", rows)}
            />
        </div>
    )
}
