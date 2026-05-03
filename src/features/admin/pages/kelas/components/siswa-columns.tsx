import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { useState } from "react"

import { Button } from "@/common/components/ui/button"
import { Checkbox } from "@/common/components/ui/checkbox"
import {
    DataTableDeleteAction,
    DataTableEditAction,
} from "@/features/admin/components/data-table-button-action"
import { SiswaFormDialog } from "./siswa-form-dialog"
import { ResultDialog } from "@/common/components/result-dialog"
import { studentsService, type ApiStudent } from "@/common/api/services"

const EditCell = ({ siswa, onUpdated }: { siswa: ApiStudent; onUpdated: () => void }) => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <DataTableEditAction onEdit={() => setOpen(true)} />
            <SiswaFormDialog
                mode="edit"
                defaultValues={siswa}
                open={open}
                onOpenChange={setOpen}
                onSuccess={onUpdated}
            />
        </>
    )
}

const DeleteCell = ({ siswa, onDeleted }: { siswa: ApiStudent; onDeleted: () => void }) => {
    const [result, setResult] = useState<{ type: "success" | "error"; msg: string } | null>(null)
    return (
        <>
            <DataTableDeleteAction
                id={siswa.id}
                description="Data siswa yang dihapus tidak dapat dikembalikan."
                onDelete={async (id) => {
                    try {
                        await studentsService.delete(id)
                        onDeleted()
                        setResult({ type: "success", msg: "Siswa berhasil dihapus." })
                    } catch (e: unknown) {
                        const msg =
                            (e as { response?: { data?: { message?: string } } })?.response?.data?.message
                        setResult({ type: "error", msg: msg ?? "Gagal menghapus siswa." })
                    }
                }}
            />
            {result && (
                <ResultDialog
                    open={!!result}
                    onOpenChange={(open) => { if (!open) setResult(null) }}
                    type={result.type}
                    title={result.type === "success" ? "Siswa Dihapus" : "Gagal Menghapus"}
                    description={result.msg}
                />
            )}
        </>
    )
}

export function buildSiswaColumns(onRefresh: () => void): ColumnDef<ApiStudent>[] {
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
            accessorKey: "nis",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    NIS
                    <ArrowUpDown className="size-4 ml-2" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="font-mono text-sm">{row.original.nis}</span>
            ),
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nama Siswa
                    <ArrowUpDown className="size-4 ml-2" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="font-medium">{row.original.name}</span>
            ),
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <EditCell siswa={row.original} onUpdated={onRefresh} />
                    <DeleteCell siswa={row.original} onDeleted={onRefresh} />
                </div>
            ),
        },
    ]
}
