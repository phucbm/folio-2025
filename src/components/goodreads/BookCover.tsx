'use client';

import Image from 'next/image';
import { useState } from 'react';

interface BookCoverProps {
    coverUrl: string | null;
    title: string;
    author: string;
    priority?: boolean;
}

/**
 * Book Cover Component (Client Component)
 *
 * Displays book cover image with fixed aspect ratio
 * Falls back to placeholder if image not found or fails to load
 */
export function BookCover({
                              coverUrl,
                              title,
                              author,
                              priority = false,
                          }: BookCoverProps) {
    const [imageError, setImageError] = useState(false);

    // Show placeholder if no cover URL or image failed to load
    if (!coverUrl || imageError) {
        return (
            <div
                className="w-full aspect-[2/3] flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-sm shadow-sm"
            >
                <div className="text-center px-2">
                    <div className="text-xs font-medium text-gray-600 line-clamp-3 mb-1">
                        {title}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                        {author}
                    </div>
                </div>
            </div>
        );
    }

    // Check if it's a local image (starts with /)
    const isLocal = coverUrl.startsWith('/');

    return (
        <div
            className="w-full aspect-[2/3] relative rounded-sm overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-gray-100"
        >
            <Image
                src={coverUrl}
                alt={`Cover of ${title} by ${author}`}
                fill
                className="object-contain w-full h-full m-0"
                priority={priority}
                onError={() => setImageError(true)}
                unoptimized={isLocal}
            />
        </div>
    );
}