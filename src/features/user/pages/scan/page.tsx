import { useEffect, useRef, useState, useCallback } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { ScanLine } from "lucide-react"
import { useNavigate } from "react-router"

import { Card } from "@/common/components/ui/card"
import { UserHeader } from "../../components/header"
import { ScannerControls } from "./components/scanner-controls"
import { ScannerIdle } from "./components/scanner-idle"
import { ScannedList } from "./components/scanned-list"
import { ScanToast } from "./components/scan-toast"

const TOAST_DURATION = 2000

export const ScanPage = () => {
    const navigate = useNavigate()
    const [isScanning, setIsScanning] = useState(false)
    const [scannedItems, setScannedItems] = useState<string[]>([])
    const [toast, setToast] = useState<{ message: string; type: "success" | "warning" } | null>(null)
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

    const showToast = (message: string, type: "success" | "warning") => {
        setToast({ message, type })
        setTimeout(() => setToast(null), TOAST_DURATION)
    }

    const handleScan = useCallback((code: string) => {
        setScannedItems((prev) => {
            if (prev.includes(code)) {
                showToast("Barang sudah di-scan sebelumnya.", "warning")
                return prev
            }
            showToast("Barang berhasil ditambahkan.", "success")
            return [...prev, code]
        })
    }, [])

    const handleRemove = (code: string) => {
        setScannedItems((prev) => prev.filter((c) => c !== code))
    }

    const handleSubmit = async () => {
        // TODO: kirim ke backend
        console.log("Submit:", scannedItems)
        setScannedItems([])
        await stopScanner()
        navigate('/')
    }

    const startScanner = async () => {
        if (!scannerRef.current) return
        setIsScanning(true)
        try {
            await scannerRef.current.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                handleScan,
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
        <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-8">
            <div className="w-full max-w-sm space-y-4">
                <UserHeader
                    icon={ScanLine}
                    title="Scan Barcode"
                    desc="Scan semua barang yang ingin dipinjam"
                />

                <Card className="w-full overflow-hidden">
                    <div id={scannerId} className="size-full" />
                    {!isScanning && <ScannerIdle onStart={startScanner} />}
                </Card>

                {isScanning && (
                    <ScannerControls onStop={stopScanner} onReset={resetScanner} />
                )}

                <ScanToast message={toast?.message ?? null} type={toast?.type ?? null} />

                <ScannedList
                    items={scannedItems}
                    onRemove={handleRemove}
                    onSubmit={handleSubmit}
                />

                <p className="text-center text-xs text-muted-foreground">
                    Pastikan barcode berada di tengah dan pencahayaan cukup
                </p>
            </div>
        </div>
    )
}
