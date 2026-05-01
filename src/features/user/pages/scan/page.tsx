import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { ScanLine } from "lucide-react"

import { Card } from "@/common/components/ui/card"
import { UserHeader } from "../../components/header"
import { ScannerControls } from "./components/scanner-controls"
import { ScannerIdle } from "./components/scanner-idle"

export function Scanner({ onScan }: { onScan: (decodedText: string) => void }) {
    const [isScanning, setIsScanning] = useState(false)
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const scannerId = "custom-reader"

    useEffect(() => {
        scannerRef.current = new Html5Qrcode(scannerId)
        return () => {
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop()
            }
        }
    }, [])

    const startScanner = async () => {
        if (!scannerRef.current) return
        setIsScanning(true)
        try {
            await scannerRef.current.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    onScan(decodedText)
                    stopScanner()
                },
                () => {}
            )
        } catch (err) {
            console.error("Gagal start kamera:", err)
            setIsScanning(false)
        }
    }

    const stopScanner = async () => {
        if (scannerRef.current?.isScanning) {
            await scannerRef.current.stop()
        }
        setIsScanning(false)
    }

    const resetScanner = async () => {
        await stopScanner()
        await startScanner()
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm space-y-4">
                <UserHeader
                    icon={ScanLine}
                    title="Scan Barcode"
                    desc="Arahkan kamera ke barcode barang"
                />

                <Card className="w-full overflow-hidden">
                    <div id={scannerId} className="size-full" />
                    {!isScanning && <ScannerIdle onStart={startScanner} />}
                </Card>

                {isScanning && (
                    <ScannerControls onStop={stopScanner} onReset={resetScanner} />
                )}

                <p className="text-center text-xs text-muted-foreground">
                    Pastikan barcode berada di tengah dan pencahayaan cukup
                </p>
            </div>
        </div>
    )
}
