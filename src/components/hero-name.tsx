type Props = {
    name?: string
    role?: string
}

export function HeroName({name = "Phuc Bui", role = "AI Engineer"}: Props) {
    return (
        <div className="mb-2">
            <h1 className="brut-h1">{name}</h1>
            <p className="text-muted-foreground text-sm uppercase tracking-widest hidden">{role}</p>
        </div>
    )
}
