import { LayoutDashboard, Package, PackageCheck, PackageOpen } from "lucide-react"
import { NavLink, useLocation } from "react-router"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/common/components/ui/sidebar"

const navItems = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Daftar Barang",
        url: "/admin/barang",
        icon: Package,
    },
    {
        title: "Barang Dipinjam",
        url: "/admin/dipinjam",
        icon: PackageOpen,
    },
    {
        title: "Barang Dikembalikan",
        url: "/admin/dikembalikan",
        icon: PackageCheck,
    },
]

export const AppSidebar = () => {
    const location = useLocation()

    // Aktif juga untuk sub-route (misal /admin/barang/:id/units)
    const isActive = (url: string) => {
        if (url === '/admin/barang') {
            return location.pathname === url || location.pathname.startsWith('/admin/barang/')
        }
        return location.pathname === url
    }

    return (
        <Sidebar>
            <SidebarHeader className="px-4 py-4">
                <span className="text-lg font-semibold tracking-tight">Admin Sarpras</span>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                        tooltip={item.title}
                                    >
                                        <NavLink to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
