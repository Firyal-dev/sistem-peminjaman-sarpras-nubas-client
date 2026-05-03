/**
 * ConfirmDialog — AlertDialog wrapper untuk konfirmasi aksi destruktif / penting.
 * Bisa dipakai controlled (open + onOpenChange) atau uncontrolled (trigger slot).
 */
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/common/components/ui/alert-dialog"
import type { ReactNode } from "react"

interface ConfirmDialogProps {
    /** Jika ada trigger, dialog berjalan uncontrolled */
    trigger?: ReactNode
    /** Controlled mode */
    open?: boolean
    onOpenChange?: (open: boolean) => void

    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: "default" | "destructive"
    onConfirm: () => void
    loading?: boolean
}

export const ConfirmDialog = ({
    trigger,
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = "Ya, lanjutkan",
    cancelLabel = "Batal",
    variant = "default",
    onConfirm,
    loading,
}: ConfirmDialogProps) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {trigger && (
                <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            )}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction
                        variant={variant}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Memproses..." : confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
