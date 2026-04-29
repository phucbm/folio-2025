/**
 * ARCHIVED: This function is no longer used in the main flow.
 * Keeping it as reference for potential future use.
 *
 * The original approach was to fetch all public repos from GitHub
 * and then check which ones are published on jsDelivr.
 * This was inefficient as it wasted API quota on repos not on jsDelivr.
 *
 * Current approach: Use getJsDelivrPackages.ts with a predefined array
 * of jsDelivr package names instead.
 */

export async function getPublicGithubRepos(
    username: string,
    max: number = 10,
    lastUpdatedMonths: number = 12
) {
    try {
        // Build GitHub API headers (with optional token for higher rate limits)
        const headers: Record<string, string> = {}
        if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
        }

        // Fetch all GitHub repos
        const reposRes = await fetch(
            `https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=${max}`,
            {
                headers,
                next: {revalidate: 3600}
            }
        )

        if (!reposRes.ok) {
            const errorMsg = reposRes.status === 403
                ? 'GitHub API rate limit exceeded. Add GITHUB_TOKEN for higher limits.'
                : `GitHub API returned ${reposRes.status} ${reposRes.statusText}`
            console.error('Error fetching GitHub repos:', errorMsg)
            return []
        }

        const repos = await reposRes.json()

        // Calculate the cutoff date
        const cutoffDate = new Date()
        cutoffDate.setMonth(cutoffDate.getMonth() - lastUpdatedMonths)

        // Filter repos updated within the time range
        return repos.filter((repo: any) => {
            const updatedDate = new Date(repo.updated_at)
            return updatedDate >= cutoffDate
        })
    } catch (error) {
        console.error('Error fetching GitHub repos:', error)
        return []
    }
}
