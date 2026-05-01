import { type Table } from "@tanstack/react-table"
import { Trash2, X } from "lucide-react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/common/components/ui/alert-dialog"
import { Button } from "@/common/components/ui/button"
import { Input } from "@/common/components/ui/input"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    searchKey: string
    searchPlaceholder?: string
    onBulkDelete?: (rows: TData[]) => void
}

export function DataTableToolbar<TData>({
    table,
    searchKey,
    searchPlaceholder = "Cari...",
    onBulkDelete,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const hasSelection = selectedRows.length > 1

    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
                <Input
                    placeholder={searchPlaceholder}
                    value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                    onChange={(e) =>
                        table.getColumn(searchKey)?.setFilterValue(e.target.value)
                    }
                    className="max-w-xs"
                />
                {isFiltered && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.resetColumnFilters()}
                    >
                        <X className="size-4" />
                        Reset
                    </Button>
                )}
            </div>
            {hasSelection && onBulkDelete && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                            <Trash2 className="size-4" />
                            Hapus {selectedRows.length} Data
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus {selectedRows.length} Data</AlertDialogTitle>
                            <AlertDialogDescription>
                                {selectedRows.length} data yang dipilih akan dihapus dan tidak dapat dikembalikan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                variant="destructive"
                                onClick={() => onBulkDelete(selectedRows.map((row) => row.original))}
                            >
                                Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    )
}
