import { useRef, useState, useCallback, useEffect } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { ScanLine, ArrowLeft, CheckCircle2, Package } from "lucide-react"
import { useNavigate, useLocation, Link } from "react-router"
import { toast } from "sonner"

import { Card } from "@/common/components/ui/card"
import { Button } from "@/common/components/ui/button"
import { UserHeader } from "../../components/header"
import { ScannerControls } from "./components/scanner-controls"
import { ScannerIdle } from "./components/scanner-idle"
import { ScannedList } from "./components/scanned-list"
import { ConfirmDialog } from "@/common/components/confirm-dialog"
import { ResultDialog } from "@/common/components/result-dialog"
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

    // Dialog states
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [resultOpen, setResultOpen] = useState(false)
    const [resultData, setResultData] = useState<{
        type: "success" | "error"
        title: string
        desc: string
    } | null>(null)

    const unitItemMapRef = useRef<Map<number, string>>(new Map())

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

    // ── Submit — buka confirm dialog dulu ─────────────────────────────────────
    const handleSubmitClick = () => {
        if (scannedItems.length === 0) return
        setConfirmOpen(true)
    }

    // ── Submit borrow ─────────────────────────────────────────────────────────
    const handleBorrowSubmit = async () => {
        const s = state as BorrowState
        setSubmitting(true)
        try {
            const dueTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                .toISOString().replace('T', ' ').substring(0, 19)
            await transactionsService.create({
                student_id: s.student_id,
                units: scannedItems.map(i => i.unit_id),
                due_time: dueTime,
            })
            await stopScanner()
            setResultData({
                type: "success",
                title: "Peminjaman Berhasil!",
                desc: `${scannedItems.length} barang berhasil dipinjam oleh ${s.student_name}.`,
            })
            setScannedItems([])
            processingRef.current.clear()
            setResultOpen(true)
        } catch (e: unknown) {
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
            setResultData({
                type: "error",
                title: "Peminjaman Gagal",
                desc: msg ?? "Terjadi kesalahan saat membuat transaksi.",
            })
            setResultOpen(true)
        } finally {
            setSubmitting(false)
        }
    }

    // ── Submit return ─────────────────────────────────────────────────────────
    const handleReturnSubmit = async () => {
        const s = state as ReturnState
        setSubmitting(true)
        try {
            await transactionsService.processReturn(
                s.transaction_id,
                scannedItems.map(i => i.unit_id)
            )
            await stopScanner()
            setResultData({
                type: "success",
                title: "Pengembalian Berhasil!",
                desc: `${scannedItems.length} barang berhasil dikembalikan oleh ${s.student_name}.`,
            })
            setScannedItems([])
            processingRef.current.clear()
            setResultOpen(true)
        } catch (e: unknown) {
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
            setResultData({
                type: "error",
                title: "Pengembalian Gagal",
                desc: msg ?? "Terjadi kesalahan saat memproses pengembalian.",
            })
            setResultOpen(true)
        } finally {
            setSubmitting(false)
        }
    }

    const handleConfirmed = () => {
        setConfirmOpen(false)
        if (isReturn) handleReturnSubmit()
        else handleBorrowSubmit()
    }

    // ── Guard ─────────────────────────────────────────────────────────────────
    if (!state) {
        return (
            <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
                <div className="w-full max-w-sm space-y-4 text-center">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-muted">
                        <ScanLine className="size-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-semibold">Akses tidak valid</p>
                        <p className="text-sm text-muted-foreground">
                            Buka halaman ini melalui form peminjaman.
                        </p>
                    </div>
                    <Button asChild className="w-full gap-2">
                        <Link to="/form">
                            <ArrowLeft className="size-4" />
                            Ke Form Peminjaman
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    const title = isReturn ? "Scan Pengembalian" : "Scan Peminjaman"
    const confirmDesc = isReturn
        ? `Kembalikan ${scannedItems.length} barang atas nama ${state.student_name}?`
        : `Pinjamkan ${scannedItems.length} barang untuk ${state.student_name}?`

    return (
        <div className="flex min-h-svh flex-col bg-background px-4 py-6">
            <div className="mx-auto w-full max-w-3xl space-y-5">

                {/* Header */}
                <UserHeader
                    icon={ScanLine}
                    title={title}
                    desc={state.student_name}
                    backTo={isReturn ? "/return" : "/form"}
                    horizontal
                    badge={isReturn ? "Pengembalian" : "Peminjaman"}
                />

                <div className="h-px bg-border" />

                {/* Split layout */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    {/* Kiri — kamera */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Kamera
                            </p>
                            {isScanning && (
                                <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                                    <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                                    Aktif
                                </span>
                            )}
                        </div>

                        <Card className="overflow-hidden">
                            <div id={SCANNER_ID} className="size-full" />
                            {!isScanning && <ScannerIdle onStart={startScanner} />}
                        </Card>

                        {isScanning && (
                            <ScannerControls onStop={stopScanner} onReset={resetScanner} />
                        )}

                        <p className="text-xs text-muted-foreground text-center">
                            Arahkan kamera ke QR code barang
                        </p>
                    </div>

                    {/* Kanan — list */}
                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Barang {isReturn ? "dikembalikan" : "dipinjam"}
                        </p>

                        {scannedItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/20 py-12 text-center">
                                <ScanLine className="size-8 text-muted-foreground/50" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Belum ada barang
                                    </p>
                                    <p className="text-xs text-muted-foreground/70">
                                        Scan QR code untuk menambahkan
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <ScannedList
                                mode={isReturn ? "return" : "borrow"}
                                items={scannedItems.map(i => i.qr_code)}
                                itemLabels={Object.fromEntries(scannedItems.map(i => [i.qr_code, i.item_name]))}
                                onRemove={handleRemove}
                                onSubmit={handleSubmitClick}
                                submitting={submitting}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Confirm dialog */}
            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title={isReturn ? "Konfirmasi Pengembalian" : "Konfirmasi Peminjaman"}
                description={confirmDesc}
                confirmLabel={isReturn ? "Ya, Kembalikan" : "Ya, Pinjamkan"}
                onConfirm={handleConfirmed}
                loading={submitting}
            />

            {/* Result dialog */}
            {resultData && (
                <ResultDialog
                    open={resultOpen}
                    onOpenChange={setResultOpen}
                    type={resultData.type}
                    title={resultData.title}
                    description={resultData.desc}
                    actionLabel={resultData.type === "success" ? "Kembali ke Beranda" : "Tutup"}
                    onAction={() => {
                        if (resultData.type === "success") navigate('/')
                    }}
                >
                    {resultData.type === "success" && scannedItems.length === 0 && (
                        <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-green-700">
                            <CheckCircle2 className="size-4 shrink-0" />
                            <span className="text-xs">Transaksi telah dicatat</span>
                        </div>
                    )}
                    {resultData.type === "success" && (
                        <div className="flex items-center justify-center gap-2 rounded-lg bg-muted px-3 py-2">
                            <Package className="size-4 shrink-0 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                                {isReturn ? "Barang telah dikembalikan" : "Barang siap digunakan"}
                            </span>
                        </div>
                    )}
                </ResultDialog>
            )}
        </div>
    )
}
