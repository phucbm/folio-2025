'use client'

import {useState, useEffect} from 'react'
import Image from 'next/image'
import {Link} from 'next-view-transitions'
import {GitHubRepo, GitHubProjectsFilterSummary} from './types'
import {repoOgImage} from './utils'
import {LinkBlockHover} from '@/components/link-block-hover'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {IconStarFilled, IconExternalLink} from '@tabler/icons-react'

interface GitHubProjectsClientProps {
    repos: GitHubRepo[]
    filterSummary?: GitHubProjectsFilterSummary
    hideFilter?: boolean
}

const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: 'bg-blue-500',
    JavaScript: 'bg-yellow-400',
    Python: 'bg-green-500',
    CSS: 'bg-pink-500',
    HTML: 'bg-orange-500',
    Vue: 'bg-emerald-500',
    PHP: 'bg-indigo-400',
    Shell: 'bg-gray-500',
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
        <p className="text-xs text-muted-foreground mt-6">
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
        <div>
            {!hideFilter && allTags.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                    <Button
                        onClick={() => handleTagChange('')}
                        variant={selectedTag === '' ? 'default' : 'outline'}
                        size="sm"
                        className="cursor-pointer"
                    >
                        All ({repos.length})
                    </Button>
                    {allTags.map(tag => {
                        const count = repos.filter(r => r.topics.includes(tag)).length
                        return (
                            <Button
                                key={tag}
                                onClick={() => handleTagChange(tag)}
                                variant={selectedTag === tag ? 'default' : 'outline'}
                                size="sm"
                                className="cursor-pointer"
                            >
                                {tag} ({count})
                            </Button>
                        )
                    })}
                </div>
            )}

            {filtered.length === 0 ? (
                <div className="text-muted-foreground text-center py-8">No repos found for this tag</div>
            ) : (
                <ul className="space-y-8 not-prose pt-4">
                    {filtered.map(repo => {
                        const thumbnail = repoOgImage(repo.full_name)
                        return (
                            <li key={repo.id}>
                                <LinkBlockHover>
                                    <div className="flex items-start mb-6 relative z-20">
                                        {/* Thumbnail */}
                                        <div className="overflow-hidden rounded-xs md:rounded-sm w-[20%] ring ring-gray-200 dark:ring-black/20 shrink-0">
                                            <Image
                                                src={thumbnail}
                                                alt=""
                                                width={800}
                                                height={400}
                                                className="w-full h-auto object-cover"
                                                unoptimized
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="w-[80%] pl-2 md:pl-4 space-y-1.5">
                                            {/* Title row */}
                                            <div className="flex items-center gap-2 flex-wrap font-[500]">
                                                <Link
                                                    href={repo.html_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-black dark:text-white hover:underline"
                                                >
                                                    {repo.name}
                                                </Link>

                                                <span className="flex items-center gap-1 text-sm text-yellow-500">
                                                    <IconStarFilled className="w-3.5 h-3.5"/>
                                                    {repo.stargazers_count}
                                                </span>

                                                {repo.is_template && <Badge variant="secondary">Template</Badge>}
                                                {repo.archived && <Badge variant="secondary">Archived</Badge>}
                                            </div>

                                            {/* Description */}
                                            {repo.description && (
                                                <p className="text-muted-foreground">{repo.description}</p>
                                            )}

                                            {/* Meta row */}
                                            <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                                                {repo.language && (
                                                    <span className="flex items-center gap-1">
                                                        <span className={`w-2.5 h-2.5 rounded-full ${LANGUAGE_COLORS[repo.language] ?? 'bg-gray-400'}`}/>
                                                        {repo.language}
                                                    </span>
                                                )}
                                                <span>Updated {formatDate(repo.updated_at)}</span>
                                                {repo.homepage && (
                                                    <a
                                                        href={repo.homepage}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 hover:underline"
                                                    >
                                                        <IconExternalLink className="w-3 h-3"/>
                                                        Website
                                                    </a>
                                                )}
                                            </div>

                                            {/* Topics */}
                                            {repo.topics.length > 0 && (
                                                <div className="flex flex-wrap gap-1 pt-0.5">
                                                    {repo.topics.map(tag => (
                                                        <button
                                                            key={tag}
                                                            onClick={() => handleTagChange(selectedTag === tag ? '' : tag)}
                                                            className="cursor-pointer"
                                                        >
                                                            <Badge variant={selectedTag === tag ? 'default' : 'secondary'}>
                                                                {tag}
                                                            </Badge>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </LinkBlockHover>
                            </li>
                        )
                    })}
                </ul>
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
