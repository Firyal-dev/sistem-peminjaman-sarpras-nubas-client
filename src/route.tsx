import { createBrowserRouter, RouterProvider } from 'react-router'
import { TooltipProvider } from './common/components/ui/tooltip'

import { Layout } from './features/admin/layout'
import { Login } from './features/admin/pages/login/page'
import { Dashboard } from './features/admin/pages/dashboard/page'
import { DaftarBarang } from './features/admin/pages/barang/page'
import { DaftarPeminjamanBarang } from './features/admin/pages/peminjaman/page'
import { DaftarPengembalianBarang } from './features/admin/pages/pengembalian/page'

import { Form } from './features/user/pages/form/page'
import { ScanPage } from './features/user/pages/scan/page'
import { LandingPage } from './features/user/pages/landing-page/page'

const route = createBrowserRouter([
    {
        path: '/admin/login',
        Component: Login
    },
    {
        path: '/admin',
        Component: Layout,
        children: [
            {
                path: '/admin/dashboard',
                Component: Dashboard
            },
            {
                path: '/admin/barang',
                Component: DaftarBarang
            },
            {
                path: '/admin/dipinjam',
                Component: DaftarPeminjamanBarang
            },
            {
                path: '/admin/dikembalikan',
                Component: DaftarPengembalianBarang
            }
        ]
    },
    {
        path: '/form',
        Component: Form
    },
    {
        path: '/scan',
        Component: ScanPage
    },
    {
        path: '/',
        Component: LandingPage
    }
])

export const Router = () => {
    return (
        <TooltipProvider>
            <RouterProvider router={route} />
        </TooltipProvider>
    )
}