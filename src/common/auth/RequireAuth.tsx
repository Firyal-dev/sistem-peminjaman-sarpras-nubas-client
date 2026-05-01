import { Navigate, Outlet } from "react-router"
import { authStore } from "./authStore"

export const RequireAuth = () => {
    if (!authStore.isLoggedIn()) {
        return <Navigate to="/admin/login" replace />
    }
    return <Outlet />
}
