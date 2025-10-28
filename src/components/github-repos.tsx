import {cache} from 'react'

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

        // Sort by stars and take top 10
        const sortedByStars = recentRepos
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, max)

        return sortedByStars
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
        <ul className="space-y-4 not-prose">
            {repos.map(repo => (
                <li key={repo.id} className="">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="heading-2 flex gap-2 items-center">
                                <a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    {repo.name}
                                </a>
                                <div className="flex items-center gap-1 text-sm">
                                    <span>⭐</span>
                                    <span>{repo.stargazers_count}</span>
                                </div>
                            </h3>

                            {repo.description && (
                                <p className="text-gray-600 mt-1">{repo.description}</p>
                            )}

                            {repo.homepage && (
                                <a
                                    href={repo.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                                >
                                    🔗 Website
                                </a>
                            )}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}