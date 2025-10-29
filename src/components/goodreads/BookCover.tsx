'use client';

import Image from 'next/image';
import { useState } from 'react';

interface BookCoverProps {
  coverUrl: string | null;
  title: string;
  author: string;
  size?: 'small' | 'medium' | 'large';
  priority?: boolean;
}

/**
 * Book Cover Component (Client Component)
 * 
 * Displays book cover image
 * Falls back to placeholder if image not found or fails to load
 */
export function BookCover({
  coverUrl,
  title,
  author,
  size = 'medium',
  priority = false,
}: BookCoverProps) {
  const [imageError, setImageError] = useState(false);

  // Size configurations
  const sizeConfig = {
    small: { width: 80, height: 120 },
    medium: { width: 128, height: 192 },
    large: { width: 200, height: 300 },
  };

  const { width, height } = sizeConfig[size];

  // Show placeholder if no cover URL or image failed to load
  if (!coverUrl || imageError) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-sm shadow-sm"
        style={{ width, height }}
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

  return (
    <div className="relative rounded-sm overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <Image
        src={coverUrl}
        alt={`Cover of ${title} by ${author}`}
        width={width}
        height={height}
        className="object-cover"
        priority={priority}
        onError={() => setImageError(true)}
      />
    </div>
  );
}
