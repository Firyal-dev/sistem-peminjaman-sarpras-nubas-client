import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 2,      // data fresh 2 menit
            gcTime: 1000 * 60 * 10,         // cache 10 menit
            retry: 1,
            refetchOnWindowFocus: true,
        },
    },
})
