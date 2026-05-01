import { useQuery } from '@tanstack/react-query'
import { studentsService } from '../api/services'
import { queryKeys } from '../query/keys'

export function useStudents(classId?: number) {
    const { data = [], isLoading, error, refetch } = useQuery({
        queryKey: classId ? queryKeys.students.byClass(classId) : queryKeys.students.all,
        queryFn: () => studentsService.getAll(classId),
        enabled: classId !== undefined,   // tidak fetch kalau classId belum dipilih
    })

    return {
        data,
        loading: isLoading,
        error: error ? 'Gagal memuat data siswa' : null,
        refetch,
    }
}
