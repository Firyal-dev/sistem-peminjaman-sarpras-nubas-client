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
    onValueChange: (val: StudentItem | null) => void
}

export const StudentComboBox = ({ items, disabled, onValueChange }: StudentComboBoxProps) => {
    return (
        <div className="space-y-2">
            <Label htmlFor="pilih-siswa">Pilih Siswa</Label>
            <Combobox
                items={items}
                itemToStringValue={(item) => item.label}
                onValueChange={onValueChange}
                disabled={disabled}
            >
                <ComboboxInput
                    placeholder={disabled ? "Pilih kelas dulu..." : "Cari nama siswa..."}
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
