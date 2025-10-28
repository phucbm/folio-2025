'use client';

import {useState} from 'react';
import {Bookmark} from "@/lib/discord";
import {LinkBlock} from "@/components/link-block";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

interface BookmarksFilterProps {
    bookmarks: Bookmark[];
    newDaysThreshold?: number;
}

export default function BookmarksFilter({bookmarks, newDaysThreshold = 3}: BookmarksFilterProps) {
    const [selectedTag, setSelectedTag] = useState<string>('');

    // Get unique tags
    const allTags = [...new Set(bookmarks.flatMap(b => b.tags))].sort();

    // Filter bookmarks by selected tag
    const filteredBookmarks = selectedTag
        ? bookmarks.filter(bookmark => bookmark.tags.includes(selectedTag))
        : bookmarks;

    // Helper function to check if bookmark is newly added
    const isNewlyAdded = (timestamp: Date) => {
        const now = new Date();
        const bookmarkDate = new Date(timestamp);
        const diffHours = (now.getTime() - bookmarkDate.getTime()) / (1000 * 60 * 60);
        return diffHours <= (newDaysThreshold * 24);
    };

    // Format date for title attribute
    const formatDate = (timestamp: Date) => {
        const date = new Date(timestamp);
        return `Added on ${date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })}`;
    };

    return (
        <div>
            {/* Tag Filter */}
            <div className="mb-6 flex flex-wrap gap-2">
                <Button
                    onClick={() => setSelectedTag('')}
                    variant={selectedTag === '' ? 'default' : 'outline'}
                    size="sm"
                    className="cursor-pointer"
                >
                    All ({bookmarks.length})
                </Button>
                {allTags.map(tag => {
                    const count = bookmarks.filter(b => b.tags.includes(tag)).length;
                    return (
                        <Button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            variant={selectedTag === tag ? 'default' : 'outline'}
                            size="sm"
                        >
                            {tag} ({count})
                        </Button>
                    );
                })}
            </div>

            {/* Bookmarks List */}
            {filteredBookmarks.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                    No bookmarks found for this tag
                </div>
            ) : (
                <ul className="space-y-8 not-prose pt-4">
                    {filteredBookmarks.map((bookmark) => (
                        <li key={bookmark.id} title={formatDate(bookmark.timestamp)}>
                            <LinkBlock
                                showThumbnail={true}
                                title={
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="break-all">{bookmark.threadName}</span>

                                        {/* Newly added badge */}
                                        {isNewlyAdded(bookmark.timestamp) && (
                                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                                Just added
                                            </Badge>
                                        )}

                                        {/* Tag badges */}
                                        <div className="inline-flex gap-1">
                                            {bookmark.tags.map((tag) => (
                                                <Badge key={tag} variant="secondary">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                }
                                description={ <span className="wrap-break-word">{bookmark.content}</span>}
                                href={bookmark.url || '#'}
                                thumbnail={bookmark.thumbnail}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}