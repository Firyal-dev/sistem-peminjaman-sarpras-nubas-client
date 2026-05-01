import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/common/components/ui/card"

interface StatCardProps {
    title: string
    value: number | string
    icon: LucideIcon
    desc: string
}

export const StatCard = ({ title, value, icon: Icon, desc }: StatCardProps) => {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <p className="text-3xl font-semibold">{value}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="size-5 text-primary" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
