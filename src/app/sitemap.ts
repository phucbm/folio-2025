import type {MetadataRoute} from 'next'
import {getPageMap} from 'nextra/page-map'

type PageMapItem = {
    name: string
    route: string
    frontMatter?: {
        title?: string
        description?: string
        filePath?: string
        timestamp?: number
    }
    title?: string
    children?: PageMapItem[]
    kind?: string
    data?: any
}

function extractRoutesFromPageMap(
    pageMap: PageMapItem[],
    routes: Set<string> = new Set()
): Set<string> {
    for (const item of pageMap) {
        // Skip meta data entries
        if (item.data !== undefined) continue

        // Add the current route if it exists
        if (item.route) {
            routes.add(item.route)
        }

        // Recursively process children
        if (item.children && Array.isArray(item.children)) {
            extractRoutesFromPageMap(item.children, routes)
        }
    }

    return routes
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'
    const pageMap = await getPageMap() as PageMapItem[]

    // Extract all routes from the pageMap
    const routes = extractRoutesFromPageMap(pageMap)

    // Convert to sitemap format
    return Array.from(routes).map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '/' ? 1 : 0.8,
    }))
}