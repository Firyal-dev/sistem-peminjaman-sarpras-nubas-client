import type { ReactNode } from "react"

interface HeaderProps {
    title: string
    desc: string
    actions?: ReactNode
}

export const Header = ({ title, desc, actions }: HeaderProps) => {
    return (
        <header className="flex items-start justify-between gap-4">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
        </header>
    )
}
