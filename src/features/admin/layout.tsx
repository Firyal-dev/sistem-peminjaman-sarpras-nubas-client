import { Outlet, useLocation } from "react-router"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/common/components/ui/breadcrumb"
import { Separator } from "@/common/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/common/components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"

const routeLabels: Record<string, string> = {
    dashboard: "Dashboard",
    barang: "Daftar Barang",
    dipinjam: "Barang Dipinjam",
    dikembalikan: "Barang Dikembalikan",
}

export const Layout = () => {
    const location = useLocation()
    const segments = location.pathname.split("/").filter(Boolean)
    const crumbs = segments.slice(1)

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-14 items-center gap-2 border-b px-4">
                    <SidebarTrigger />
                    <Separator orientation="vertical" />
                    <Breadcrumb>
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
                </header>
                <main className="flex-1 p-10">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
