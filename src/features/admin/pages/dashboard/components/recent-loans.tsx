import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/common/components/ui/table"

interface RecentLoan {
    id: number
    namaPeminjam: string
    kelas: string
    namaBarang: string
    waktu: string
}

const dummyData: RecentLoan[] = [
    { id: 1, namaPeminjam: "Andi Saputra", kelas: "X AK", namaBarang: "Proyektor Epson", waktu: "Hari ini, 08:00" },
    { id: 2, namaPeminjam: "Budi Santoso", kelas: "XI PPLG", namaBarang: "Laptop Lenovo", waktu: "Hari ini, 09:15" },
    { id: 3, namaPeminjam: "Citra Dewi", kelas: "XII FARMASI", namaBarang: "Microphone Wireless", waktu: "Hari ini, 10:30" },
    { id: 4, namaPeminjam: "Dian Pratama", kelas: "X PPLG", namaBarang: "Speaker Aktif", waktu: "Kemarin, 13:00" },
    { id: 5, namaPeminjam: "Eka Rahayu", kelas: "XI AK", namaBarang: "Kamera DSLR", waktu: "Kemarin, 14:30" },
]

export const RecentLoans = () => {
    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama Peminjam</TableHead>
                        <TableHead>Kelas</TableHead>
                        <TableHead>Barang</TableHead>
                        <TableHead>Waktu</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dummyData.map((loan) => (
                        <TableRow key={loan.id}>
                            <TableCell className="font-medium">{loan.namaPeminjam}</TableCell>
                            <TableCell>{loan.kelas}</TableCell>
                            <TableCell>{loan.namaBarang}</TableCell>
                            <TableCell className="text-muted-foreground">{loan.waktu}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
