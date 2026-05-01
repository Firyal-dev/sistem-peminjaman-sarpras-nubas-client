import { Card, CardContent, CardHeader } from "@/common/components/ui/card"
import { LoginForm } from "./components/form"

export const Login = () => {
    return (
        <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="flex flex-col items-center gap-3 pb-2">
                    <img
                        src="/aknb.png"
                        alt="Logo AKNB"
                        className="size-16 object-contain"
                    />
                    <div className="space-y-1 text-center">
                        <h1 className="text-xl font-semibold tracking-tight">
                            Aplikasi Peminjaman Sarpras
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Masuk untuk melanjutkan
                        </p>
                    </div>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    )
}
