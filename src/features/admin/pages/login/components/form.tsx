import { useState } from "react"
import { Eye, EyeOff, Lock, User } from "lucide-react"

import { Button } from "@/common/components/ui/button"
import { Input } from "@/common/components/ui/input"
import { Label } from "@/common/components/ui/label"

export const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault()
        setError(null)

        if (!name.trim()) {
            setError("Nama tidak boleh kosong.")
            return
        }
        if (password.length < 8) {
            setError("Password minimal 8 karakter.")
            return
        }

        console.log("Login:", { name, password })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                </p>
            )}

            {/* Name */}
            <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="name"
                        type="text"
                        placeholder="Masukkan nama"
                        className="pl-9"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                        placeholder="Min. 8 karakter"
                        className="pl-9 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                </div>
            </div>

            <Button type="submit" className="w-full">
                Masuk
            </Button>
        </form>
    )
}
