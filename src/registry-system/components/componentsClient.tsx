'use client';

import * as React from 'react';
import {useEffect, useMemo, useState} from 'react';
import Link from 'next/link';
import {Component} from '@/registry-system/lib/getComponents';
import {cn} from "@/lib/utils";

type Props = {
    components: Component[];
    availableTags: string[];
    max?: number;
    totalCount?: number;
};

export function ComponentsClient({ components, availableTags, max = 9, totalCount = 0 }: Props) {
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

    // On mount, read hash from URL and initialize selected tags
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const hash = decodeURIComponent(window.location.hash.replace('#', ''));
        if (hash) {
            const tagsFromHash = hash.split(',');
            setSelectedTags(new Set(tagsFromHash.filter(tag => availableTags.includes(tag))));
        }
    }, [availableTags]);

    // Update URL hash whenever selectedTags changes
    useEffect(() => {
        const hash = Array.from(selectedTags).join(',');
        if (typeof window !== 'undefined') {
            if (hash) {
                window.history.replaceState(null, '', `#${encodeURIComponent(hash)}`);
            } else {
                window.history.replaceState(null, '', window.location.pathname);
            }
        }
    }, [selectedTags]);

    // Filter components based on selected tags (AND logic)
    const filteredComponents = useMemo(() => {
        if (selectedTags.size === 0) return components;

        return components.filter(comp => {
            if (!comp.tags || comp.tags.length === 0) return false;
            return Array.from(selectedTags).every(tag => comp.tags.includes(tag));
        });
    }, [components, selectedTags]);

    // Limit displayed components to max
    const displayedComponents = useMemo(() => {
        return filteredComponents.slice(0, max);
    }, [filteredComponents, max]);

    // Check if there are more components than max
    const hasMore = filteredComponents.length > max;

    // Dynamic tag counts based on currently filtered components
    const tagCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        availableTags.forEach(tag => {
            const count = filteredComponents.filter(comp => comp.tags?.includes(tag)).length;
            counts[tag] = count;
        });
        return counts;
    }, [filteredComponents, availableTags]);

    const toggleTag = (tag: string) => {
        if (tag === 'All') {
            setSelectedTags(new Set());
            return;
        }
        const newTags = new Set(selectedTags);
        newTags.has(tag) ? newTags.delete(tag) : newTags.add(tag);
        setSelectedTags(newTags);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="heading-2">
                    {hasMore ? `Showing ${displayedComponents.length} out of ${filteredComponents.length} components` : `Showing ${filteredComponents.length} components`}
                </div>
            </div>

            {/* Filter Section */}
            <div className="flex flex-wrap items-center gap-2">
                <button
                    className={cn(
                        'cursor-pointer border border-border bg-accent px-3 py-1 font-mono text-xs uppercase tracking-widest hover:text-brand hover:border-brand transition-colors',
                        selectedTags.size === 0 && 'border-brand text-brand bg-brand/10'
                    )}
                    onClick={() => toggleTag('All')}
                >
                    All
                </button>

                {availableTags.map(tag => {
                    const count = tagCounts[tag] || 0;
                    const isSelected = selectedTags.has(tag);
                    const isDisabled = count === 0;

                    return (
                        <button
                            key={tag}
                            className={cn(
                                'cursor-pointer border border-border bg-accent px-3 py-1 font-mono text-xs uppercase tracking-widest capitalize hover:text-brand hover:border-brand transition-colors',
                                isSelected && 'border-brand text-brand bg-brand/10',
                                isDisabled && 'opacity-50 pointer-events-none'
                            )}
                            onClick={() => !isDisabled && toggleTag(tag)}
                        >
                            {tag} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Components Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
                {displayedComponents.map(component => (
                    <Link
                        key={component.name}
                        href={component.url}
                        className="no-underline border-r border-b border-border px-4 py-4 flex flex-col justify-between gap-4 hover:bg-muted transition-colors group"
                    >
                        <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="text-sm font-bold uppercase tracking-widest">{component.title}</h3>
                                <span className="text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity text-xs shrink-0">↗</span>
                            </div>
                            <div className="text-sm text-muted-foreground leading-snug">{component.description}</div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                            {component.tags?.map(tag => (
                                <span
                                    key={tag}
                                    className="border border-border px-2 py-0.5 text-xs uppercase tracking-widest text-muted-foreground capitalize"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>

            {hasMore && (
                <Link
                    href="/components"
                    className="no-underline inline-block border border-border px-4 py-2 text-xs uppercase tracking-widest hover:border-brand hover:text-brand transition-colors"
                >
                    View all components
                </Link>
            )}
        </div>
    );
}
