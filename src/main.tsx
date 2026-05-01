import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import './index.css'
import { Router } from './route'
import { queryClient } from './common/query/queryClient'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Router />
            <Toaster richColors position="top-right" closeButton />
        </QueryClientProvider>
    </StrictMode>,
)
