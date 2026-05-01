import { DataTable } from "../../components/data-table"
import { Header } from "../../components/header"
import { BarangForm } from "./form"
import { dummyData, columns } from "./components/columns"

export const DaftarBarang = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <Header
                    title="Daftar Barang"
                    desc="Kelola seluruh data barang yang tersedia."
                />
                <BarangForm />
            </div>
            <DataTable
                columns={columns}
                data={dummyData}
                searchKey="nama"
                searchPlaceholder="Cari nama barang..."
                onBulkDelete={(rows) => console.log("Bulk delete:", rows)}
            />
        </div>
    )
}
