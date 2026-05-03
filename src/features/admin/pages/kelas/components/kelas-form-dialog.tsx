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
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/common/components/ui/combobox"
import { ResultDialog } from "@/common/components/result-dialog"
import { classesService, type ApiClass } from "@/common/api/services"
import { queryKeys } from "@/common/query/keys"

// ─── Static options ───────────────────────────────────────────────────────────

interface Option { label: string; value: string }

const gradeOptions: Option[] = [
    { label: "Kelas 10", value: "10" },
    { label: "Kelas 11", value: "11" },
    { label: "Kelas 12", value: "12" },
    { label: "Kelas 13", value: "13" },
]

const rombelOptions: Option[] = [
    { label: "Rombel 1", value: "1" },
    { label: "Rombel 2", value: "2" },
    { label: "Rombel 3", value: "3" },
    { label: "Rombel 4", value: "4" },
    { label: "Rombel 5", value: "5" },
]

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateProps {
    mode?: "create"
    onSuccess?: () => void
}

interface EditProps {
    mode: "edit"
    defaultValues: ApiClass
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

type KelasFormDialogProps = CreateProps | EditProps

// ─── Component ────────────────────────────────────────────────────────────────

export const KelasFormDialog = (props: KelasFormDialogProps) => {
    const isEdit = props.mode === "edit"
    const qc = useQueryClient()

    const [open, setOpen] = useState(false)
    const [grade, setGrade] = useState<Option | null>(null)
    const [major, setMajor] = useState("")
    const [rombel, setRombel] = useState<Option | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [resultOpen, setResultOpen] = useState(false)
    const [resultMsg, setResultMsg] = useState("")

    // Populate fields when editing
    useEffect(() => {
        if (isEdit && props.open) {
            setGrade(gradeOptions.find(o => o.value === String(props.defaultValues.grade)) ?? null)
            setMajor(props.defaultValues.major)
            setRombel(rombelOptions.find(o => o.value === String(props.defaultValues.rombel)) ?? null)
            setError(null)
        }
    }, [isEdit ? props.open : false])

    const handleOpenChange = (value: boolean) => {
        if (isEdit) props.onOpenChange(value)
        else setOpen(value)

        if (!value) {
            setGrade(null)
            setMajor("")
            setRombel(null)
            setError(null)
        }
    }

    const isValid = grade !== null && major.trim() !== "" && rombel !== null

    const handleSubmit = async () => {
        if (!isValid) return
        setLoading(true)
        setError(null)

        const payload = {
            grade: Number(grade!.value),
            major: major.trim(),
            rombel: Number(rombel!.value),
        }

        try {
            if (isEdit) {
                await classesService.update(props.defaultValues.id, payload)
                props.onOpenChange(false)
                props.onSuccess()
                setResultMsg(`Kelas "${payload.grade} ${payload.major} ${payload.rombel}" berhasil diperbarui.`)
            } else {
                await classesService.create(payload)
                setOpen(false)
                setGrade(null)
                setMajor("")
                setRombel(null)
                props.onSuccess?.()
                setResultMsg(`Kelas "${payload.grade} ${payload.major} ${payload.rombel}" berhasil ditambahkan.`)
            }

            qc.invalidateQueries({ queryKey: queryKeys.classes.all })
            setResultOpen(true)
        } catch (e: unknown) {
            const msg =
                (e as { response?: { data?: { message?: string } } })?.response?.data?.message
            setError(msg ?? "Gagal menyimpan data kelas.")
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
                            Tambah Kelas
                        </Button>
                    </DialogTrigger>
                )}

                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{isEdit ? "Edit Kelas" : "Tambah Kelas"}</DialogTitle>
                        <DialogDescription>
                            {isEdit
                                ? "Ubah data kelas yang dipilih."
                                : "Isi form berikut untuk menambahkan kelas baru."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {/* Tingkat */}
                        <div className="space-y-2">
                            <Label>Tingkat Kelas</Label>
                            <Combobox
                                key={isOpen ? "open" : "closed"}
                                items={gradeOptions}
                                itemToStringValue={(item) => item.label}
                                value={grade}
                                onValueChange={setGrade}
                            >
                                <ComboboxInput
                                    placeholder="Pilih tingkat..."
                                    showClear={!!grade}
                                />
                                <ComboboxContent>
                                    <ComboboxEmpty>Tidak ditemukan.</ComboboxEmpty>
                                    <ComboboxList>
                                        {(item) => (
                                            <ComboboxItem key={item.value} value={item}>
                                                {item.label}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </div>

                        {/* Jurusan */}
                        <div className="space-y-2">
                            <Label htmlFor="major">Jurusan</Label>
                            <Input
                                id="major"
                                placeholder="Contoh: PPLG, Farmasi, Analis Kimia"
                                value={major}
                                onChange={(e) => setMajor(e.target.value)}
                            />
                        </div>

                        {/* Rombel */}
                        <div className="space-y-2">
                            <Label>Rombel</Label>
                            <Combobox
                                key={isOpen ? "open-r" : "closed-r"}
                                items={rombelOptions}
                                itemToStringValue={(item) => item.label}
                                value={rombel}
                                onValueChange={setRombel}
                            >
                                <ComboboxInput
                                    placeholder="Pilih rombel..."
                                    showClear={!!rombel}
                                />
                                <ComboboxContent>
                                    <ComboboxEmpty>Tidak ditemukan.</ComboboxEmpty>
                                    <ComboboxList>
                                        {(item) => (
                                            <ComboboxItem key={item.value} value={item}>
                                                {item.label}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
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
                title={isEdit ? "Kelas Diperbarui" : "Kelas Ditambahkan"}
                description={resultMsg}
            />
        </>
    )
}
