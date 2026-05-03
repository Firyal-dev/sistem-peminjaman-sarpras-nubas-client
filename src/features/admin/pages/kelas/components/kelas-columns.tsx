import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Users } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"

import { Button } from "@/common/components/ui/button"
import { Checkbox } from "@/common/components/ui/checkbox"
import { Badge } from "@/common/components/ui/badge"
import {
    DataTableDeleteAction,
    DataTableEditAction,
} from "@/features/admin/components/data-table-button-action"
import { KelasFormDialog } from "./kelas-form-dialog"
import { ResultDialog } from "@/common/components/result-dialog"
import { classesService, type ApiClass } from "@/common/api/services"

const EditCell = ({ kelas, onUpdated }: { kelas: ApiClass; onUpdated: () => void }) => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <DataTableEditAction onEdit={() => setOpen(true)} />
            <KelasFormDialog
                mode="edit"
                defaultValues={kelas}
                open={open}
                onOpenChange={setOpen}
                onSuccess={onUpdated}
            />
        </>
    )
}

const DeleteCell = ({ kelas, onDeleted }: { kelas: ApiClass; onDeleted: () => void }) => {
    const [result, setResult] = useState<{ type: "success" | "error"; msg: string } | null>(null)
    return (
        <>
            <DataTableDeleteAction
                id={kelas.id}
                description={
                    (kelas.students_count ?? 0) > 0
                        ? `Kelas ini masih memiliki ${kelas.students_count} siswa. Hapus semua siswa terlebih dahulu.`
                        : "Data kelas yang dihapus tidak dapat dikembalikan."
                }
                onDelete={async (id) => {
                    try {
                        await classesService.delete(id)
                        onDeleted()
                        setResult({ type: "success", msg: "Kelas berhasil dihapus." })
                    } catch (e: unknown) {
                        const msg =
                            (e as { response?: { data?: { message?: string } } })?.response?.data?.message
                        setResult({ type: "error", msg: msg ?? "Gagal menghapus kelas." })
                    }
                }}
            />
            {result && (
                <ResultDialog
                    open={!!result}
                    onOpenChange={(open) => { if (!open) setResult(null) }}
                    type={result.type}
                    title={result.type === "success" ? "Kelas Dihapus" : "Gagal Menghapus"}
                    description={result.msg}
                />
            )}
        </>
    )
}

const ManageSiswaCell = ({ kelas }: { kelas: ApiClass }) => {
    const navigate = useNavigate()
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/kelas/${kelas.id}/siswa`)}
        >
            <Users className="size-4 mr-1.5" />
            Kelola Siswa
            {(kelas.students_count ?? 0) > 0 && (
                <Badge variant="secondary" className="ml-1.5 text-xs">
                    {kelas.students_count}
                </Badge>
            )}
        </Button>
    )
}

export function buildKelasColumns(onRefresh: () => void): ColumnDef<ApiClass>[] {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected()
                            ? true
                            : table.getIsSomePageRowsSelected()
                                ? "indeterminate"
                                : false
                    }
                    onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                    aria-label="Pilih semua"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(v) => row.toggleSelected(!!v)}
                    aria-label="Pilih baris"
                />
            ),
            enableSorting: false,
        },
        {
            accessorKey: "full_name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nama Kelas
                    <ArrowUpDown className="size-4 ml-2" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="font-semibold">{row.original.full_name}</span>
            ),
        },
        {
            accessorKey: "grade",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tingkat
                    <ArrowUpDown className="size-4 ml-2" />
                </Button>
            ),
            cell: ({ row }) => (
                <Badge variant="outline">Kelas {row.original.grade}</Badge>
            ),
        },
        {
            accessorKey: "major",
            header: "Jurusan",
            cell: ({ row }) => row.original.major,
        },
        {
            accessorKey: "rombel",
            header: "Rombel",
            cell: ({ row }) => row.original.rombel,
        },
        {
            id: "siswa",
            header: "Siswa",
            cell: ({ row }) => <ManageSiswaCell kelas={row.original} />,
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <EditCell kelas={row.original} onUpdated={onRefresh} />
                    <DeleteCell kelas={row.original} onDeleted={onRefresh} />
                </div>
            ),
        },
    ]
}
