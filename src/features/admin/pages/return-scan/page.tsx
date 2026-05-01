import { useRef, useState, useCallback } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { ScanLine, CheckCircle2, XCircle, RotateCcw } from "lucide-react"

import { Header } from "../../components/header"
import { Card, CardContent } from "@/common/components/ui/card"
import { Button } from "@/common/components/ui/button"
import { Input } from "@/common/components/ui/input"
import { Label } from "@/common/components/ui/label"
import { ScanToast } from "@/features/user/pages/scan/components/scan-toast"
import { scanService, transactionsService, type ApiTransaction } from "@/common/api/services"

const TOAST_DURATION = 2500
const SCANNER_ID = "return-scanner"

interface ReturnedUnit {
    unit_id: number
    qr_code: string
    item_name: string
}

export const ReturnScanPage = () => {
    // ── Step 1: cari transaksi ────────────────────────────────────────────────
    const [txInput, setTxInput] = useState("")
    const [transaction, setTransaction] = useState<ApiTransaction | null>(null)
    const [loadingTx, setLoadingTx] = useState(false)
    const [txError, setTxError] = useState<string | null>(null)

    // ── Step 2: scan ──────────────────────────────────────────────────────────
    const [isScanning, setIsScanning] = useState(false)
    const [returnedUnits, setReturnedUnits] = useState<ReturnedUnit[]>([])
    const [toast, setToast] = useState<{ message: string; type: "success" | "warning" } | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const scannerRef = useRef<Html5Qrcode | null>(null)
    const processingRef = useRef<Set<string>>(new Set())
    const txRef = useRef<ApiTransaction | null>(null)
    txRef.current = transaction

    const showToast = useCallback((message: string, type: "success" | "warning") => {
        setToast({ message, type })
        setTimeout(() => setToast(null), TOAST_DURATION)
    }, [])

    // ── Cari transaksi ────────────────────────────────────────────────────────
    const handleCari = async () => {
        const id = Number(txInput)
        if (!id) return
        setLoadingTx(true)
        setTxError(null)
        try {
            const tx = await transactionsService.getOne(id)
            if (tx.status === 'done') {
                setTxError('Transaksi ini sudah selesai.')
                return
            }
            setTransaction(tx)
            setReturnedUnits([])
            processingRef.current.clear()
        } catch {
            setTxError('Transaksi tidak ditemukan.')
        } finally {
            setLoadingTx(false)
        }
    }

    // ── Scan handler ──────────────────────────────────────────────────────────
    const handleScan = useCallback(async (code: string) => {
        if (processingRef.current.has(code)) return
        processingRef.current.add(code)

        setReturnedUnits(prev => {
            if (prev.some(u => u.qr_code === code)) {
                showToast("Unit sudah di-scan sebelumnya.", "warning")
                return prev
            }
            return prev
        })

        try {
            const txId = txRef.current?.id
            if (!txId) return
            const res = await scanService.returnScan(code, txId)
            const { unit_id, qr_code } = res.data
            setReturnedUnits(prev => {
                if (prev.some(u => u.qr_code === qr_code)) return prev
                showToast("Unit siap dikembalikan.", "success")
                return [...prev, { unit_id, qr_code, item_name: qr_code }]
            })
        } catch (e: unknown) {
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
            showToast(msg ?? "QR code tidak valid untuk transaksi ini.", "warning")
        } finally {
            setTimeout(() => processingRef.current.delete(code), 2000)
        }
    }, [showToast])

    // ── Scanner controls ──────────────────────────────────────────────────────
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
        }
    }

    const stopScanner = async () => {
        if (scannerRef.current?.isScanning) {
            await scannerRef.current.stop()
        }
        setIsScanning(false)
    }

    // ── Submit return ─────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!transaction || returnedUnits.length === 0) return
        setSubmitting(true)
        try {
            await stopScanner()
            await transactionsService.processReturn(
                transaction.id,
                returnedUnits.map(u => u.unit_id)
            )
            setReturnedUnits([])
            processingRef.current.clear()
            // Refresh transaksi untuk update status
            const updated = await transactionsService.getOne(transaction.id)
            setTransaction(updated)
            showToast(
                updated.status === 'done'
                    ? 'Semua unit dikembalikan. Transaksi selesai!'
                    : `${returnedUnits.length} unit berhasil dikembalikan.`,
                "success"
            )
        } catch (e: unknown) {
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
            showToast(msg ?? "Gagal memproses pengembalian.", "warning")
        } finally {
            setSubmitting(false)
        }
    }

    const handleReset = async () => {
        await stopScanner()
        scannerRef.current = null
        setTransaction(null)
        setTxInput("")
        setReturnedUnits([])
        setTxError(null)
        processingRef.current.clear()
    }

    const stillBorrowed = transaction?.details?.filter(d => d.status === 'borrowed') ?? []

    return (
        <div className="space-y-6">
            <Header
                title="Scan Pengembalian"
                desc="Proses pengembalian barang dengan scan QR code."
            />

            {/* Step 1 — Cari transaksi */}
            {!transaction ? (
                <Card className="max-w-sm">
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="tx-id">ID Transaksi</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="tx-id"
                                    type="number"
                                    placeholder="Contoh: 1"
                                    value={txInput}
                                    onChange={(e) => setTxInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCari()}
                                />
                                <Button onClick={handleCari} disabled={loadingTx || !txInput}>
                                    {loadingTx ? "Memuat..." : "Cari"}
                                </Button>
                            </div>
                            {txError && <p className="text-sm text-destructive">{txError}</p>}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {/* Info transaksi */}
                    <Card>
                        <CardContent className="pt-4 pb-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">
                                        Transaksi #{transaction.id} — {transaction.student?.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {transaction.student?.class?.class} {transaction.student?.class?.major}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {stillBorrowed.length} unit belum dikembalikan
                                    </p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={handleReset}>
                                    <RotateCcw className="size-4 mr-1" />
                                    Ganti
                                </Button>
                            </div>

                            {/* Daftar unit */}
                            {stillBorrowed.length > 0 && (
                                <div className="mt-3 space-y-1">
                                    {stillBorrowed.map(d => {
                                        const scanned = returnedUnits.some(u => u.unit_id === d.unit_id)
                                        return (
                                            <div
                                                key={d.id}
                                                className={`flex items-center justify-between rounded-md px-3 py-1.5 text-sm ${
                                                    scanned ? 'bg-green-50 text-green-700' : 'bg-muted/50'
                                                }`}
                                            >
                                                <span className="font-mono text-xs">{d.unit?.qr_code ?? `Unit #${d.unit_id}`}</span>
                                                <span className="text-xs">{d.unit?.item?.name ?? '-'}</span>
                                                {scanned && <CheckCircle2 className="size-4 text-green-500" />}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {transaction.status === 'done' && (
                                <p className="mt-3 text-sm font-medium text-green-600">
                                    ✓ Semua unit sudah dikembalikan
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Scanner — div selalu ada di DOM saat transaction loaded */}
                    {transaction.status !== 'done' && (
                        <>
                            <Card className="overflow-hidden">
                                <div id={SCANNER_ID} className="w-full" />
                                {!isScanning && (
                                    <div className="flex flex-col items-center gap-3 py-10">
                                        <ScanLine className="size-10 text-muted-foreground" />
                                        <Button onClick={startScanner}>Nyalakan Kamera</Button>
                                    </div>
                                )}
                            </Card>

                            {isScanning && (
                                <Button variant="destructive" className="w-full" onClick={stopScanner}>
                                    Matikan Kamera
                                </Button>
                            )}
                        </>
                    )}

                    <ScanToast message={toast?.message ?? null} type={toast?.type ?? null} />

                    {returnedUnits.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium">
                                Siap dikembalikan
                                <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                    {returnedUnits.length}
                                </span>
                            </p>
                            {returnedUnits.map((u, i) => (
                                <div key={u.qr_code} className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2">
                                    <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                        {i + 1}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <XCircle
                                            className="size-4 text-muted-foreground hover:text-destructive cursor-pointer"
                                            onClick={() => {
                                                setReturnedUnits(prev => prev.filter(x => x.qr_code !== u.qr_code))
                                                processingRef.current.delete(u.qr_code)
                                            }}
                                        />
                                        <span className="font-mono text-xs text-muted-foreground">{u.qr_code}</span>
                                    </div>
                                </div>
                            ))}
                            <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
                                {submitting ? "Memproses..." : `Kembalikan ${returnedUnits.length} Unit`}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
