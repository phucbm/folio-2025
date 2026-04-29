type StatusItem = { label: string; value: string }

type Props = {
    items?: StatusItem[]
}

const defaultItems: StatusItem[] = [
    {label: "ROLE", value: "AI ENGINEER"},
    {label: "STUDIO", value: "PERXEL.COM"},
    {label: "SINCE", value: "2018"},
    {label: "STATUS", value: "OPEN"},
]

export function StatusBar({items = defaultItems}: Props) {
    return (
        <div className="grid sm:grid-cols-4 grid-cols-2 border-t border-l border-border -mx-1 my-6">
            {items.map(({label, value}) => (
                <div key={label} className="border-r border-b border-border px-3 py-2">
                    <div className="text-[0.6rem] uppercase tracking-widest text-muted-foreground mb-0.5">
                        {label}
                    </div>
                    <div className="text-xs uppercase tracking-wider font-bold">
                        {value}
                    </div>
                </div>
            ))}
        </div>
    )
}
