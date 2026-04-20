import {REGISTRY_NAMESPACE, REGISTRY_FOLDER, REGISTRY_SITE_URL} from "@/registry-system/lib/registry-config";

export function getRegistryUrl({name, fileNamePostfix = ''}: { name: string, fileNamePostfix?: string }) {
    // point to example of the registry so v0 can deploy with full demo
    return `@${REGISTRY_NAMESPACE}/${name}${fileNamePostfix}`;
    // return `${REGISTRY_SITE_URL}/${REGISTRY_FOLDER}/${name}${fileNamePostfix}.json`;
}