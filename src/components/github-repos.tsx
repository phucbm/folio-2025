import {cache} from 'react'
import {LinkBlock} from "@/components/link-block";
import {IconStarFilled} from "@tabler/icons-react";

interface Repo {
    id: number
    name: string
    html_url: string
    description: string | null
    homepage: string | null
    stargazers_count: number
    updated_at: string
    fork: boolean
    archived: boolean
    is_template: boolean
}

interface GitHubReposProps {
    username: string
    lastUpdatedMonths?: number
    max?: number
    minStar?: number
}

// Cache the fetch function
const getGitHubRepos = cache(async (username: string, lastUpdatedMonths: number = 12, max: number = 10) => {
    try {
        const res = await fetch(
            `https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=100`,
            {
                next: {revalidate: 3600} // Revalidate every hour
            }
        )

        if (!res.ok) throw new Error('Failed to fetch repos')

        const data: Repo[] = await res.json()

        // Calculate the cutoff date
        const cutoffDate = new Date()
        cutoffDate.setMonth(cutoffDate.getMonth() - lastUpdatedMonths)

        // Filter repos updated within the time range and exclude forks
        const recentRepos = data.filter(repo => {
            const updatedDate = new Date(repo.updated_at)
            return updatedDate >= cutoffDate && !repo.fork
        })

        // Sort by stars first (descending), then by last update (descending)
        return recentRepos
            .sort((a, b) => {
                // First compare by stars
                const starDiff = b.stargazers_count - a.stargazers_count
                if (starDiff !== 0) return starDiff

                // If stars are equal, compare by update date
                return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            })
            .slice(0, max)
    } catch (error) {
        console.error('Error fetching GitHub repos:', error)
        return []
    }
})

export default async function GitHubRepos({username, lastUpdatedMonths = 12, max = 10, minStar = 0}: GitHubReposProps) {
    let repos = await getGitHubRepos(username, lastUpdatedMonths, max)

    if (repos.length === 0) {
        return <div>No repos found in the last {lastUpdatedMonths} months</div>
    }

    // filter min star
    repos = repos.filter(item => item.stargazers_count >= minStar);

    return (
        <ul className="space-y-8 not-prose pt-4">
            {repos.map(repo => (
                <li key={repo.id} className="">
                    <LinkBlock title={
                        <div className="flex items-center gap-3">
                            {repo.name}
                            <span className="flex gap-1 items-center text-sm">
                                <IconStarFilled className="w-4 text-yellow-400"/> {repo.stargazers_count}
                            </span>
                            {repo.is_template && (
                                <span
                                    className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
                                    Template
                                </span>
                            )}
                            {repo.archived && (
                                <span
                                    className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full dark:bg-gray-800 dark:text-gray-300">
                                    Archived
                                </span>
                            )}
                        </div>
                    }
                               description={repo.description}
                               href={repo.html_url}/>
                </li>
            ))}
        </ul>
    )
}