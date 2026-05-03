import { Link } from "react-router"
import { ArrowRight, RotateCcw, ScanLine } from "lucide-react"

export const LandingPage = () => {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-8">
            <div className="w-full max-w-lg space-y-8">

                {/* Logo + Title — horizontal */}
                <div className="flex items-center gap-4">
                    <img
                        src="/aknb.png"
                        alt="Logo AKNB"
                        className="size-16 shrink-0 object-contain"
                    />
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Peminjaman Sarpras</h1>
                        <p className="text-sm text-muted-foreground">
                            Sistem peminjaman barang sarana dan prasarana
                        </p>
                    </div>
                </div>

                <div className="h-px bg-border" />

                {/* Menu cards — side by side */}
                <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Pilih menu
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            to="/form"
                            className="group flex flex-col gap-4 rounded-2xl border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md active:scale-[0.98]"
                        >
                            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                                <ScanLine className="size-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">Pinjam Barang</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    Isi form &amp; scan QR barang
                                </p>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium text-primary">
                                Mulai <ArrowRight className="size-3.5" />
                            </div>
                        </Link>

                        <Link
                            to="/return"
                            className="group flex flex-col gap-4 rounded-2xl border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md active:scale-[0.98]"
                        >
                            <div className="flex size-12 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-muted/80">
                                <RotateCcw className="size-6 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="font-semibold">Kembalikan Barang</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    Pilih transaksi &amp; scan QR
                                </p>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                Mulai <ArrowRight className="size-3.5" />
                            </div>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}
