import {cache} from 'react'
import {GitHubRepo, GitHubProjectsProps} from './types'
import {filterRepos, sortRepos} from './utils'
import GitHubProjectsClient from './GitHubProjectsClient'

const fetchRepo = cache(async (fullSlug: string): Promise<GitHubRepo | null> => {
    try {
        const res = await fetch(`https://api.github.com/repos/${fullSlug}`, {
            next: {revalidate: 3600}
        })
        if (!res.ok) return null
        return res.json()
    } catch {
        return null
    }
})

const fetchUserRepos = cache(async (username: string): Promise<GitHubRepo[]> => {
    try {
        const res = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=100&type=public`,
            {next: {revalidate: 3600}}
        )
        if (!res.ok) return []
        return res.json()
    } catch {
        return []
    }
})

function toFullSlug(entry: string, username: string) {
    return entry.includes('/') ? entry : `${username}/${entry}`
}

export default async function GitHubProjects({
    username,
    hasTag,
    starCountMin,
    hasWebsiteLink,
    hasDescription,
    excludeArchived = true,
    editedThisYear,
    sortBy = 'starCount',
    exclude = [],
    include = [],
    hideFilter,
}: GitHubProjectsProps) {
    const normalizedInclude = include.map(s => toFullSlug(s, username)).filter(Boolean)
    const normalizedExclude = exclude.map(s => toFullSlug(s, username)).filter(Boolean)

    const [userRepos, ...includedRepos] = await Promise.all([
        fetchUserRepos(username),
        ...normalizedInclude.map(slug => {
            const [owner] = slug.split('/')
            return owner !== username ? fetchRepo(slug) : Promise.resolve(null)
        }),
    ])

    const filtered = filterRepos(userRepos, {hasTag, starCountMin, hasWebsiteLink, hasDescription, excludeArchived, editedThisYear, exclude: normalizedExclude})

    const seen = new Set(filtered.map(r => r.full_name))
    const extras = (includedRepos.filter(Boolean) as GitHubRepo[]).filter(r => !seen.has(r.full_name))

    const sameOwnerForced = normalizedInclude
        .filter(slug => slug.split('/')[0] === username)
        .map(slug => userRepos.find(r => r.name === slug.split('/')[1]))
        .filter((r): r is GitHubRepo => !!r && !seen.has(r.full_name))

    const merged = sortRepos([...filtered, ...extras, ...sameOwnerForced], sortBy)

    return (
        <GitHubProjectsClient
            repos={merged}
            filterSummary={{hasTag, starCountMin, hasWebsiteLink, hasDescription, excludeArchived, editedThisYear}}
            hideFilter={hideFilter}
        />
    )
}
