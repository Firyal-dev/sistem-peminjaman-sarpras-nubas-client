import { useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router"
import { LogOut } from "lucide-react"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/common/components/ui/breadcrumb"
import { Separator } from "@/common/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/common/components/ui/sidebar"
import { Button } from "@/common/components/ui/button"
import { AppSidebar } from "./components/app-sidebar"
import { authStore } from "@/common/auth/authStore"
import { authService } from "@/common/api/services"
import { ConfirmDialog } from "@/common/components/confirm-dialog"

const routeLabels: Record<string, string> = {
    dashboard: "Dashboard",
    barang: "Daftar Barang",
    units: "Kelola Unit",
    dipinjam: "Barang Dipinjam",
    dikembalikan: "Barang Dikembalikan",
    rekap: "Rekap Transaksi",
    kelas: "Manajemen Kelas",
    siswa: "Daftar Siswa",
}

export const Layout = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const user = authStore.getUser()
    const segments = location.pathname.split("/").filter(Boolean)
    const crumbs = segments.slice(1)

    const [logoutOpen, setLogoutOpen] = useState(false)

    const handleLogout = async () => {
        try { await authService.logout() } catch { /* ignore */ }
        authStore.clear()
        navigate('/admin/login', { replace: true })
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-14 items-center gap-2 border-b px-4">
                    <SidebarTrigger />
                    <Separator orientation="vertical" />
                    <Breadcrumb className="flex-1">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-muted-foreground font-normal">
                                    Admin
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                            {crumbs.map((segment, index) => (
                                <>
                                    <BreadcrumbSeparator key={`sep-${index}`} />
                                    <BreadcrumbItem key={segment}>
                                        <BreadcrumbPage>
                                            {routeLabels[segment] ?? segment}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* User info + logout */}
                    <div className="flex items-center gap-3">
                        {user && (
                            <span className="text-sm text-muted-foreground hidden sm:block">
                                {user.name}
                            </span>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => setLogoutOpen(true)} title="Logout">
                            <LogOut className="size-4" />
                        </Button>
                    </div>
                </header>
                <main className="flex-1 p-10">
                    <Outlet />
                </main>
            </SidebarInset>

            <ConfirmDialog
                open={logoutOpen}
                onOpenChange={setLogoutOpen}
                title="Keluar dari Aplikasi"
                description="Anda akan keluar dari sesi admin. Lanjutkan?"
                confirmLabel="Ya, Keluar"
                cancelLabel="Batal"
                onConfirm={handleLogout}
            />
        </SidebarProvider>
    )
}
