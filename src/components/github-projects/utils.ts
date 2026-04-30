import {GitHubRepo, GitHubProjectsProps} from './types'

export function filterRepos(
    repos: GitHubRepo[],
    opts: Pick<GitHubProjectsProps, 'hasTag' | 'starCountMin' | 'hasWebsiteLink' | 'hasDescription' | 'excludeArchived' | 'editedThisYear' | 'exclude'>
): GitHubRepo[] {
    const {hasTag, starCountMin, hasWebsiteLink, hasDescription, excludeArchived = true, editedThisYear, exclude} = opts
    const requiredTags = hasTag ? hasTag.split(',').map(t => t.trim()).filter(Boolean) : []
    const thisYear = new Date().getFullYear()

    return repos.filter(repo => {
        if (exclude?.includes(repo.full_name)) return false
        if (excludeArchived && repo.archived) return false
        if (editedThisYear && new Date(repo.updated_at).getFullYear() !== thisYear) return false
        if (requiredTags.length > 0 && !requiredTags.every(tag => repo.topics.includes(tag))) return false
        if (starCountMin !== undefined && repo.stargazers_count < starCountMin) return false
        if (hasWebsiteLink && !repo.homepage) return false
        if (hasDescription && !repo.description?.trim()) return false
        return true
    })
}

export function sortRepos(repos: GitHubRepo[], sortBy: GitHubProjectsProps['sortBy'] = 'starCount'): GitHubRepo[] {
    return [...repos].sort((a, b) => {
        if (sortBy === 'lastEdit') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        if (sortBy === 'created') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        return b.stargazers_count - a.stargazers_count
    })
}

export function repoOgImage(fullName: string) {
    return `https://opengraph.github.com/repo/${fullName}`
}
