import {cache} from 'react'
import {LinkBlock} from "@/components/link-block";
import {IconDownload} from "@tabler/icons-react";

interface NpmPackage {
    name: string
    version: string
    description: string
    links: {
        npm: string
        homepage?: string
        repository?: string
    }
    downloads: number
    date: string
}

interface NpmPackagesProps {
    org: string
    lastUpdatedMonths?: number
    max?: number
    downloadPeriod?: 'week' | 'month' | 'year' | 'all-time'
}

// Cache the fetch function
const getNpmPackages = cache(async (
    org: string,
    lastUpdatedMonths: number = 12,
    max: number = 10,
    downloadPeriod: 'week' | 'month' | 'year' | 'all-time' = 'week'
) => {
    try {
        // Fetch packages from the organization scope
        const searchRes = await fetch(
            `https://registry.npmjs.org/-/v1/search?text=@${org}&size=250`,
            {
                next: {revalidate: 3600} // Revalidate every hour
            }
        )

        if (!searchRes.ok) throw new Error('Failed to fetch npm packages')

        const searchData = await searchRes.json()
        const packages = searchData.objects || []

        // Calculate the cutoff date
        const cutoffDate = new Date()
        cutoffDate.setMonth(cutoffDate.getMonth() - lastUpdatedMonths)

        // Filter and transform packages
        const recentPackages: NpmPackage[] = []

        for (const pkg of packages) {
            const updatedDate = new Date(pkg.package.date)
            if (updatedDate >= cutoffDate) {
                let downloads = 0

                // Get downloads based on period
                if (downloadPeriod === 'week') {
                    downloads = pkg.downloads?.weekly || 0
                } else if (downloadPeriod === 'month') {
                    downloads = pkg.downloads?.monthly || 0
                } else {
                    // For year and all-time, we need to fetch from the downloads API
                    try {
                        const period = downloadPeriod === 'year' ? 'last-year' : '1900-01-01:2100-12-31'
                        const downloadsRes = await fetch(
                            `https://api.npmjs.org/downloads/point/${period}/${pkg.package.name}`,
                            {
                                next: {revalidate: 3600}
                            }
                        )

                        if (downloadsRes.ok) {
                            const downloadsData = await downloadsRes.json()
                            downloads = downloadsData.downloads || 0
                        }
                    } catch {
                        downloads = 0
                    }
                }

                recentPackages.push({
                    name: pkg.package.name,
                    version: pkg.package.version,
                    description: pkg.package.description || '',
                    links: pkg.package.links || {npm: `https://www.npmjs.com/package/${pkg.package.name}`},
                    downloads,
                    date: pkg.package.date
                })
            }
        }

        // Sort by downloads first (descending), then by last update (descending)
        return recentPackages
            .sort((a, b) => {
                // First compare by downloads
                const downloadDiff = b.downloads - a.downloads
                if (downloadDiff !== 0) return downloadDiff

                // If downloads are equal, compare by update date
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            })
            .slice(0, max)
    } catch (error) {
        console.error('Error fetching npm packages:', error)
        return []
    }
})

// Format downloads count for display
function formatDownloads(count: number): string {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
}

export default async function NpmPackages({
                                              org,
                                              lastUpdatedMonths = 12,
                                              max = 10,
                                              downloadPeriod = 'week'
                                          }: NpmPackagesProps) {
    const packages = await getNpmPackages(org, lastUpdatedMonths, max, downloadPeriod)

    if (packages.length === 0) {
        return <div>No packages found in the last {lastUpdatedMonths} months</div>
    }

    // Map period to display text
    const periodText = {
        'week': 'per week',
        'month': 'per month',
        'year': 'per year',
        'all-time': 'all time'
    }[downloadPeriod]

    return (
        <ul className="space-y-8 not-prose pt-4">
            {packages.map(pkg => (
                <li key={pkg.name}>
                    <LinkBlock
                        title={
                            <div className="flex items-center gap-3">
                                {pkg.name}
                                <span className="flex gap-1 items-center text-sm">
                                    <IconDownload className="w-4"/>
                                    {formatDownloads(pkg.downloads)}
                                    {/*{periodText}*/}
                                </span>
                            </div>
                        }
                        description={pkg.description}
                        href={pkg.links.npm}
                    />
                </li>
            ))}
        </ul>
    )
}