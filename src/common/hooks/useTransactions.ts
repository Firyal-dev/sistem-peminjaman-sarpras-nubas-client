import { useQuery } from '@tanstack/react-query'
import { transactionsService } from '../api/services'
import { queryKeys } from '../query/keys'

export function useTransactions(params?: { student_id?: number; status?: 'active' | 'done'; page?: number }) {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: queryKeys.transactions.all(params),
        queryFn: () => transactionsService.getAll(params),
    })

    return {
        data,
        loading: isLoading,
        error: error ? 'Gagal memuat data transaksi' : null,
        refetch,
    }
}

export function useTransaction(id: number) {
    return useQuery({
        queryKey: queryKeys.transactions.one(id),
        queryFn: () => transactionsService.getOne(id),
        enabled: !!id,
    })
}
