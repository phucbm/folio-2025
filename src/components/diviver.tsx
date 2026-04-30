type DiviverSize = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<DiviverSize, string> = {
    sm: "2rem",
    md: "4rem",
    lg: "8rem",
    xl: "12rem",
};

type Props = {
    size?: DiviverSize;
};

export function Diviver({size = "md"}: Props) {
    return <div style={{paddingTop: sizeMap[size]}} />;
}
