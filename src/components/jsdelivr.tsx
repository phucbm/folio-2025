import {LinkBlock} from "@/components/link-block";
import {formatNumber, JsDelivrPackage, JsDelivrPackages} from "@/components/phucbm/jsdelivr";
import {getJsDelivrPackages} from "@/lib/getJsDelivrPackages";
import {getPublicGithubRepos} from "@/lib/getPublicGithubRepos";
import {formatOrdinal} from "@/lib/formatOrdinal";
import {IconActivity, IconCaretDownFilled, IconCaretUpFilled} from "@tabler/icons-react";

export interface JsDelivrPackagesWrapperProps {
    packageNames?: string[]
    username?: string
    namespace?: string
    statsPeriod?: 'week' | 'month' | 'year'
    showBandwidth?: boolean
    showRankText?: boolean
    minHits?: number
    max?: number
    lastUpdatedMonths?: number
}

export default async function JsDelivrPackagesWrapper({
                                                          packageNames,
                                                          username,
                                                          namespace = 'phucbm',
                                                          statsPeriod = 'month',
                                                          showBandwidth = true,
                                                          showRankText = true,
                                                          minHits = 10,
                                                          max = 100,
                                                          lastUpdatedMonths = 12
                                                      }: JsDelivrPackagesWrapperProps) {
    let names = packageNames

    // If packageNames not provided, fetch from GitHub
    if (!names && username) {
        const repos = await getPublicGithubRepos(username, max, lastUpdatedMonths)
        names = repos.map((repo: any) => repo.name)
    }

    if (!names || names.length === 0) {
        return <div className="text-muted-foreground">No packages found</div>
    }

    const packages = await getJsDelivrPackages(names, namespace, statsPeriod, minHits)

    // Custom renderer using LinkBlock
    const renderItem = (pkg: JsDelivrPackage, periodText: string) => (
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
                </div>
            }
            href={pkg.jsDelivrUrl}
        />
    )

    return (
        <JsDelivrPackages
            packages={packages}
            statsPeriod={statsPeriod}
            showBandwidth={showBandwidth}
            showRankText={showRankText}
            lastUpdatedMonths={lastUpdatedMonths}
            renderItem={renderItem}
        />
    )
}