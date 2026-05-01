import { useState, useMemo } from "react"
import { useNavigate } from "react-router"
import { ArrowRight, ClipboardList } from "lucide-react"

import { Button } from "@/common/components/ui/button"
import { Card, CardContent } from "@/common/components/ui/card"
import { Label } from "@/common/components/ui/label"
import { UserHeader } from "../../components/header"
import { StudentComboBox, type StudentItem } from "./components/student-combo-box"
import { useClasses } from "@/common/hooks/useClasses"
import { useStudents } from "@/common/hooks/useStudents"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/common/components/ui/combobox"

interface SimpleItem {
    label: string
    value: string
}

/**
 * Ambil angkatan (angka di awal nama kelas).
 * "10 PPLG 1" → 10, "13 AK 2" → 13
 */
function getAngkatan(className: string): number {
    const match = className.match(/^(\d+)/)
    return match ? parseInt(match[1], 10) : 0
}

export function Form() {
    const navigate = useNavigate()

    const [selectedMajor, setSelectedMajor] = useState<SimpleItem | null>(null)
    const [selectedClass, setSelectedClass] = useState<SimpleItem | null>(null)
    const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null)

    const { data: classesData, loading: classesLoading } = useClasses()
    const { data: studentsData, loading: studentsLoading } = useStudents(
        selectedClass ? Number(selectedClass.value) : undefined
    )

    // Unique jurusan, urut alfabetis
    const majors: SimpleItem[] = useMemo(() => {
        const seen = new Set<string>()
        const result: SimpleItem[] = []
        for (const c of classesData) {
            if (!seen.has(c.major)) {
                seen.add(c.major)
                result.push({ label: c.major, value: c.major })
            }
        }
        return result.sort((a, b) => a.label.localeCompare(b.label))
    }, [classesData])

    // Kelas sesuai jurusan, diurutkan by angkatan (10 → 11 → 12 → 13)
    const filteredClasses: SimpleItem[] = useMemo(() => {
        if (!selectedMajor) return []
        return classesData
            .filter(c => c.major === selectedMajor.value)
            .sort((a, b) => {
                const angkatanDiff = getAngkatan(a.class) - getAngkatan(b.class)
                if (angkatanDiff !== 0) return angkatanDiff
                return a.class.localeCompare(b.class)
            })
            .map(c => ({ label: c.class, value: String(c.id) }))
    }, [classesData, selectedMajor])

    const students: StudentItem[] = useMemo(() =>
        studentsData.map(s => ({
            label: s.name,
            value: String(s.id),
            class_id: String(s.class_id),
        })),
        [studentsData]
    )

    const handleMajorChange = (val: SimpleItem | null) => {
        setSelectedMajor(val)
        setSelectedClass(null)
        setSelectedStudent(null)
    }

    const handleClassChange = (val: SimpleItem | null) => {
        setSelectedClass(val)
        setSelectedStudent(null)
    }

    const handleLanjut = () => {
        if (!selectedStudent) return
        navigate('/scan', {
            state: {
                student_id: Number(selectedStudent.value),
                student_name: selectedStudent.label,
            }
        })
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm space-y-4">

                <UserHeader
                    icon={ClipboardList}
                    title="Form Peminjaman"
                    desc="Pilih jurusan, kelas, dan nama siswa"
                />

                <Card>
                    <CardContent className="space-y-4 pt-6">

                        {/* Step 1 — Jurusan */}
                        <div className="space-y-2">
                            <Label>Jurusan</Label>
                            <Combobox
                                items={majors}
                                itemToStringValue={(item) => item.label}
                                onValueChange={handleMajorChange}
                                disabled={classesLoading}
                            >
                                <ComboboxInput
                                    placeholder={classesLoading ? "Memuat..." : "Pilih jurusan..."}
                                />
                                <ComboboxContent>
                                    <ComboboxEmpty>Jurusan tidak ditemukan.</ComboboxEmpty>
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

                        {/* Step 2 — Kelas (hanya muncul setelah jurusan dipilih) */}
                        <div className="space-y-2">
                            <Label className={!selectedMajor ? "text-muted-foreground" : ""}>
                                Kelas
                            </Label>
                            <Combobox
                                key={selectedMajor?.value ?? "no-major"}
                                items={filteredClasses}
                                itemToStringValue={(item) => item.label}
                                onValueChange={handleClassChange}
                                disabled={!selectedMajor}
                            >
                                <ComboboxInput
                                    placeholder={
                                        !selectedMajor
                                            ? "Pilih jurusan dulu..."
                                            : `Pilih kelas ${selectedMajor.label}...`
                                    }
                                />
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

                        {/* Step 3 — Siswa (hanya aktif setelah kelas dipilih) */}
                        <StudentComboBox
                            key={selectedClass?.value ?? "no-class"}
                            items={students}
                            disabled={!selectedClass || studentsLoading}
                            onValueChange={setSelectedStudent}
                            placeholder={
                                !selectedClass
                                    ? "Pilih kelas dulu..."
                                    : studentsLoading
                                        ? "Memuat siswa..."
                                        : "Cari nama siswa..."
                            }
                        />

                    </CardContent>
                </Card>

                {selectedStudent && (
                    <Button className="w-full" onClick={handleLanjut}>
                        Lanjut Scan Barcode
                        <ArrowRight className="size-4" />
                    </Button>
                )}

                <p className="text-center text-xs text-muted-foreground">
                    Pastikan data yang dipilih sudah benar sebelum melanjutkan
                </p>
            </div>
        </div>
    )
}
