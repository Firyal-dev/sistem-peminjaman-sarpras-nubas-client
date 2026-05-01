import { Camera } from "lucide-react"
import { Button } from "@/common/components/ui/button"

interface ScannerIdleProps {
    onStart: () => void
}

export const ScannerIdle = ({ onStart }: ScannerIdleProps) => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="flex size-20 items-center justify-center rounded-full bg-muted">
                <Camera className="size-10 text-muted-foreground" />
            </div>
            <div className="space-y-1 text-center">
                <p className="text-sm font-medium">Kamera belum aktif</p>
                <p className="text-xs text-muted-foreground">
                    Tekan tombol di bawah untuk mulai scan
                </p>
            </div>
            <Button onClick={onStart}>
                <Camera className="size-4" />
                Nyalakan Kamera
            </Button>
        </div>
    )
}
