import { ScanLine } from "lucide-react"

export const ScannerHeader = () => {
    return (
        <div className="space-y-1 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
                <ScanLine className="size-6 text-primary" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Scan Barcode</h1>
            <p className="text-sm text-muted-foreground">
                Arahkan kamera ke barcode barang
            </p>
        </div>
    )
}
