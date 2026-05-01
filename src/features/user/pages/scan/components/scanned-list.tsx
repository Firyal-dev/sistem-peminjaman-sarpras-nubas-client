import { X } from "lucide-react"
import { Button } from "@/common/components/ui/button"

interface ScannedListProps {
    mode?: "borrow" | "return"
    items: string[]
    itemLabels?: Record<string, string>
    onRemove: (code: string) => void
    onSubmit: () => void
    submitting?: boolean
    submitLabel?: string
}

export const ScannedList = ({
    mode = "borrow",
    items,
    itemLabels,
    onRemove,
    onSubmit,
    submitting,
    submitLabel,
}: ScannedListProps) => {
    if (items.length === 0) return null

    const label = submitLabel ?? (mode === "return" ? "Kembalikan" : "Pinjam")

    return (
        <div className="space-y-3">
            <p className="text-sm font-medium">
                {mode === "return" ? "Barang dikembalikan" : "Barang dipilih"}
                <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {items.length}
                </span>
            </p>

            <div className="space-y-2">
                {items.map((code, index) => (
                    <div
                        key={code}
                        className="flex items-center justify-between rounded-lg border bg-card px-3 py-2"
                    >
                        <div className="flex items-center gap-3">
                            <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                {index + 1}
                            </span>
                            {/* Tampilkan nama item saja — sembunyikan QR code dari user */}
                            <span className="text-sm font-medium">
                                {itemLabels?.[code] && itemLabels[code] !== code
                                    ? itemLabels[code]
                                    : code
                                }
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground hover:text-destructive"
                            onClick={() => onRemove(code)}
                            disabled={submitting}
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                ))}
            </div>

            <Button className="w-full" onClick={onSubmit} disabled={submitting}>
                {submitting ? "Memproses..." : `${label} ${items.length} Barang`}
            </Button>
        </div>
    )
}
