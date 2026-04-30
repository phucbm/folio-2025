export interface GitHubRepo {
    id: number
    name: string
    full_name: string
    html_url: string
    description: string | null
    homepage: string | null
    stargazers_count: number
    language: string | null
    topics: string[]
    updated_at: string
    created_at: string
    fork: boolean
    archived: boolean
    is_template: boolean
    owner: { login: string }
}

export interface GitHubProjectsProps {
    username: string
    hasTag?: string
    starCountMin?: number
    hasWebsiteLink?: boolean
    hasDescription?: boolean
    excludeArchived?: boolean
    editedThisYear?: boolean
    sortBy?: 'starCount' | 'lastEdit' | 'created'
    exclude?: string[]
    include?: string[]
    hideFilter?: boolean
    onlyInclude?: boolean
}

export interface GitHubProjectsFilterSummary {
    hasTag?: string
    starCountMin?: number
    hasWebsiteLink?: boolean
    hasDescription?: boolean
    excludeArchived?: boolean
    editedThisYear?: boolean
}
