import { useMemo } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { DataTable } from "../../components/data-table"
import { Header } from "../../components/header"
import { KelasFormDialog } from "./components/kelas-form-dialog"
import { buildKelasColumns } from "./components/kelas-columns"
import { useClasses } from "@/common/hooks/useClasses"
import { classesService, type ApiClass } from "@/common/api/services"
import { queryKeys } from "@/common/query/keys"

export const KelasPage = () => {
    const qc = useQueryClient()
    const { data, loading, error } = useClasses()

    const invalidate = () =>
        qc.invalidateQueries({ queryKey: queryKeys.classes.all })

    const columns = useMemo(() => buildKelasColumns(invalidate), [qc])

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <Header
                    title="Manajemen Kelas"
                    desc="Kelola data kelas dan siswa. Tambah kelas baru setiap tahun ajaran."
                />
                <KelasFormDialog mode="create" onSuccess={invalidate} />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DataTable
                columns={columns}
                data={loading ? [] : data}
                searchKey="full_name"
                searchPlaceholder="Cari kelas (contoh: 10 PPLG 1)..."
                onBulkDelete={async (rows: ApiClass[]) => {
                    const tid = toast.loading(`Menghapus ${rows.length} kelas...`)
                    let success = 0
                    for (const row of rows) {
                        try {
                            await classesService.delete(row.id)
                            success++
                        } catch {
                            /* skip — mungkin masih ada siswa */
                        }
                    }
                    invalidate()
                    toast.success(`${success} kelas berhasil dihapus`, { id: tid })
                }}
            />
        </div>
    )
}
