import { CameraOff, RefreshCw } from "lucide-react"
import { Button } from "@/common/components/ui/button"

interface ScannerControlsProps {
    onStop: () => void
    onReset: () => void
}

export const ScannerControls = ({ onStop, onReset }: ScannerControlsProps) => {
    return (
        <div className="flex gap-2">
            <Button variant="destructive" className="flex-1" onClick={onStop}>
                <CameraOff className="size-4" />
                Matikan
            </Button>
            <Button variant="secondary" className="flex-1" onClick={onReset}>
                <RefreshCw className="size-4" />
                Reset
            </Button>
        </div>
    )
}
