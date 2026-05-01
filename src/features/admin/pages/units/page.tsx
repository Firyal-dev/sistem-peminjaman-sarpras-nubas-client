import { useParams, useNavigate } from "react-router"
import { useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/common/components/ui/button"
import { Header } from "../../components/header"
import { GenerateDialog } from "./components/generate-dialog"
import { QrDialog } from "./components/qr-dialog"
import { DataTableDeleteAction } from "../../components/data-table-button-action"
import { useItem } from "@/common/hooks/useItems"
import { useUnits } from "@/common/hooks/useUnits"
import { unitsService } from "@/common/api/services"
import { queryKeys } from "@/common/query/keys"

export const UnitPage = () => {
    const { itemId } = useParams<{ itemId: string }>()
    const navigate = useNavigate()
    const qc = useQueryClient()
    const id = Number(itemId)

    const { data: item, isLoading: loadingItem } = useItem(id)
    const { data: units = [], isLoading: loadingUnits, error } = useUnits(id)

    const invalidate = () => {
        qc.invalidateQueries({ queryKey: queryKeys.units.byItem(id) })
        qc.invalidateQueries({ queryKey: queryKeys.items.all })  // update unit counts
    }

    const handleDelete = async (unitId: number) => {
        try {
            await unitsService.delete(unitId)
            invalidate()
            toast.success('Unit berhasil dihapus')
        } catch (e: unknown) {
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
            toast.error(msg ?? 'Gagal menghapus unit')
        }
    }

    const loading = loadingItem || loadingUnits
    const availableCount = units.filter(u => u.status === 'available').length
    const borrowedCount = units.filter(u => u.status === 'borrowed').length

    return (
        <div className="space-y-6">
            <div className="flex items-start gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/barang')}>
                    <ArrowLeft className="size-4" />
                </Button>
                <div className="flex-1">
                    <Header
                        title={item ? `Unit — ${item.name}` : 'Kelola Unit'}
                        desc="Daftar semua unit beserta QR code masing-masing."
                    />
                </div>
                {item && (
                    <GenerateDialog itemId={id} itemName={item.name} onGenerated={invalidate} />
                )}
            </div>

            {!loading && units.length > 0 && (
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="size-4 text-green-500" />
                        <span>{availableCount} tersedia</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <XCircle className="size-4 text-destructive" />
                        <span>{borrowedCount} dipinjam</span>
                    </div>
                    <span className="text-muted-foreground">/ {units.length} total</span>
                </div>
            )}

            {error && <p className="text-sm text-destructive">Gagal memuat data unit</p>}

            {loading ? (
                <div className="text-sm text-muted-foreground">Memuat data...</div>
            ) : units.length === 0 ? (
                <div className="rounded-lg border border-dashed p-10 text-center">
                    <p className="text-sm text-muted-foreground">Belum ada unit.</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Klik "Generate Unit" untuk menambahkan unit baru.
                    </p>
                </div>
            ) : (
                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">No</th>
                                <th className="px-4 py-3 text-left font-medium">QR Code</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-left font-medium">QR Image</th>
                                <th className="px-4 py-3 text-left font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {units.map((unit, i) => (
                                <tr key={unit.id} className="border-b last:border-0 hover:bg-muted/30">
                                    <td className="px-4 py-3 font-mono text-muted-foreground">{i + 1}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{unit.qr_code}</td>
                                    <td className="px-4 py-3">
                                        {unit.status === 'available' ? (
                                            <span className="inline-flex items-center gap-1.5 text-green-600">
                                                <CheckCircle2 className="size-3.5" /> Tersedia
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-destructive">
                                                <XCircle className="size-3.5" /> Dipinjam
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <QrDialog unitId={unit.id} qrCode={unit.qr_code} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <DataTableDeleteAction
                                            id={unit.id}
                                            onDelete={handleDelete}
                                            description={
                                                unit.status === 'borrowed'
                                                    ? 'Unit ini sedang dipinjam dan tidak bisa dihapus.'
                                                    : 'Unit yang dihapus tidak dapat dikembalikan.'
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
