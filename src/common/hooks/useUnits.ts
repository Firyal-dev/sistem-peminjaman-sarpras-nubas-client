import { useQuery } from '@tanstack/react-query'
import { unitsService } from '../api/services'
import { queryKeys } from '../query/keys'

export function useUnits(itemId: number) {
    return useQuery({
        queryKey: queryKeys.units.byItem(itemId),
        queryFn: () => unitsService.getByItem(itemId),
        enabled: !!itemId,
    })
}
