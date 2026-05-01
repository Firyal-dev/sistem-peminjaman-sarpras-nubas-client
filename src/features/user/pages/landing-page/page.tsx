import { Link } from "react-router"
import { ArrowRight, RotateCcw } from "lucide-react"

import { Button } from "@/common/components/ui/button"

export const LandingPage = () => {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm space-y-8">

                {/* Logo + Title */}
                <div className="space-y-4 text-center">
                    <img
                        src="/aknb.png"
                        alt="Logo AKNB"
                        className="mx-auto size-24 object-contain"
                    />
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Peminjaman Barang Sarpras
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Pilih salah satu menu di bawah untuk melanjutkan
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Button asChild size="lg" className="w-full">
                        <Link to="/form">
                            <ArrowRight className="size-4" />
                            Pinjam Barang
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="w-full">
                        <Link to="/return">
                            <RotateCcw className="size-4" />
                            Kembalikan Barang
                        </Link>
                    </Button>
                </div>

            </div>
        </div>
    )
}
