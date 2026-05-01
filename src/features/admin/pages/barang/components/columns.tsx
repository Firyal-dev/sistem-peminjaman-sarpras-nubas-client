import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, QrCode } from "lucide-react"
import { useState } from "react"

import { Button } from "@/common/components/ui/button"
import { Checkbox } from "@/common/components/ui/checkbox"
import { DataTableDeleteAction, DataTableEditAction } from "@/features/admin/components/data-table-button-action"
import { FormDialog } from "./form-dialog"

export interface Barang {
    id: number
    nama: string
}

export const dummyData: Barang[] = [
    { id: 1, nama: "Proyektor Epson" },
    { id: 2, nama: "Laptop Lenovo" },
    { id: 3, nama: "Kursi Lipat" },
    { id: 4, nama: "Meja Panjang" },
    { id: 5, nama: "Microphone Wireless" },
    { id: 6, nama: "Speaker Aktif" },
    { id: 7, nama: "Kamera DSLR" },
    { id: 8, nama: "Tripod Kamera" },
    { id: 9, nama: "Layar Proyektor" },
    { id: 10, nama: "Whiteboard" },
    { id: 11, nama: "Spidol Whiteboard" },
    { id: 12, nama: "Penghapus Whiteboard" },
]

// Cell component for edit action — needs local state for dialog open
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
        enableColumnFilter: false,
    },
    {
        accessorKey: "id",
        header: "No",
        cell: ({ row }) => (
            <div className="w-[40px] font-mono">{row.getValue("id")}</div>
        ),
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
                <ArrowUpDown className="size-4" />
            </Button>
        ),
    },
    {
        id: "qr",
        header: () => (
            <Button size="sm" variant="outline">
                <QrCode className="size-4" />
                Generate Semua QR Code
            </Button>
        ),
        cell: ({ row }) => (
            <Button
                size="sm"
                variant="outline"
                onClick={() => console.log("Generate QR:", row.original)}
            >
                <QrCode className="size-4" />
                Generate QR Code
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
