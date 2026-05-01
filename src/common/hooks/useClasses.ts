import { useQuery } from '@tanstack/react-query'
import { classesService } from '../api/services'
import { queryKeys } from '../query/keys'

export function useClasses() {
    const { data = [], isLoading, error, refetch } = useQuery({
        queryKey: queryKeys.classes.all,
        queryFn: classesService.getAll,
    })

    return {
        data,
        loading: isLoading,
        error: error ? 'Gagal memuat data kelas' : null,
        refetch,
    }
}
