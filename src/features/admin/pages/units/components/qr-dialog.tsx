import { useState, useEffect } from "react"
import { QrCode } from "lucide-react"
import { Button } from "@/common/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/common/components/ui/dialog"
import { api } from "@/common/api/axios"

interface QrDialogProps {
    unitId: number
    qrCode: string
}

export const QrDialog = ({ unitId, qrCode }: QrDialogProps) => {
    const [open, setOpen] = useState(false)
    const [blobUrl, setBlobUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Fetch image via axios saat dialog dibuka — biar CORS header ikut
    useEffect(() => {
        if (!open) return

        let objectUrl: string | null = null
        setLoading(true)
        setError(null)
        setBlobUrl(null)

        api.get(`/units/${unitId}/qr`, { responseType: 'blob' })
            .then(res => {
                objectUrl = URL.createObjectURL(res.data)
                setBlobUrl(objectUrl)
            })
            .catch(() => setError('Gagal memuat QR code'))
            .finally(() => setLoading(false))

        // Cleanup blob URL saat dialog tutup
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl)
        }
    }, [open, unitId])

    const handleDownload = () => {
        if (!blobUrl) return
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = `${qrCode}.png`
        a.click()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <QrCode className="size-4" />
                    QR
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xs">
                <DialogHeader>
                    <DialogTitle>QR Code Unit</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-2">
                    <div className="flex size-56 items-center justify-center rounded-lg border bg-white p-2">
                        {loading && (
                            <p className="text-xs text-muted-foreground">Memuat...</p>
                        )}
                        {error && (
                            <p className="text-xs text-destructive text-center">{error}</p>
                        )}
                        {blobUrl && (
                            <img
                                src={blobUrl}
                                alt={`QR ${qrCode}`}
                                className="size-full object-contain"
                            />
                        )}
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">{qrCode}</p>
                    <Button className="w-full" onClick={handleDownload} disabled={!blobUrl}>
                        Download PNG
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
