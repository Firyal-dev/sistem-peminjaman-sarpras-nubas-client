import { Label } from "@/common/components/ui/label"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/common/components/ui/combobox"

export interface ClassItem {
    label: string
    value: string
}

interface ClassComboBoxProps {
    items: ClassItem[]
    onValueChange: (val: ClassItem | null) => void
}

export const ClassComboBox = ({ items, onValueChange }: ClassComboBoxProps) => {
    return (
        <div className="space-y-2">
            <Label htmlFor="pilih-kelas">Pilih Kelas</Label>
            <Combobox
                items={items}
                itemToStringValue={(item) => item.label}
                onValueChange={onValueChange}
            >
                <ComboboxInput placeholder="Pilih kelas..." />
                <ComboboxContent>
                    <ComboboxEmpty>Kelas tidak ditemukan.</ComboboxEmpty>
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
    )
}
