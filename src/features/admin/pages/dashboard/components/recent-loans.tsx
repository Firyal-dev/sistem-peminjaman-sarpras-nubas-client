import { useTransactions } from "@/common/hooks/useTransactions"
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/common/components/ui/table"

const formatWaktu = (waktu: string) =>
    new Date(waktu).toLocaleString("id-ID", {
        day: "2-digit", month: "short",
        hour: "2-digit", minute: "2-digit",
    })

export const RecentLoans = () => {
    const { data, loading } = useTransactions({ status: 'active' })
    const loans = data?.data.slice(0, 5) ?? []

    if (loading) {
        return <div className="rounded-lg border p-4 text-sm text-muted-foreground">Memuat data...</div>
    }

    if (loans.length === 0) {
        return <div className="rounded-lg border p-4 text-sm text-muted-foreground">Belum ada peminjaman aktif.</div>
    }

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
                    {loans.map((loan) => {
                        const kelas = loan.student?.class
                            ? `${loan.student.class.class} ${loan.student.class.major}`
                            : '-'
                        const barang = loan.details?.map(d => d.unit?.item?.name).filter(Boolean).join(', ') || '-'
                        return (
                            <TableRow key={loan.id}>
                                <TableCell className="font-medium">{loan.student?.name ?? '-'}</TableCell>
                                <TableCell>{kelas}</TableCell>
                                <TableCell>{barang}</TableCell>
                                <TableCell className="text-muted-foreground">{formatWaktu(loan.borrow_time)}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
