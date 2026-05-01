import { DataTable } from "../../components/data-table"
import { Header } from "../../components/header"
import { columns, dummyData } from "./components/columns"

export const DaftarPengembalianBarang = () => {
    return (
        <div className="space-y-6">
            <Header
                title="Barang Dikembalikan"
                desc="Daftar seluruh barang yang telah dikembalikan."
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
