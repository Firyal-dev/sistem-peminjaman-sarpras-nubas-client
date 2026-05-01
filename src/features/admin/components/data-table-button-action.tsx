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
import { Button } from "@/common/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

// Edit button — controls open state externally via callback
interface DataTableEditActionProps {
    onEdit: () => void
}

export const DataTableEditAction = ({ onEdit }: DataTableEditActionProps) => {
    return (
        <Button
            size="icon"
            variant="secondary"
            onClick={(e) => {
                e.stopPropagation()
                onEdit()
            }}
        >
            <Pencil className="size-4" />
        </Button>
    )
}

// Delete button with confirmation dialog
interface DataTableDeleteActionProps {
    id: number
    onDelete: (id: number) => void
    description?: string
}

export const DataTableDeleteAction = ({
    id,
    onDelete,
    description = "Data yang dihapus tidak dapat dikembalikan.",
}: DataTableDeleteActionProps) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    size="icon"
                    variant="destructive"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Trash2 className="size-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Data</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={() => onDelete(id)}
                    >
                        Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
