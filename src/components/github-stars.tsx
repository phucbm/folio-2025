import {IconStar} from "@tabler/icons-react";
import {Link} from "next-view-transitions";
import {cache} from 'react'

interface GitHubStarsProps {
    repo: string
}

// Cache the fetch function
const getGitHubStars = cache(async (repo: string) => {
    try {
        // Extract owner and repo name from URL
        const match = repo.match(/github\.com\/([^\/]+)\/([^\/]+)/)
        if (!match) return null

        const [, owner, repoName] = match

        const res = await fetch(
            `https://api.github.com/repos/${owner}/${repoName}`,
            {
                next: {revalidate: 3600} // Revalidate every hour
            }
        )

        if (!res.ok) throw new Error('Failed to fetch stars')

        const data = await res.json()
        return data.stargazers_count
    } catch (error) {
        console.error('Error fetching stars:', error)
        return null
    }
})

export async function GitHubStars({repo}: GitHubStarsProps) {
    const stars = await getGitHubStars(repo)

    if (stars === null) return <span>-</span>

    return (
        <Link
            href={repo}
            target="_blank"
            className="inline-flex items-center text-sm gap-1 no-underline hover:no-underline not-prose"
        >
            <IconStar className="w-4"/> {stars}
        </Link>
    )
}