/**
 * ResultDialog — Dialog untuk menampilkan hasil aksi (sukses / error).
 * Tidak ada tombol cancel, hanya tombol tutup / aksi lanjutan.
 */
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/common/components/ui/dialog"
import { Button } from "@/common/components/ui/button"
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import type { ReactNode } from "react"

type ResultType = "success" | "error" | "warning"

interface ResultDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    type?: ResultType
    title: string
    description?: string
    /** Konten tambahan di bawah description */
    children?: ReactNode
    /** Label tombol utama, default "Tutup" */
    actionLabel?: string
    onAction?: () => void
}

const icons: Record<ResultType, ReactNode> = {
    success: <CheckCircle2 className="size-8 text-green-500" />,
    error: <XCircle className="size-8 text-destructive" />,
    warning: <AlertTriangle className="size-8 text-yellow-500" />,
}

export const ResultDialog = ({
    open,
    onOpenChange,
    type = "success",
    title,
    description,
    children,
    actionLabel = "Tutup",
    onAction,
}: ResultDialogProps) => {
    const handleAction = () => {
        onAction?.()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className="sm:max-w-sm">
                <DialogHeader>
                    <div className="flex flex-col items-center gap-3 text-center">
                        {icons[type]}
                        <DialogTitle className="text-base">{title}</DialogTitle>
                        {description && (
                            <DialogDescription className="text-center">
                                {description}
                            </DialogDescription>
                        )}
                    </div>
                </DialogHeader>
                {children && (
                    <div className="text-sm text-muted-foreground">{children}</div>
                )}
                <DialogFooter className="sm:justify-center">
                    <Button onClick={handleAction} className="w-full sm:w-auto">
                        {actionLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
