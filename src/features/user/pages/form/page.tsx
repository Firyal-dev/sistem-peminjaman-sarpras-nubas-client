import { useState, useMemo } from "react"
import { Link } from "react-router"
import { ArrowRight, ClipboardList } from "lucide-react"

import { Button } from "@/common/components/ui/button"
import { Card, CardContent } from "@/common/components/ui/card"
import { UserHeader } from "../../components/header"
import { ClassComboBox, type ClassItem } from "./components/class-combo-box"
import { StudentComboBox, type StudentItem } from "./components/student-combo-box"

const classes: ClassItem[] = [
    { label: "10 PPLG", value: "1" },
    { label: "10 AK", value: "2" },
    { label: "11 PPLG", value: "3" },
]

const allStudents: StudentItem[] = [
    { label: "Firyal Muhammad Azka", value: "s1", class_id: "1" },
    { label: "Rizky Ramadhan", value: "s2", class_id: "1" },
    { label: "Budi Saputra", value: "s3", class_id: "2" },
    { label: "Siti Aminah", value: "s4", class_id: "2" },
    { label: "Andika Pratama", value: "s5", class_id: "3" },
]

export function Form() {
    const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null)
    const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null)

    const filteredStudents = useMemo(() => {
        if (!selectedClass) return []
        return allStudents.filter((s) => s.class_id === selectedClass.value)
    }, [selectedClass])

    const handleClassChange = (val: ClassItem | null) => {
        setSelectedClass(val)
        setSelectedStudent(null)
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm space-y-4">

                <UserHeader
                    icon={ClipboardList}
                    title="Form Peminjaman"
                    desc="Pilih kelas dan nama siswa untuk melanjutkan"
                />

                {/* Form card */}
                <Card>
                    <CardContent className="space-y-4 pt-6">
                        <ClassComboBox items={classes} onValueChange={handleClassChange} />
                        <StudentComboBox
                            key={selectedClass?.value ?? "empty"}
                            items={filteredStudents}
                            disabled={!selectedClass}
                            onValueChange={setSelectedStudent}
                        />
                    </CardContent>
                </Card>

                {/* CTA */}
                {selectedStudent &&
                    <Button asChild className="w-full" disabled={!selectedStudent}>
                        <Link to="/scan">
                            Lanjut Scan Barcode
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                }

                <p className="text-center text-xs text-muted-foreground">
                    Pastikan data yang dipilih sudah benar sebelum melanjutkan
                </p>
            </div>
        </div>
    )
}
