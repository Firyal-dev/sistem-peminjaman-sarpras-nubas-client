import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, QrCode, ImageIcon, CheckCircle2, XCircle } from "lucide-react"
import { useState } from "react"

import { Button } from "@/common/components/ui/button"
import { Checkbox } from "@/common/components/ui/checkbox"
import { Badge } from "@/common/components/ui/badge"
import { DataTableDeleteAction, DataTableEditAction } from "@/features/admin/components/data-table-button-action"
import { FormDialog } from "./form-dialog"
import { ImagePhotoView } from "@/features/admin/components/photo-view"

export interface Barang {
    id: number
    nama: string
    is_available: boolean
    photo?: string | null
}

export const dummyData: Barang[] = [
    { id: 1, nama: "Proyektor Epson", is_available: true,  photo: "https://placehold.co/100" },
    { id: 2, nama: "Laptop Lenovo", is_available: false,  photo: null },
    { id: 3, nama: "Kursi Lipat", is_available: true, photo: null },
    { id: 4, nama: "Meja Panjang", is_available: true,  photo: null },
    { id: 5, nama: "Microphone Wireless", is_available: false, photo: null },
]

const EditCell = ({ barang }: { barang: Barang }) => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <DataTableEditAction onEdit={() => setOpen(true)} />
            <FormDialog
                mode="edit"
                defaultValues={barang}
                open={open}
                onOpenChange={setOpen}
                onSubmit={(data) => console.log("Edit:", data)}
            />
        </>
    )
}

export const columns: ColumnDef<Barang>[] = [
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
        accessorKey: "nama",
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
        accessorKey: "is_available",
        header: "Status",
        cell: ({ row }) => {
            const available = row.original.is_available
            return (
                <div className="flex items-center gap-2">
                    {available ? (
                        <CheckCircle2 className="size-4 text-green-500" />
                    ) : (
                        <XCircle className="size-4 text-destructive" />
                    )}
                    <span className="text-sm font-medium">
                        {available ? "Tersedia" : "Dipinjam"}
                    </span>
                </div>
            )
        },
    },
    {
        id: "qr",
        header: "QR Code",
        cell: ({ row }) => (
            <Button
                variant="outline"
                onClick={() => console.log("Generate QR:", row.original)}
            >
                Generate
                <QrCode className="size-4" />
            </Button>
        ),
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <EditCell barang={row.original} />
                <DataTableDeleteAction
                    id={row.original.id}
                    onDelete={(id) => console.log("Delete:", id)}
                />
            </div>
        ),
    },
]