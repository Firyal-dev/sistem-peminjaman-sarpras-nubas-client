import { Outlet, useLocation, useNavigate } from "react-router"
import { LogOut } from "lucide-react"
import { toast } from "sonner"

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

const routeLabels: Record<string, string> = {
    dashboard: "Dashboard",
    barang: "Daftar Barang",
    units: "Kelola Unit",
    dipinjam: "Barang Dipinjam",
    dikembalikan: "Barang Dikembalikan",
}

export const Layout = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const user = authStore.getUser()
    const segments = location.pathname.split("/").filter(Boolean)
    const crumbs = segments.slice(1)

    const handleLogout = async () => {
        try { await authService.logout() } catch { /* ignore */ }
        authStore.clear()
        toast.success('Berhasil logout')
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
                        <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                            <LogOut className="size-4" />
                        </Button>
                    </div>
                </header>
                <main className="flex-1 p-10">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
