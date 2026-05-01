import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/common/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/common/components/ui/dialog"
import { Input } from "@/common/components/ui/input"
import { Label } from "@/common/components/ui/label"
import { unitsService } from "@/common/api/services"

interface GenerateDialogProps {
    itemId: number
    itemName: string
    onGenerated: () => void
}

export const GenerateDialog = ({ itemId, itemName, onGenerated }: GenerateDialogProps) => {
    const [open, setOpen] = useState(false)
    const [jumlah, setJumlah] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async () => {
        if (jumlah < 1 || jumlah > 100) return
        setLoading(true)
        setError(null)
        try {
            await unitsService.generate(itemId, jumlah)
            setOpen(false)
            setJumlah(1)
            onGenerated()
            toast.success(`${jumlah} unit berhasil di-generate`)
        } catch (e: unknown) {
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
            setError(msg ?? 'Gagal generate unit')
            toast.error(msg ?? 'Gagal generate unit')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setJumlah(1); setError(null) } }}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="size-4" />
                    Generate Unit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Generate Unit Baru</DialogTitle>
                    <DialogDescription>
                        Tambah unit untuk <span className="font-medium">{itemName}</span>. Setiap unit akan mendapat QR code unik.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="jumlah">Jumlah Unit</Label>
                        <Input
                            id="jumlah"
                            type="number"
                            min={1}
                            max={100}
                            value={jumlah}
                            onChange={(e) => setJumlah(Number(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground">Maksimal 100 unit sekaligus</p>
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={loading || jumlah < 1 || jumlah > 100}>
                        {loading ? "Memproses..." : `Generate ${jumlah} Unit`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
