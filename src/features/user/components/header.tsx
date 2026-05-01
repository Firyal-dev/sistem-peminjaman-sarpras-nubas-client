import type { LucideIcon } from "lucide-react"

interface UserHeaderProps {
    icon: LucideIcon
    title: string
    desc: string
}

export const UserHeader = ({ icon: Icon, title, desc }: UserHeaderProps) => {
    return (
        <div className="space-y-1 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
                <Icon className="size-6 text-primary" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
    )
}
