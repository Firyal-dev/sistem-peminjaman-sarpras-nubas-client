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
import { itemsService } from "@/common/api/services"
import { queryKeys } from "@/common/query/keys"
import { ResultDialog } from "@/common/components/result-dialog"
import type { Barang } from "./columns"

interface CreateFormDialogProps {
  mode?: "create"
  onCreated?: () => void
}

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
  const [foto, setFoto] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 🔥 result dialog
  const [resultOpen, setResultOpen] = useState(false)
  const [resultMsg, setResultMsg] = useState("")

  useEffect(() => {
    if (isEdit && props.open) {
      setNama(props.defaultValues.name)
      setFoto(null)
      setError(null)
    }
  }, [isEdit ? props.open : false])

  const handleOpenChange = (value: boolean) => {
    if (isEdit) props.onOpenChange(value)
    else setOpen(value)

    if (!value) {
      setNama("")
      setFoto(null)
      setError(null)
    }
  }

  const handleSubmit = async () => {
    if (!nama.trim()) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("name", nama)

      if (foto) {
        formData.append("photo", foto)
      }

      if (isEdit) {
        // Laravel multipart PUT workaround
        formData.append("_method", "PUT")

        await itemsService.update(props.defaultValues.id, formData)

        props.onOpenChange(false)
        props.onUpdated()

        setResultMsg(`Barang "${nama}" berhasil diperbarui.`)
      } else {
        await itemsService.create(formData)

        setOpen(false)
        setNama("")
        setFoto(null)

        props.onCreated?.()

        setResultMsg(`Barang "${nama}" berhasil ditambahkan.`)
      }

      qc.invalidateQueries({ queryKey: queryKeys.items.all })
      setResultOpen(true)
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message

      setError(msg ?? "Gagal menyimpan data")
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
              Tambah Barang
            </Button>
          </DialogTrigger>
        )}

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Barang" : "Tambah Barang"}
            </DialogTitle>
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
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSubmit()
                }
              />

              <Label htmlFor="foto-barang">Foto Barang</Label>
              <Input
                id="foto-barang"
                type="file"
                onChange={(e) => setFoto(e.target.files?.[0] || null)}
                accept="image/jpg,image/png,image/jpeg"
              />
            </div>

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={loading || !nama.trim()}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🔥 Result Dialog (pengganti toast) */}
      <ResultDialog
        open={resultOpen}
        onOpenChange={setResultOpen}
        type="success"
        title={isEdit ? "Barang Diperbarui" : "Barang Ditambahkan"}
        description={resultMsg}
      />
    </>
  )
}