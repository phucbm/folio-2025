type ProjectItem = {
    title: string
    description: string
    href?: string
}

type Props = {
    items: ProjectItem[]
}

export function ProjectsGrid({items}: Props) {
    return (
        <div className="grid sm:grid-cols-2 border-t border-l border-border my-4">
            {items.map(({title, description, href}) => {
                const inner = (
                    <div className="border-r border-b border-border px-3 py-3 h-full group">
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="text-xs uppercase tracking-widest font-bold">
                                {title}
                            </span>
                            {href && (
                                <span className="text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity shrink-0 text-xs">
                                    ↗
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-snug m-0">{description}</p>
                    </div>
                )

                if (href) {
                    return (
                        <a
                            key={title}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="no-underline hover:bg-muted transition-colors"
                        >
                            {inner}
                        </a>
                    )
                }

                return <div key={title}>{inner}</div>
            })}
        </div>
    )
}
