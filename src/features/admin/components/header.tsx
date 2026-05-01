interface HeaderProps {
    title: string
    desc: string
}

export const Header = ({ title, desc }: HeaderProps) => {
    return (
        <header>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{desc}</p>
        </header>
    )
}
