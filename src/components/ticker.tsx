type Props = {
    items?: string[]
    speed?: number
}

const defaultItems = [
    "AI ENGINEER",
    "PERXEL.COM",
    "SINCE 2018",
    "MOTION + AI",
    "PHUC BUI",
    "GSAP",
    "NEXT.JS",
    "WEB STUDIO",
]

export function Ticker({items = defaultItems, speed = 35}: Props) {
    const text = items.join("  ///  ") + "  ///  "

    return (
        <div className="overflow-hidden border-y border-border py-2 -mx-1 my-6">
            <div
                className="flex w-max"
                style={{animation: `ticker-scroll ${speed}s linear infinite`}}
            >
                {[0, 1].map(i => (
                    <span
                        key={i}
                        className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground whitespace-nowrap px-8"
                    >
                        {text}
                    </span>
                ))}
            </div>
            <style>{`
                @keyframes ticker-scroll {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    )
}
