import { useMemo } from "react"
import { useParams, useNavigate } from "react-router"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

import { DataTable } from "../../components/data-table"
import { Header } from "../../components/header"
import { Button } from "@/common/components/ui/button"
import { SiswaFormDialog } from "./components/siswa-form-dialog"
import { buildSiswaColumns } from "./components/siswa-columns"
import { classesService, studentsService, type ApiStudent } from "@/common/api/services"
import { queryKeys } from "@/common/query/keys"

export const SiswaPage = () => {
    const { kelasId } = useParams<{ kelasId: string }>()
    const classId = Number(kelasId)
    const navigate = useNavigate()
    const qc = useQueryClient()

    // Fetch the class detail for the header
    const { data: kelasData } = useQuery({
        queryKey: [...queryKeys.classes.all, classId],
        queryFn: () => classesService.getOne(classId),
        enabled: !!classId,
    })

    // Fetch students for this class
    const { data: students = [], isLoading, error } = useQuery({
        queryKey: queryKeys.students.byClass(classId),
        queryFn: () => studentsService.getAll(classId),
        enabled: !!classId,
    })

    const invalidate = () =>
        qc.invalidateQueries({ queryKey: queryKeys.students.byClass(classId) })

    const columns = useMemo(() => buildSiswaColumns(invalidate), [classId])

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/admin/kelas")}
                        className="mt-0.5 shrink-0"
                    >
                        <ArrowLeft className="size-4" />
                    </Button>
                    <Header
                        title={kelasData ? `Siswa — ${kelasData.full_name}` : "Daftar Siswa"}
                        desc={`Kelola data siswa untuk kelas ini. Total: ${students.length} siswa.`}
                    />
                </div>
                <SiswaFormDialog
                    mode="create"
                    classId={classId}
                    onSuccess={invalidate}
                />
            </div>

            {error && (
                <p className="text-sm text-destructive">Gagal memuat data siswa.</p>
            )}

            <DataTable
                columns={columns}
                data={isLoading ? [] : students}
                searchKey="name"
                searchPlaceholder="Cari nama siswa..."
                onBulkDelete={async (rows: ApiStudent[]) => {
                    const tid = toast.loading(`Menghapus ${rows.length} siswa...`)
                    let success = 0
                    for (const row of rows) {
                        try {
                            await studentsService.delete(row.id)
                            success++
                        } catch {
                            /* skip */
                        }
                    }
                    invalidate()
                    toast.success(`${success} siswa berhasil dihapus`, { id: tid })
                }}
            />
        </div>
    )
}
