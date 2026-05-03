import { useState } from "react"
import { useNavigate } from "react-router"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

import { Button } from "@/common/components/ui/button"
import { Input } from "@/common/components/ui/input"
import { Label } from "@/common/components/ui/label"
import { authService } from "@/common/api/services"
import { authStore } from "@/common/auth/authStore"

export const LoginForm = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!email.trim()) { setError("Email tidak boleh kosong."); return }
        if (password.length < 6) { setError("Password minimal 6 karakter."); return }

        setLoading(true)
        try {
            const { token, user } = await authService.login(email, password)
            authStore.save(token, user)
            navigate('/admin/dashboard', { replace: true })
        } catch (e: unknown) {
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
            setError(msg ?? 'Login gagal. Periksa email dan password.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                </p>
            )}

            {/* Email */}
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        className="pl-9"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />
                </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="pl-9 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Memuat..." : "Masuk"}
            </Button>
        </form>
    )
}
