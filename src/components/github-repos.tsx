import {cache} from 'react'
import {LinkBlock} from "@/components/link-block";
import {IconStar} from "@tabler/icons-react";

interface Repo {
    id: number
    name: string
    html_url: string
    description: string | null
    homepage: string | null
    stargazers_count: number
    updated_at: string
}

interface GitHubReposProps {
    username: string
    lastUpdatedMonths?: number
    max?: number
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

        // Filter repos updated within the time range
        const recentRepos = data.filter(repo => {
            const updatedDate = new Date(repo.updated_at)
            return updatedDate >= cutoffDate
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

export default async function GitHubRepos({username, lastUpdatedMonths = 12, max = 10}: GitHubReposProps) {
    const repos = await getGitHubRepos(username, lastUpdatedMonths, max)

    if (repos.length === 0) {
        return <div>No repos found in the last {lastUpdatedMonths} months</div>
    }

    return (
        <ul className="space-y-8 not-prose pt-4">
            {repos.map(repo => (
                <li key={repo.id} className="">
                    <LinkBlock title={
                        <div className="flex items-center gap-3">
                            {repo.name}
                                <span className="flex gap-1 items-center text-sm"><IconStar
                                    className="w-4"/> {repo.stargazers_count}</span>
                        </div>
                    }
                               description={repo.description}
                               href={repo.html_url}/>
                </li>
            ))}
        </ul>
    )
}