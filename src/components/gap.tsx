import {cn} from "@/lib/utils";

type Props = {
    /**
     * Additional class names for the wrapper div.
     */
    className?: string;

    /**
     * Height multiplier using your spacing scale.
     * The final height = calc(var(--spacing) * height).
     *
     * Accepts any number.
     *
     * Example:
     * height={20} → height: calc(var(--spacing) * 20)
     */
    height?: number;
};

export function Gap({className, height = 4}: Props) {
    const style: React.CSSProperties = {
        height: `calc(var(--spacing) * ${height})`,
    };

    // var(--spacing) assumed to be 4px → rem = (height * 4) / 16
    const remValue = `${height / 4}rem`;

    return (
        <div
            className={cn("group dev-borders-y relative", className)}
            style={style}
        >
          <span className="absolute inset-0 opacity-20 dev-gap-bg"></span>

            <span
                className="absolute inset-0 transition-opacity opacity-0 group-hover:opacity-100
                flex items-center justify-center text-center text-xs
                ">
                <span className="bg-background p-0.5 opacity-50">
                      {remValue}
                </span>
            </span>
        </div>
    );
}
