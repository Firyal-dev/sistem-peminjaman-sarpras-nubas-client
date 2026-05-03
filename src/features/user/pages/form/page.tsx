import { useState, useMemo } from "react"
import { useNavigate } from "react-router"
import { ArrowRight, ClipboardList, Check, ScanLine } from "lucide-react"

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

export function Form() {
    const navigate = useNavigate()

    const [selectedMajor, setSelectedMajor] = useState<SimpleItem | null>(null)
    const [selectedClass, setSelectedClass] = useState<SimpleItem | null>(null)
    const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null)

    const { data: classesData, loading: classesLoading } = useClasses()
    const { data: studentsData, loading: studentsLoading } = useStudents(
        selectedClass ? Number(selectedClass.value) : undefined
    )

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

    const filteredClasses: SimpleItem[] = useMemo(() => {
        if (!selectedMajor) return []
        return classesData
            .filter(c => c.major === selectedMajor.value)
            .sort((a, b) => a.grade !== b.grade ? a.grade - b.grade : a.rombel - b.rombel)
            .map(c => ({ label: c.full_name, value: String(c.id) }))
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
                mode: 'borrow',
                student_id: Number(selectedStudent.value),
                student_name: selectedStudent.label,
            }
        })
    }

    const step1Done = !!selectedMajor
    const step2Done = !!selectedClass
    const step3Done = !!selectedStudent

    return (
        <div className="flex min-h-svh flex-col bg-background px-4 py-6">
            <div className="mx-auto w-full max-w-lg space-y-6">

                {/* Header — horizontal */}
                <UserHeader
                    icon={ClipboardList}
                    title="Form Peminjaman"
                    desc="Isi data peminjam untuk melanjutkan"
                    backTo="/"
                    horizontal
                />

                <div className="h-px bg-border" />

                {/* Step progress — horizontal pill */}
                <div className="flex items-center gap-2 rounded-xl border bg-muted/30 px-4 py-3">
                    {[
                        { label: "Jurusan", done: step1Done, value: selectedMajor?.label },
                        { label: "Kelas", done: step2Done, value: selectedClass?.label },
                        { label: "Siswa", done: step3Done, value: selectedStudent?.label },
                    ].map((s, i, arr) => (
                        <div key={s.label} className="flex flex-1 items-center gap-2 min-w-0">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <div className={[
                                    "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                                    s.done ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
                                ].join(" ")}>
                                    {s.done ? <Check className="size-3" /> : i + 1}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-muted-foreground leading-none">{s.label}</p>
                                    <p className="text-xs font-medium truncate leading-tight mt-0.5">
                                        {s.value ?? <span className="text-muted-foreground">—</span>}
                                    </p>
                                </div>
                            </div>
                            {i < arr.length - 1 && (
                                <div className={[
                                    "h-px flex-1 shrink-0 transition-colors",
                                    s.done ? "bg-primary/40" : "bg-border"
                                ].join(" ")} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form fields */}
                <Card>
                    <CardContent className="pt-5 pb-5 space-y-5">

                        {/* Row 1: Jurusan + Kelas side by side */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Jurusan */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1.5 text-sm">
                                    <span className={[
                                        "flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
                                        step1Done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                    ].join(" ")}>
                                        {step1Done ? <Check className="size-2.5" /> : "1"}
                                    </span>
                                    Jurusan
                                </Label>
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

                            {/* Kelas */}
                            <div className="space-y-2">
                                <Label className={[
                                    "flex items-center gap-1.5 text-sm transition-opacity",
                                    !step1Done ? "opacity-40" : ""
                                ].join(" ")}>
                                    <span className={[
                                        "flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
                                        step2Done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                    ].join(" ")}>
                                        {step2Done ? <Check className="size-2.5" /> : "2"}
                                    </span>
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
                                            !selectedMajor ? "Pilih jurusan dulu..." : "Pilih kelas..."
                                        }
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
                        </div>

                        {/* Row 2: Nama Siswa — full width */}
                        <div className={!step2Done ? "opacity-40 pointer-events-none" : ""}>
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
                                stepNumber={3}
                                done={step3Done}
                            />
                        </div>

                    </CardContent>
                </Card>

                {/* Summary + CTA — horizontal */}
                {selectedStudent ? (
                    <div className="flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <ScanLine className="size-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{selectedStudent.label}</p>
                            <p className="text-xs text-muted-foreground truncate">
                                {selectedMajor?.label} · {selectedClass?.label}
                            </p>
                        </div>
                        <Button onClick={handleLanjut} className="shrink-0 gap-1.5">
                            Scan
                            <ArrowRight className="size-4" />
                        </Button>
                    </div>
                ) : (
                    <Button className="w-full" disabled>
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
