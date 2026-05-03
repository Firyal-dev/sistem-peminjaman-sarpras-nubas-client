import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/common/components/ui/card"
import { cn } from "@/common/lib/utils"

interface StatCardProps {
    title: string
    value: number | string
    icon: LucideIcon
    desc: string
    variant?: "default" | "warning" | "success" | "info"
    sub?: string
}

const variantStyles = {
    default: "bg-primary/10 text-primary",
    warning: "bg-destructive/10 text-destructive",
    success: "bg-green-500/10 text-green-600",
    info:    "bg-blue-500/10 text-blue-600",
}

const valueStyles = {
    default: "",
    warning: "text-destructive",
    success: "text-green-600",
    info:    "text-blue-600",
}

export const StatCard = ({ title, value, icon: Icon, desc, variant = "default", sub }: StatCardProps) => {
    return (
        <Card>
            <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
                        <p className={cn("text-3xl font-bold tabular-nums", valueStyles[variant])}>
                            {value}
                        </p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                        {sub && (
                            <p className="text-xs font-medium text-muted-foreground">{sub}</p>
                        )}
                    </div>
                    <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", variantStyles[variant])}>
                        <Icon className="size-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
