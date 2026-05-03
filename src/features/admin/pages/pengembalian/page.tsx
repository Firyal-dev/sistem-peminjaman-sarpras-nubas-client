import { useState } from "react"
import { FileDown, Loader2 } from "lucide-react"

import { DataTable } from "../../components/data-table"
import { Header } from "../../components/header"
import { Button } from "@/common/components/ui/button"
import { columns } from "./components/columns"
import { useTransactions } from "@/common/hooks/useTransactions"
import { transactionsService } from "@/common/api/services"
import { ConfirmDialog } from "@/common/components/confirm-dialog"
import { ResultDialog } from "@/common/components/result-dialog"

export const DaftarPengembalianBarang = () => {
    const { data, loading, error, refetch } = useTransactions({ status: 'done' })
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [exporting, setExporting] = useState(false)
    const [result, setResult] = useState<{ type: "success" | "error"; title: string; desc: string } | null>(null)

    const transactions = data?.data ?? []

    const handleExport = async () => {
        setConfirmOpen(false)
        setExporting(true)
        try {
            await transactionsService.exportExcel('laporan-pengembalian.xlsx')
            setResult({
                type: "success",
                title: "Export Berhasil",
                desc: "File laporan-pengembalian.xlsx berhasil diunduh.",
            })
        } catch {
            setResult({
                type: "error",
                title: "Export Gagal",
                desc: "Terjadi kesalahan saat mengunduh laporan. Coba lagi.",
            })
        } finally {
            setExporting(false)
        }
    }

    return (
        <div className="space-y-6">
            <Header
                title="Barang Dikembalikan"
                desc="Daftar seluruh barang yang telah dikembalikan."
                actions={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmOpen(true)}
                        disabled={exporting}
                        className="gap-2"
                    >
                        {exporting
                            ? <Loader2 className="size-4 animate-spin" />
                            : <FileDown className="size-4" />
                        }
                        Export Excel
                    </Button>
                }
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DataTable
                columns={columns}
                data={loading ? [] : transactions}
                searchKey="namaPeminjam"
                searchPlaceholder="Cari nama peminjam..."
                onBulkDelete={() => refetch()}
            />

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Export Laporan Excel"
                description="Unduh semua data transaksi pengembalian ke file .xlsx?"
                confirmLabel="Ya, Unduh"
                onConfirm={handleExport}
                loading={exporting}
            />

            {result && (
                <ResultDialog
                    open={!!result}
                    onOpenChange={(open) => { if (!open) setResult(null) }}
                    type={result.type}
                    title={result.title}
                    description={result.desc}
                />
            )}
        </div>
    )
}
