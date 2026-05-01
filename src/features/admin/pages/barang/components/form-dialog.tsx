import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/common/components/ui/button"
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/common/components/ui/dialog"
import { Input } from "@/common/components/ui/input"
import { Label } from "@/common/components/ui/label"
import { itemsService } from "@/common/api/services"
import { queryKeys } from "@/common/query/keys"
import type { Barang } from "./columns"

// Create mode
interface CreateFormDialogProps {
    mode?: "create"
    onCreated?: () => void
}

// Edit mode
interface EditFormDialogProps {
    mode: "edit"
    defaultValues: Barang
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdated: () => void
}

type FormDialogProps = CreateFormDialogProps | EditFormDialogProps

export const FormDialog = (props: FormDialogProps) => {
    const isEdit = props.mode === "edit"
    const qc = useQueryClient()

    const [open, setOpen] = useState(false)
    const [nama, setNama] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isEdit && props.open) {
            setNama(props.defaultValues.name)
            setError(null)
        }
    }, [isEdit ? props.open : false])

    const handleOpenChange = (value: boolean) => {
        if (isEdit) {
            props.onOpenChange(value)
        } else {
            setOpen(value)
        }
        if (!value) {
            setNama("")
            setError(null)
        }
    }

    const handleSubmit = async () => {
        if (!nama.trim()) return
        setLoading(true)
        setError(null)
        try {
            if (isEdit) {
                await itemsService.update(props.defaultValues.id, { name: nama })
                props.onOpenChange(false)
                props.onUpdated()
                toast.success('Barang berhasil diperbarui')
            } else {
                await itemsService.create({ name: nama })
                setOpen(false)
                setNama("")
                props.onCreated?.()
                toast.success('Barang berhasil ditambahkan')
            }
            qc.invalidateQueries({ queryKey: queryKeys.items.all })
        } catch (e: unknown) {
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
            setError(msg ?? 'Gagal menyimpan data')
            toast.error(msg ?? 'Gagal menyimpan data')
        } finally {
            setLoading(false)
        }
    }

    const isOpen = isEdit ? props.open : open

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            {!isEdit && (
                <DialogTrigger asChild>
                    <Button>
                        <Plus />
                        Tambah Barang
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Barang" : "Tambah Barang"}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Ubah data barang yang dipilih."
                            : "Isi form berikut untuk menambahkan data barang baru."}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="nama-barang">Nama Barang</Label>
                        <Input
                            id="nama-barang"
                            placeholder="Contoh: Proyektor Epson"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            required
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={loading || !nama.trim()}>
                        {loading ? "Menyimpan..." : "Simpan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
