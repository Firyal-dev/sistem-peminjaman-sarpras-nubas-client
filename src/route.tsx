import { createBrowserRouter, RouterProvider, Navigate } from 'react-router'
import { TooltipProvider } from './common/components/ui/tooltip'

import { RequireAuth } from './common/auth/RequireAuth'
import { authStore } from './common/auth/authStore'

import { Layout } from './features/admin/layout'
import { Login } from './features/admin/pages/login/page'
import { Dashboard } from './features/admin/pages/dashboard/page'
import { DaftarBarang } from './features/admin/pages/barang/page'
import { DaftarPeminjamanBarang } from './features/admin/pages/peminjaman/page'
import { DaftarPengembalianBarang } from './features/admin/pages/pengembalian/page'
import { UnitPage } from './features/admin/pages/units/page'
import { RekapPage } from './features/admin/pages/rekap/page'
import { KelasPage } from './features/admin/pages/kelas/page'
import { SiswaPage } from './features/admin/pages/kelas/siswa-page'

import { Form } from './features/user/pages/form/page'
import { ScanPage } from './features/user/pages/scan/page'
import { LandingPage } from './features/user/pages/landing-page/page'
import { ReturnPage } from './features/user/pages/return/page'

// Redirect ke dashboard kalau sudah login
const LoginGuard = () =>
    authStore.isLoggedIn() ? <Navigate to="/admin/dashboard" replace /> : <Login />

const route = createBrowserRouter([
    // Login — redirect ke dashboard kalau sudah login
    {
        path: '/admin/login',
        Component: LoginGuard,
    },

    // Admin — semua route di sini butuh auth
    {
        path: '/admin',
        Component: RequireAuth,
        children: [
            {
                Component: Layout,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/admin/dashboard" replace />,
                    },
                    {
                        path: 'dashboard',
                        Component: Dashboard,
                    },
                    {
                        path: 'barang',
                        Component: DaftarBarang,
                    },
                    {
                        path: 'barang/:itemId/units',
                        Component: UnitPage,
                    },
                    {
                        path: 'dipinjam',
                        Component: DaftarPeminjamanBarang,
                    },
                    {
                        path: 'dikembalikan',
                        Component: DaftarPengembalianBarang,
                    },
                    {
                        path: 'rekap',
                        Component: RekapPage,
                    },
                    {
                        path: 'kelas',
                        Component: KelasPage,
                    },
                    {
                        path: 'kelas/:kelasId/siswa',
                        Component: SiswaPage,
                    },
                ],
            },
        ],
    },

    // User routes — tidak butuh auth
    {
        path: '/form',
        Component: Form,
    },
    {
        path: '/return',
        Component: ReturnPage,
    },
    {
        path: '/scan',
        Component: ScanPage,
    },
    {
        path: '/',
        Component: LandingPage,
    },
])

export const Router = () => {
    return (
        <TooltipProvider>
            <RouterProvider router={route} />
        </TooltipProvider>
    )
}
