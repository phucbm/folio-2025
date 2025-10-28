'use client';

import {useState} from 'react';
import {Bookmark} from "@/lib/discord";
import {LinkBlock} from "@/components/link-block";

interface BookmarksFilterProps {
    bookmarks: Bookmark[];
    newDaysThreshold?: number; // Allow customization of "new" threshold
}

export default function BookmarksFilter({bookmarks, newDaysThreshold = 3}: BookmarksFilterProps) {
    const [selectedTag, setSelectedTag] = useState<string>('');

    // Get unique tags
    const allTags = [...new Set(bookmarks.flatMap(b => b.tags))].sort();

    // Filter bookmarks by selected tag
    const filteredBookmarks = selectedTag
        ? bookmarks.filter(bookmark => bookmark.tags.includes(selectedTag))
        : bookmarks;

    // Helper function to check if bookmark is new
    const isNew = (timestamp: Date) => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - new Date(timestamp).getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= newDaysThreshold;
    };

    // Helper function to check if bookmark was added today
    const isToday = (timestamp: Date) => {
        const now = new Date();
        const bookmarkDate = new Date(timestamp);
        return now.toDateString() === bookmarkDate.toDateString();
    };

    return (
        <div>
            {/* Tag Filter */}
            <div className="mb-6 flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedTag('')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        selectedTag === ''
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                    }`}
                >
                    All ({bookmarks.length})
                </button>
                {allTags.map(tag => {
                    const count = bookmarks.filter(b => b.tags.includes(tag)).length;
                    return (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                selectedTag === tag
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                            }`}
                        >
                            {tag} ({count})
                        </button>
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
                        <li key={bookmark.id}>
                            <LinkBlock
                                title={
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="break-all">{bookmark.threadName}</span>

                                        {/* Time-based badges */}
                                        {isToday(bookmark.timestamp) && (
                                            <span
                                                className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-200">
                                                Added today
                                            </span>
                                        )}
                                        {!isToday(bookmark.timestamp) && isNew(bookmark.timestamp) && (
                                            <span
                                                className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded-full dark:bg-orange-900 dark:text-orange-200">
                                                New
                                            </span>
                                        )}

                                        {/* Tag badges */}
                                        {bookmark.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                }
                                description={bookmark.content}
                                href={bookmark.url || '#'}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}