import { useMemo } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { DataTable } from "../../components/data-table"
import { Header } from "../../components/header"
import { FormDialog } from "./components/form-dialog"
import { buildColumns, type Barang } from "./components/columns"
import { useItems } from "@/common/hooks/useItems"
import { itemsService, type ApiItem } from "@/common/api/services"
import { queryKeys } from "@/common/query/keys"

function toBarang(item: ApiItem): Barang {
    return {
        id: item.id,
        name: item.name,
        photo: item.photo,
        units_count: item.units_count,
        available_units_count: item.available_units_count,
    }
}

export const DaftarBarang = () => {
    const qc = useQueryClient()
    const { data, loading, error, refetch } = useItems()

    const invalidate = () => qc.invalidateQueries({ queryKey: queryKeys.items.all })

    const columns = useMemo(() => buildColumns(invalidate), [qc])
    const barangList = useMemo(() => data.map(toBarang), [data])

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <Header
                    title="Daftar Barang"
                    desc="Kelola seluruh data barang yang tersedia."
                />
                <FormDialog mode="create" onCreated={invalidate} />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DataTable
                columns={columns}
                data={loading ? [] : barangList}
                searchKey="name"
                searchPlaceholder="Cari nama barang..."
                onBulkDelete={async (rows) => {
                    const tid = toast.loading(`Menghapus ${rows.length} barang...`)
                    let success = 0
                    for (const row of rows) {
                        try { await itemsService.delete(row.id); success++ } catch { /* skip */ }
                    }
                    invalidate()
                    toast.success(`${success} barang berhasil dihapus`, { id: tid })
                }}
            />
        </div>
    )
}
