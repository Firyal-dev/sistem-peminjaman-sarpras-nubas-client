import { X, CheckCircle2 } from "lucide-react"
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
            {/* Item list */}
            <div className="space-y-2">
                {items.map((code, index) => (
                    <div
                        key={code}
                        className="flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5"
                    >
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-[10px] font-bold text-primary">{index + 1}</span>
                        </div>
                        <span className="flex-1 min-w-0 text-sm font-medium truncate">
                            {itemLabels?.[code] && itemLabels[code] !== code
                                ? itemLabels[code]
                                : code
                            }
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => onRemove(code)}
                            disabled={submitting}
                            title="Hapus"
                        >
                            <X className="size-3.5" />
                        </Button>
                    </div>
                ))}
            </div>

            {/* Count + Submit */}
            <div className="rounded-xl border bg-muted/30 px-3 py-2.5 flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{items.length}</span> barang dipilih
                </span>
                <Button
                    size="sm"
                    onClick={onSubmit}
                    disabled={submitting}
                    className="gap-1.5 shrink-0"
                >
                    {submitting ? (
                        <>
                            <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Memproses...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="size-4" />
                            {label}
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
