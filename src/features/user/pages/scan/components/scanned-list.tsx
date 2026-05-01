import { X } from "lucide-react"
import { Button } from "@/common/components/ui/button"

interface ScannedListProps {
    items: string[]
    onRemove: (code: string) => void
    onSubmit: () => void
}

export const ScannedList = ({ items, onRemove, onSubmit }: ScannedListProps) => {
    if (items.length === 0) return null

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                    Barang dipilih
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {items.length}
                    </span>
                </p>
            </div>

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
                            <span className="text-sm font-mono">{code}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground hover:text-destructive"
                            onClick={() => onRemove(code)}
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                ))}
            </div>

            <Button className="w-full" onClick={onSubmit}>
                Pinjam {items.length} Barang
            </Button>
        </div>
    )
}
