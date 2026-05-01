import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/common/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/common/components/ui/dialog"
import { Input } from "@/common/components/ui/input"
import { Label } from "@/common/components/ui/label"

interface Barang {
    id: number
    nama: string
}

// Create mode
interface CreateFormDialogProps {
    mode: "create"
    onSubmit: (data: Omit<Barang, "id">) => void
}

// Edit mode
interface EditFormDialogProps {
    mode: "edit"
    defaultValues: Barang
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: Barang) => void
}

type FormDialogProps = CreateFormDialogProps | EditFormDialogProps

export const FormDialog = (props: FormDialogProps) => {
    const isEdit = props.mode === "edit"

    const [open, setOpen] = useState(false)
    const [nama, setNama] = useState("")
    const [photo, setPhoto] = useState("")

    useEffect(() => {
        if (isEdit && props.open) {
            setNama(props.defaultValues.nama)
        }
    }, [isEdit && props.open])

    const handleOpenChange = (value: boolean) => {
        if (isEdit) {
            props.onOpenChange(value)
        } else {
            setOpen(value)
        }
        if (!value) setNama("")
    }

    const handleSubmit = () => {
        if (!nama.trim()) return
        if (isEdit) {
            props.onSubmit({ id: props.defaultValues.id, nama })
            props.onOpenChange(false)
        } else {
            props.onSubmit({ nama })
            setOpen(false)
        }
        setNama("")
    }

    const isOpen = isEdit ? props.open : open

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            {/* Trigger only shown in create mode */}
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
                        <Label htmlFor="foto-barang">Foto Barang</Label>
                        <Input
                            id="foto-barang"
                            placeholder="Masukkan foto barang"
                            value={photo}
                            onChange={(e) => setPhoto(e.target.value)}
                            type="file"
                            accept="image/png, image/jpg, image/jpeg"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>Simpan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
