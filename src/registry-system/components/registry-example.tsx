import * as React from "react";
import {getRegistryItem} from "@/registry-system/lib/getRegistryItem";
import {SandpackExampleCode} from "@/registry-system/components/sandpack-example-code";

type Props = { name: string };

export async function RegistryExample({name}: Props) {
    const registryItem = await getRegistryItem(name);
    return (
        <SandpackExampleCode registryItem={registryItem}/>
    );
}
