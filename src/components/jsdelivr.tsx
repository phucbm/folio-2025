import {cache} from 'react'
import {LinkBlock} from "@/components/link-block";
import {IconActivity, IconCaretDownFilled, IconCaretUpFilled} from "@tabler/icons-react";

interface JsDelivrPackage {
    name: string
    description: string | null
    jsDelivrUrl: string
    githubUrl: string
    hits: number
    bandwidth: number
    rank: number
    prevRank: number
}

interface JsDelivrPackagesProps {
    username: string
    lastUpdatedMonths?: number
    max?: number
    statsPeriod?: 'week' | 'month' | 'year'
    hideZeroHits?: boolean
    showBandwidth?: boolean
    showRankText?: boolean
    minHits?: number
}

// Cache the fetch function
const getJsDelivrPackages = cache(async (
    username: string,
    lastUpdatedMonths: number = 12,
    max: number = 10,
    statsPeriod: 'week' | 'month' | 'year' = 'month',
    hideZeroHits: boolean = false,
    minHits: number = 10
) => {
    try {
        // First, get all GitHub repos
        const reposRes = await fetch(
            `https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=100`,
            {
                next: {revalidate: 3600}
            }
        )

        if (!reposRes.ok) throw new Error('Failed to fetch repos')

        const repos = await reposRes.json()

        // Calculate the cutoff date
        const cutoffDate = new Date()
        cutoffDate.setMonth(cutoffDate.getMonth() - lastUpdatedMonths)

        // Filter repos updated within the time range
        const recentRepos = repos.filter((repo: any) => {
            const updatedDate = new Date(repo.updated_at)
            return updatedDate >= cutoffDate
        })

        // Check each repo on jsDelivr and get stats
        const jsDelivrPackages: JsDelivrPackage[] = []

        for (const repo of recentRepos) {
            try {
                // Fetch stats for the package directly
                const statsRes = await fetch(
                    `https://data.jsdelivr.com/v1/stats/packages/gh/${username}/${repo.name}`,
                    {
                        next: {revalidate: 3600}
                    }
                )

                if (statsRes.ok) {
                    const statsData = await statsRes.json()

                    // Calculate stats based on period from the dates object
                    let hits = 0
                    let bandwidth = 0

                    if (statsData.hits?.dates && statsData.bandwidth?.dates) {
                        const hitDates = Object.entries(statsData.hits.dates)
                        const bandwidthDates = Object.entries(statsData.bandwidth.dates)

                        // Determine how many days to sum based on period
                        let daysToSum = 30 // default month
                        if (statsPeriod === 'week') {
                            daysToSum = 7
                        } else if (statsPeriod === 'year') {
                            daysToSum = 365
                        }

                        // Sum the last N days
                        const recentHitDates = hitDates.slice(-daysToSum)
                        const recentBandwidthDates = bandwidthDates.slice(-daysToSum)

                        hits = recentHitDates.reduce((sum, [_, value]) => sum + (value as number), 0)
                        bandwidth = recentBandwidthDates.reduce((sum, [_, value]) => sum + (value as number), 0)
                    }

                    jsDelivrPackages.push({
                        name: repo.name,
                        description: repo.description,
                        jsDelivrUrl: `https://www.jsdelivr.com/package/gh/${username}/${repo.name}`,
                        githubUrl: repo.html_url,
                        hits,
                        bandwidth,
                        rank: statsData.hits?.rank || 0,
                        prevRank: statsData.hits?.prev?.rank || 0
                    })
                }
            } catch (error) {
                // Skip repos that fail
                continue
            }
        }

        // Sort by hits (descending) and filter by minimum hits
        return jsDelivrPackages
            .filter(pkg => pkg.hits >= minHits)
            .sort((a, b) => b.hits - a.hits)
            .slice(0, max)
    } catch (error) {
        console.error('Error fetching jsDelivr packages:', error)
        return []
    }
})

// Format numbers for display
function formatNumber(num: number): string {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
}

// Format bandwidth (bytes to human readable)
function formatBandwidth(bytes: number): string {
    if (bytes >= 1000000000) {
        return `${(bytes / 1000000000).toFixed(1)}GB`
    }
    if (bytes >= 1000000) {
        return `${(bytes / 1000000).toFixed(1)}MB`
    }
    if (bytes >= 1000) {
        return `${(bytes / 1000).toFixed(1)}KB`
    }
    return `${bytes}B`
}

// Format ordinal numbers (1st, 2nd, 3rd, etc.)
function formatOrdinal(num: number): string {
    // Format number with commas
    const formattedNum = num.toLocaleString('en-US')

    const j = num % 10
    const k = num % 100
    if (j === 1 && k !== 11) {
        return formattedNum + "st"
    }
    if (j === 2 && k !== 12) {
        return formattedNum + "nd"
    }
    if (j === 3 && k !== 13) {
        return formattedNum + "rd"
    }
    return formattedNum + "th"
}

export default async function JsDelivrPackages({
                                                   username,
                                                   lastUpdatedMonths = 12,
                                                   max = 10,
                                                   statsPeriod = 'month',
                                                   hideZeroHits = false,
                                                   showBandwidth = false,
                                                   showRankText = true,
                                                   minHits = 10
                                               }: JsDelivrPackagesProps) {
    const packages = await getJsDelivrPackages(username, lastUpdatedMonths, max, statsPeriod, hideZeroHits, minHits)

    if (packages.length === 0) {
        return <div>No packages found on jsDelivr in the last {lastUpdatedMonths} months</div>
    }

    // Map period to display text
    const periodText = {
        'week': 'per week',
        'month': 'per month',
        'year': 'per year'
    }[statsPeriod]

    return (
        <ul className="space-y-8 not-prose pt-4">
            {packages.map(pkg => (
                <li key={pkg.name}>
                    <LinkBlock
                        title={
                            <div className="flex flex-wrap items-center gap-x-3">
                                {pkg.name}
                                <span className="flex gap-1 items-center text-sm">
                                    <IconActivity className="w-4 text-blue-500"/>
                                    {formatNumber(pkg.hits)} hits {periodText}
                                </span>
                                {pkg.rank > 0 && (
                                    <span className="inline-flex gap-1 items-center text-xs opacity-70">
                                        #{formatNumber(pkg.rank)}
                                        {pkg.prevRank > 0 && pkg.prevRank !== pkg.rank && (
                                            <>
                                                {pkg.rank < pkg.prevRank ? (
                                                    <>
                                                        <IconCaretUpFilled className="w-3 text-green-500"/>
                                                        <span
                                                            className="text-green-500">+{(pkg.prevRank - pkg.rank).toLocaleString('en-US')}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <IconCaretDownFilled className="w-3 text-red-500"/>
                                                        <span
                                                            className="text-red-500">-{(pkg.rank - pkg.prevRank).toLocaleString('en-US')}</span>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </span>
                                )}
                            </div>
                        }
                        description={
                            <div>
                                {pkg.description}
                                {showRankText && pkg.rank > 0 && (
                                    <div className="text-xs opacity-70 mt-1">
                                        The {formatOrdinal(pkg.rank)} most popular on jsDelivr
                                    </div>
                                )}
                                {showBandwidth && (
                                    <div className="text-xs opacity-70 mt-1">
                                        Bandwidth: {formatBandwidth(pkg.bandwidth)} {periodText}
                                    </div>
                                )}
                            </div>
                        }
                        href={pkg.jsDelivrUrl}
                    />
                </li>
            ))}
        </ul>
    )
}