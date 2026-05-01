import { useRef, useState, useCallback, useEffect } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { ScanLine, ArrowLeft } from "lucide-react"
import { useNavigate, useLocation, Link } from "react-router"
import { toast } from "sonner"

import { Card } from "@/common/components/ui/card"
import { Button } from "@/common/components/ui/button"
import { UserHeader } from "../../components/header"
import { ScannerControls } from "./components/scanner-controls"
import { ScannerIdle } from "./components/scanner-idle"
import { ScannedList } from "./components/scanned-list"
import { scanService, transactionsService } from "@/common/api/services"

const SCANNER_ID = "custom-reader"

interface ScannedItem {
    qr_code: string
    unit_id: number
    item_name: string
}

interface BorrowState {
    mode: "borrow"
    student_id: number
    student_name: string
}

interface ReturnState {
    mode: "return"
    transaction_id: number
    student_name: string
}

type LocationState = BorrowState | ReturnState

export const ScanPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as LocationState | null
    const isReturn = state?.mode === "return"

    const [isScanning, setIsScanning] = useState(false)
    const [scannedItems, setScannedItems] = useState<ScannedItem[]>([])
    const [submitting, setSubmitting] = useState(false)

    // Map unit_id → item_name untuk mode return (dari data transaksi)
    const unitItemMapRef = useRef<Map<number, string>>(new Map())

    // Fetch transaksi saat mode return agar bisa tampilkan nama item
    useEffect(() => {
        if (state?.mode !== "return") return
        transactionsService.getOne(state.transaction_id).then(tx => {
            const map = new Map<number, string>()
            tx.details?.forEach(d => {
                if (d.unit_id && d.unit?.item?.name) {
                    map.set(d.unit_id, d.unit.item.name)
                }
            })
            unitItemMapRef.current = map
        }).catch(() => {})
    }, [])

    const scannerRef = useRef<Html5Qrcode | null>(null)
    const processingRef = useRef<Set<string>>(new Set())
    const transactionIdRef = useRef<number | null>(
        state?.mode === "return" ? state.transaction_id : null
    )

    // ── Borrow scan ───────────────────────────────────────────────────────────
    const handleBorrowScan = useCallback(async (code: string) => {
        if (processingRef.current.has(code)) return
        processingRef.current.add(code)

        if (scannedItems.some(i => i.qr_code === code)) {
            toast.warning("Barang sudah di-scan sebelumnya.")
            processingRef.current.delete(code)
            return
        }

        try {
            const res = await scanService.borrowScan(code)
            const { unit_id, qr_code, item } = res.data
            setScannedItems(prev => {
                if (prev.some(i => i.qr_code === qr_code)) return prev
                toast.success(`${item.name} ditambahkan`)
                return [...prev, { qr_code, unit_id, item_name: item.name }]
            })
        } catch (e: unknown) {
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
            toast.error(msg ?? "Gagal memvalidasi QR code.")
        } finally {
            setTimeout(() => processingRef.current.delete(code), 2000)
        }
    }, [scannedItems])

    // ── Return scan ───────────────────────────────────────────────────────────
    const handleReturnScan = useCallback(async (code: string) => {
        if (processingRef.current.has(code)) return
        processingRef.current.add(code)

        if (scannedItems.some(i => i.qr_code === code)) {
            toast.warning("Unit sudah di-scan sebelumnya.")
            processingRef.current.delete(code)
            return
        }

        try {
            const txId = transactionIdRef.current!
            const res = await scanService.returnScan(code, txId)
            const { unit_id, qr_code } = res.data
            // Ambil nama item dari map yang sudah di-fetch
            const itemName = unitItemMapRef.current.get(unit_id) ?? code
            setScannedItems(prev => {
                if (prev.some(i => i.qr_code === qr_code)) return prev
                toast.success(`${itemName} siap dikembalikan`)
                return [...prev, { qr_code, unit_id, item_name: itemName }]
            })
        } catch (e: unknown) {
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
            toast.error(msg ?? "QR code tidak valid untuk transaksi ini.")
        } finally {
            setTimeout(() => processingRef.current.delete(code), 2000)
        }
    }, [scannedItems])

    const handleScan = isReturn ? handleReturnScan : handleBorrowScan

    const handleRemove = (qrCode: string) => {
        setScannedItems(prev => prev.filter(c => c.qr_code !== qrCode))
        processingRef.current.delete(qrCode)
    }

    const stopScanner = useCallback(async () => {
        if (scannerRef.current?.isScanning) {
            await scannerRef.current.stop()
        }
        setIsScanning(false)
    }, [])

    const startScanner = async () => {
        if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode(SCANNER_ID)
        }
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
            toast.error("Gagal mengakses kamera.")
        }
    }

    const resetScanner = async () => {
        await stopScanner()
        scannerRef.current = null
        await startScanner()
    }

    // ── Submit borrow ─────────────────────────────────────────────────────────
    const handleBorrowSubmit = async () => {
        const s = state as BorrowState
        if (scannedItems.length === 0) return
        setSubmitting(true)
        const tid = toast.loading("Memproses peminjaman...")
        try {
            const dueTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                .toISOString().replace('T', ' ').substring(0, 19)
            await transactionsService.create({
                student_id: s.student_id,
                units: scannedItems.map(i => i.unit_id),
                due_time: dueTime,
            })
            toast.success(`Peminjaman berhasil! ${scannedItems.length} barang dipinjam oleh ${s.student_name}.`, { id: tid })
            await stopScanner()
            setScannedItems([])
            processingRef.current.clear()
            navigate('/')
        } catch (e: unknown) {
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
            toast.error(msg ?? "Gagal membuat transaksi.", { id: tid })
        } finally {
            setSubmitting(false)
        }
    }

    // ── Submit return ─────────────────────────────────────────────────────────
    const handleReturnSubmit = async () => {
        const s = state as ReturnState
        if (scannedItems.length === 0) return
        setSubmitting(true)
        const tid = toast.loading("Memproses pengembalian...")
        try {
            await transactionsService.processReturn(
                s.transaction_id,
                scannedItems.map(i => i.unit_id)
            )
            toast.success(`${scannedItems.length} barang berhasil dikembalikan oleh ${s.student_name}.`, { id: tid })
            await stopScanner()
            setScannedItems([])
            processingRef.current.clear()
            navigate('/')
        } catch (e: unknown) {
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
            toast.error(msg ?? "Gagal memproses pengembalian.", { id: tid })
        } finally {
            setSubmitting(false)
        }
    }

    const handleSubmit = isReturn ? handleReturnSubmit : handleBorrowSubmit

    // ── Guard ─────────────────────────────────────────────────────────────────
    if (!state) {
        return (
            <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
                <div className="w-full max-w-sm space-y-4 text-center">
                    <ScanLine className="mx-auto size-12 text-muted-foreground" />
                    <p className="font-medium">Akses tidak valid</p>
                    <p className="text-sm text-muted-foreground">Buka halaman ini melalui form peminjaman.</p>
                    <Button asChild className="w-full">
                        <Link to="/form"><ArrowLeft className="size-4" />Ke Form Peminjaman</Link>
                    </Button>
                </div>
            </div>
        )
    }

    const title = isReturn ? "Scan Pengembalian" : "Scan Barcode"
    const desc = isReturn ? `Kembalikan barang — ${state.student_name}` : `Peminjam: ${state.student_name}`

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-8">
            <div className="w-full max-w-sm space-y-4">
                <UserHeader icon={ScanLine} title={title} desc={desc} />

                <Card className="w-full overflow-hidden">
                    <div id={SCANNER_ID} className="size-full" />
                    {!isScanning && <ScannerIdle onStart={startScanner} />}
                </Card>

                {isScanning && (
                    <ScannerControls onStop={stopScanner} onReset={resetScanner} />
                )}

                <ScannedList
                    mode={isReturn ? "return" : "borrow"}
                    items={scannedItems.map(i => i.qr_code)}
                    itemLabels={Object.fromEntries(scannedItems.map(i => [i.qr_code, i.item_name]))}
                    onRemove={handleRemove}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                />

                <p className="text-center text-xs text-muted-foreground">
                    Pastikan barcode berada di tengah dan pencahayaan cukup
                </p>
            </div>
        </div>
    )
}
