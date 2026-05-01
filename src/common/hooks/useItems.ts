import { useQuery } from '@tanstack/react-query'
import { itemsService } from '../api/services'
import { queryKeys } from '../query/keys'

export function useItems() {
    const { data = [], isLoading, error, refetch } = useQuery({
        queryKey: queryKeys.items.all,
        queryFn: itemsService.getAll,
    })

    return {
        data,
        loading: isLoading,
        error: error ? 'Gagal memuat data barang' : null,
        refetch,
    }
}

export function useItem(id: number) {
    return useQuery({
        queryKey: queryKeys.items.one(id),
        queryFn: () => itemsService.getOne(id),
        enabled: !!id,
    })
}
