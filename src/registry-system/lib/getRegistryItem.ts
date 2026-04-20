import {RegistryItem} from "shadcn/schema";

export async function getRegistryItem(
    name: string,
    exampleFileName?: string
): Promise<RegistryItem> | null {
    if (!name) return null;

    // Use process.env directly so webpack can inline the value for dynamic import context
    const ns = process.env.NEXT_PUBLIC_REGISTRY_NAMESPACE ?? "phucbm";

    let baseItem: RegistryItem | null = null;
    try {
        const mod = await import(`@/registry/${ns}/blocks/${name}/registry-item.json`);
        baseItem = mod.default as RegistryItem;
    } catch (error) {
        console.warn(`Registry item not found for: "${name}"`, error);
        return null;
    }

    if (!exampleFileName) return baseItem;

    try {
        const mod = await import(`@/registry/${ns}/blocks/${name}/${exampleFileName}.json`);
        const exampleOverrides = mod.default as Partial<RegistryItem>;
        // @ts-ignore
        return {
            ...baseItem,
            ...exampleOverrides,
            files: [...(baseItem.files || []), ...(exampleOverrides.files || [])],
        };
    } catch {
        return baseItem;
    }
}
