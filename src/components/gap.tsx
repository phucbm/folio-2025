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

    return (
        <div className={cn(className)} style={style} />
    );
}
