import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/common/components/ui/button"

interface UserHeaderProps {
    icon: LucideIcon
    title: string
    desc: string
    backTo?: string
    onBack?: () => void
    badge?: string
    /** horizontal: icon kiri, teks kanan — default false (centered) */
    horizontal?: boolean
}

export const UserHeader = ({ icon: Icon, title, desc, backTo, onBack, badge, horizontal }: UserHeaderProps) => {
    const navigate = useNavigate()

    const handleBack = () => {
        if (onBack) onBack()
        else if (backTo) navigate(backTo)
    }

    const showBack = !!(backTo || onBack)

    if (horizontal) {
        return (
            <div className="flex items-center gap-4">
                {showBack && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-muted-foreground hover:text-foreground"
                        onClick={handleBack}
                        title="Kembali"
                    >
                        <ArrowLeft className="size-5" />
                    </Button>
                )}
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="size-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-semibold tracking-tight truncate">{title}</h1>
                        {badge && (
                            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                {badge}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{desc}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative space-y-3 text-center">
            {showBack && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -left-1 top-0 gap-1.5 text-muted-foreground hover:text-foreground"
                    onClick={handleBack}
                >
                    <ArrowLeft className="size-4" />
                    Kembali
                </Button>
            )}
            <div className="pt-8">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="size-7 text-primary" />
                </div>
            </div>
            <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                    <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
                    {badge && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {badge}
                        </span>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
        </div>
    )
}
