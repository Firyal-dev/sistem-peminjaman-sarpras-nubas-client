// Simple auth store pakai localStorage — tidak perlu state management library

const TOKEN_KEY = 'admin_token'
const USER_KEY  = 'admin_user'

export interface AuthUser {
    id: number
    name: string
    email: string
}

export const authStore = {
    getToken: (): string | null => localStorage.getItem(TOKEN_KEY),

    getUser: (): AuthUser | null => {
        const raw = localStorage.getItem(USER_KEY)
        if (!raw) return null
        try { return JSON.parse(raw) } catch { return null }
    },

    isLoggedIn: (): boolean => !!localStorage.getItem(TOKEN_KEY),

    save: (token: string, user: AuthUser) => {
        localStorage.setItem(TOKEN_KEY, token)
        localStorage.setItem(USER_KEY, JSON.stringify(user))
    },

    clear: () => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
    },
}
