import { CameraOff, RefreshCw } from "lucide-react"
import { Button } from "@/common/components/ui/button"

interface ScannerControlsProps {
    onStop: () => void
    onReset: () => void
}

export const ScannerControls = ({ onStop, onReset }: ScannerControlsProps) => {
    return (
        <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-2" onClick={onStop}>
                <CameraOff className="size-4" />
                Matikan Kamera
            </Button>
            <Button variant="secondary" size="icon" onClick={onReset} title="Reset kamera">
                <RefreshCw className="size-4" />
            </Button>
        </div>
    )
}
