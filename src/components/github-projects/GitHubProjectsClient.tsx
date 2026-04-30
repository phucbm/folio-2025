'use client'

import {useState, useEffect} from 'react'
import {Link} from 'next-view-transitions'
import {GitHubRepo, GitHubProjectsFilterSummary} from './types'

interface GitHubProjectsClientProps {
    repos: GitHubRepo[]
    filterSummary?: GitHubProjectsFilterSummary
    hideFilter?: boolean
}

const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    CSS: '#563d7c',
    HTML: '#e34c26',
    Vue: '#41b883',
    PHP: '#4F5D95',
    Shell: '#89e051',
}

function formatDate(iso: string) {
    const date = new Date(iso)
    const isThisYear = date.getFullYear() === new Date().getFullYear()
    return isThisYear
        ? date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})
        : date.toLocaleDateString('en-US', {month: 'short', year: 'numeric'})
}

function FilterSummaryLine({summary, total, showing}: {
    summary: GitHubProjectsFilterSummary
    total: number
    showing: number
}) {
    const parts: string[] = []
    if (summary.starCountMin !== undefined) parts.push(`★ ${summary.starCountMin}+ stars`)
    if (summary.hasDescription) parts.push('has description')
    if (summary.hasWebsiteLink) parts.push('has website')
    if (summary.hasTag) parts.push(`tagged "${summary.hasTag}"`)
    if (summary.excludeArchived) parts.push('excluding archived')
    if (summary.editedThisYear) parts.push('edited this year')

    return (
        <p className="text-xs text-muted-foreground mt-6 uppercase tracking-widest">
            Showing {showing}{showing !== total ? ` of ${total}` : ''} repo{total !== 1 ? 's' : ''}
            {parts.length > 0 && <> · {parts.join(' · ')}</>}
        </p>
    )
}

export default function GitHubProjectsClient({repos, filterSummary, hideFilter}: GitHubProjectsClientProps) {
    const [selectedTag, setSelectedTag] = useState('')

    useEffect(() => {
        const hash = window.location.hash.slice(1)
        if (hash) setSelectedTag(decodeURIComponent(hash))
    }, [])

    const handleTagChange = (tag: string) => {
        setSelectedTag(tag)
        if (tag) {
            window.history.pushState(null, '', `#${encodeURIComponent(tag)}`)
        } else {
            window.history.pushState(null, '', window.location.pathname)
        }
    }

    const allTags = [...new Set(repos.flatMap(r => r.topics))].sort()

    const filtered = selectedTag
        ? repos.filter(r => r.topics.includes(selectedTag))
        : repos

    return (
        <div className="not-prose">
            {/* Filter bar */}
            {!hideFilter && allTags.length > 0 && (
                <div className="mb-0 flex flex-wrap gap-0 border-t border-l border-border">
                    <button
                        onClick={() => handleTagChange('')}
                        className={`px-3 py-1.5 text-xs uppercase tracking-widest border-r border-b border-border cursor-pointer transition-colors ${
                            selectedTag === ''
                                ? 'text-[#0033FF] bg-[#0033FF]/10'
                                : 'hover:bg-muted text-muted-foreground'
                        }`}
                        style={selectedTag === '' ? {borderColor: '#0033FF'} : {}}
                    >
                        All ({repos.length})
                    </button>
                    {allTags.map(tag => {
                        const count = repos.filter(r => r.topics.includes(tag)).length
                        const active = selectedTag === tag
                        return (
                            <button
                                key={tag}
                                onClick={() => handleTagChange(tag)}
                                className={`px-3 py-1.5 text-xs uppercase tracking-widest border-r border-b border-border cursor-pointer transition-colors ${
                                    active
                                        ? 'text-[#0033FF] bg-[#0033FF]/10'
                                        : 'hover:bg-muted text-muted-foreground'
                                }`}
                                style={active ? {borderColor: '#0033FF'} : {}}
                            >
                                {tag} ({count})
                            </button>
                        )
                    })}
                </div>
            )}

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="border border-border px-4 py-8 text-center text-xs text-muted-foreground uppercase tracking-widest">
                    No repos found for this tag
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 border-t border-l border-foreground">
                    {filtered.map(repo => {
                        const color = repo.language ? LANGUAGE_COLORS[repo.language] : null
                        return (
                            <div
                                key={repo.id}
                                className="border-r border-b border-foreground hover:bg-muted transition-colors group flex flex-col overflow-hidden"
                            >
                                {/* Body */}
                                <div className="px-4 py-4 flex flex-col sm:min-h-48 sm:aspect-square">
                                    {/* TOP: title + url */}
                                    <div className="flex flex-col gap-1 mb-auto">
                                        {/* Title row: name left, stars right */}
                                        <div className="flex items-start justify-between gap-3">
                                            <Link
                                                href={repo.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold uppercase tracking-wide text-sm leading-tight text-foreground hover:text-[#0033FF] transition-colors min-w-0 break-words"
                                            >
                                                {repo.name}
                                            </Link>
                                            {repo.stargazers_count > 0 ? (
                                                <span className="text-xs font-bold tracking-widest text-yellow-500 shrink-0">
                                                    ★ {repo.stargazers_count}
                                                </span>
                                            ) : (
                                                <a
                                                    href={`${repo.html_url}/stargazers`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-muted-foreground hover:text-[#0033FF] transition-colors shrink-0"
                                                >
                                                    first star?
                                                </a>
                                            )}
                                        </div>

                                        {/* Homepage URL */}
                                        {repo.homepage && (
                                            <a
                                                href={repo.homepage}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-muted-foreground hover:text-[#0033FF] transition-colors truncate"
                                            >
                                                {repo.homepage.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                            </a>
                                        )}
                                    </div>

                                    {/* BOTTOM: desc + tags + meta */}
                                    <div className="flex flex-col gap-2 mt-4 overflow-hidden">
                                        {/* Description */}
                                        {repo.description && (
                                            <p className="text-xs text-muted-foreground leading-relaxed m-0">{repo.description}</p>
                                        )}

                                        {/* Archived */}
                                        {repo.archived && (
                                            <span className="text-xs uppercase tracking-widest text-muted-foreground">[archived]</span>
                                        )}

                                        {/* Topics */}
                                        {repo.topics.length > 0 && (
                                            <p className="text-xs text-muted-foreground">
                                                {repo.topics.map((tag, i) => (
                                                    <span key={tag}>
                                                        {i > 0 && <span className="mx-1 opacity-40">·</span>}
                                                        {hideFilter ? (
                                                            <span className={selectedTag === tag ? 'text-[#0033FF]' : ''}>{tag}</span>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleTagChange(selectedTag === tag ? '' : tag)}
                                                                className={`cursor-pointer hover:text-foreground transition-colors ${selectedTag === tag ? 'text-[#0033FF]' : ''}`}
                                                            >
                                                                {tag}
                                                            </button>
                                                        )}
                                                    </span>
                                                ))}
                                            </p>
                                        )}

                                        {/* Footer meta */}
                                        <div className="flex items-center gap-2 border-t border-foreground/20 pt-2 text-xs text-muted-foreground uppercase tracking-widest">
                                            {color && (
                                                <span className="w-2 h-2 shrink-0" style={{backgroundColor: color}}/>
                                            )}
                                            {repo.language ?? '—'} · {formatDate(repo.updated_at)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {filterSummary && (
                <FilterSummaryLine
                    summary={filterSummary}
                    total={repos.length}
                    showing={filtered.length}
                />
            )}
        </div>
    )
}
