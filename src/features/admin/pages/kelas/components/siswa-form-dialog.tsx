import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"

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
import { ResultDialog } from "@/common/components/result-dialog"
import { studentsService, type ApiStudent } from "@/common/api/services"
import { queryKeys } from "@/common/query/keys"

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateProps {
    mode?: "create"
    classId: number
    onSuccess?: () => void
}

interface EditProps {
    mode: "edit"
    defaultValues: ApiStudent
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

type SiswaFormDialogProps = CreateProps | EditProps

// ─── Component ────────────────────────────────────────────────────────────────

export const SiswaFormDialog = (props: SiswaFormDialogProps) => {
    const isEdit = props.mode === "edit"
    const qc = useQueryClient()

    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [nis, setNis] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [resultOpen, setResultOpen] = useState(false)
    const [resultMsg, setResultMsg] = useState("")

    useEffect(() => {
        if (isEdit && props.open) {
            setName(props.defaultValues.name)
            setNis(props.defaultValues.nis)
            setError(null)
        }
    }, [isEdit ? props.open : false])

    const handleOpenChange = (value: boolean) => {
        if (isEdit) props.onOpenChange(value)
        else setOpen(value)

        if (!value) {
            setName("")
            setNis("")
            setError(null)
        }
    }

    const isValid = name.trim() !== "" && nis.trim() !== ""

    const handleSubmit = async () => {
        if (!isValid) return
        setLoading(true)
        setError(null)

        try {
            if (isEdit) {
                await studentsService.update(props.defaultValues.id, {
                    name: name.trim(),
                    nis: nis.trim(),
                })
                props.onOpenChange(false)
                props.onSuccess()
                // Invalidate the class-specific student list
                qc.invalidateQueries({
                    queryKey: queryKeys.students.byClass(props.defaultValues.class_id),
                })
                setResultMsg(`Data siswa "${name}" berhasil diperbarui.`)
            } else {
                await studentsService.create({
                    name: name.trim(),
                    nis: nis.trim(),
                    class_id: props.classId,
                })
                setOpen(false)
                setName("")
                setNis("")
                props.onSuccess?.()
                qc.invalidateQueries({
                    queryKey: queryKeys.students.byClass(props.classId),
                })
                setResultMsg(`Siswa "${name}" berhasil ditambahkan.`)
            }

            setResultOpen(true)
        } catch (e: unknown) {
            const msg =
                (e as { response?: { data?: { message?: string } } })?.response?.data?.message
            setError(msg ?? "Gagal menyimpan data siswa.")
        } finally {
            setLoading(false)
        }
    }

    const isOpen = isEdit ? props.open : open

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                {!isEdit && (
                    <DialogTrigger asChild>
                        <Button>
                            <Plus />
                            Tambah Siswa
                        </Button>
                    </DialogTrigger>
                )}

                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{isEdit ? "Edit Siswa" : "Tambah Siswa"}</DialogTitle>
                        <DialogDescription>
                            {isEdit
                                ? "Ubah data siswa yang dipilih."
                                : "Isi form berikut untuk menambahkan siswa baru ke kelas ini."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="nis">NIS</Label>
                            <Input
                                id="nis"
                                placeholder="Contoh: 12345678"
                                value={nis}
                                onChange={(e) => setNis(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nama-siswa">Nama Lengkap</Label>
                            <Input
                                id="nama-siswa"
                                placeholder="Contoh: Budi Santoso"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            />
                        </div>

                        {error && (
                            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                {error}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button onClick={handleSubmit} disabled={loading || !isValid}>
                            {loading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ResultDialog
                open={resultOpen}
                onOpenChange={setResultOpen}
                type="success"
                title={isEdit ? "Siswa Diperbarui" : "Siswa Ditambahkan"}
                description={resultMsg}
            />
        </>
    )
}
