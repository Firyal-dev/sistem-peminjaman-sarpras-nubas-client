import { type Table } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

import { Button } from "@/common/components/ui/button"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
    const selected = table.getFilteredSelectedRowModel().rows.length
    const total = table.getFilteredRowModel().rows.length

    return (
        <div className="flex items-center justify-between px-1">
            <p className="text-sm text-muted-foreground">
                {selected > 0
                    ? `${selected} dari ${total} baris dipilih`
                    : `Total ${total} baris`}
            </p>
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronsLeft className="size-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronLeft className="size-4" />
                </Button>
                <span className="text-sm px-2">
                    {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                </span>
                <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronRight className="size-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronsRight className="size-4" />
                </Button>
            </div>
        </div>
    )
}
