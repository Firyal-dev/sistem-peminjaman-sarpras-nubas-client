import { Check } from "lucide-react"
import { Label } from "@/common/components/ui/label"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/common/components/ui/combobox"

export interface StudentItem {
    label: string
    value: string
    class_id: string
}

interface StudentComboBoxProps {
    items: StudentItem[]
    disabled?: boolean
    placeholder?: string
    onValueChange: (val: StudentItem | null) => void
    stepNumber?: number
    done?: boolean
}

export const StudentComboBox = ({
    items,
    disabled,
    placeholder,
    onValueChange,
    stepNumber,
    done,
}: StudentComboBoxProps) => {
    return (
        <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
                {stepNumber !== undefined && (
                    <span className={[
                        "flex size-5 items-center justify-center rounded-full text-[10px] font-bold",
                        done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    ].join(" ")}>
                        {done ? <Check className="size-3" /> : stepNumber}
                    </span>
                )}
                Nama Siswa
            </Label>
            <Combobox
                items={items}
                itemToStringValue={(item) => item.label}
                onValueChange={onValueChange}
                disabled={disabled}
            >
                <ComboboxInput
                    placeholder={placeholder ?? (disabled ? "Pilih kelas dulu..." : "Cari nama siswa...")}
                />
                <ComboboxContent>
                    <ComboboxEmpty>Siswa tidak ditemukan.</ComboboxEmpty>
                    <ComboboxList>
                        {(student) => (
                            <ComboboxItem key={student.value} value={student}>
                                {student.label}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </div>
    )
}
