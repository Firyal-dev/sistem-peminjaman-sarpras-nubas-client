import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Layers, ImageIcon, CheckCircle2, XCircle } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

import { Button } from "@/common/components/ui/button"
import { Checkbox } from "@/common/components/ui/checkbox"
import { DataTableDeleteAction, DataTableEditAction } from "@/features/admin/components/data-table-button-action"
import { FormDialog } from "./form-dialog"
import { ImagePhotoView } from "@/features/admin/components/photo-view"

export interface Barang {
    id: number
    name: string
    available_units_count: number
    units_count: number
    photo?: string | null
}

const EditCell = ({ barang, onUpdated }: { barang: Barang; onUpdated: () => void }) => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <DataTableEditAction onEdit={() => setOpen(true)} />
            <FormDialog
                mode="edit"
                defaultValues={barang}
                open={open}
                onOpenChange={setOpen}
                onUpdated={onUpdated}
            />
        </>
    )
}

const ManageUnitsCell = ({ barang }: { barang: Barang }) => {
    const navigate = useNavigate()
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/barang/${barang.id}/units`)}
        >
            <Layers className="size-4 mr-1" />
            Kelola Unit
        </Button>
    )
}

export function buildColumns(onRefresh: () => void): ColumnDef<Barang>[] {
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
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Pilih semua"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Pilih baris"
                />
            ),
            enableSorting: false,
        },
        {
            accessorKey: "photo",
            header: "Foto",
            cell: ({ row }) => {
                const photo = row.original.photo
                return (
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                        {photo ? (
                            <ImagePhotoView src={photo} alt="Barang" className="h-full w-full object-cover rounded-md" />
                        ) : (
                            <ImageIcon className="size-5 text-muted-foreground" />
                        )}
                    </div>
                )
            },
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
                    Nama Barang
                    <ArrowUpDown className="size-4 ml-2" />
                </Button>
            ),
        },
        {
            id: "status",
            header: "Stok Unit",
            cell: ({ row }) => {
                const available = row.original.available_units_count > 0
                return (
                    <div className="flex items-center gap-2">
                        {available ? (
                            <CheckCircle2 className="size-4 text-green-500" />
                        ) : (
                            <XCircle className="size-4 text-destructive" />
                        )}
                        <span className="text-sm font-medium">
                            {available ? "Tersedia" : "Habis"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            ({row.original.available_units_count}/{row.original.units_count})
                        </span>
                    </div>
                )
            },
        },
        {
            id: "units",
            header: "Unit & QR",
            cell: ({ row }) => <ManageUnitsCell barang={row.original} />,
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <EditCell barang={row.original} onUpdated={onRefresh} />
                    <DataTableDeleteAction
                        id={row.original.id}
                        onDelete={async (id) => {
                            try {
                                await import('@/common/api/services').then(m => m.itemsService.delete(id))
                                onRefresh()
                                toast.success('Barang berhasil dihapus')
                            } catch (e: unknown) {
                                const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
                                toast.error(msg ?? 'Gagal menghapus barang')
                            }
                        }}
                    />
                </div>
            ),
        },
    ]
}
