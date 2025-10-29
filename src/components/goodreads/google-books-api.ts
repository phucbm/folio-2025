import { GoogleBooksResponse } from './types';

/**
 * Google Books API Service
 * 
 * Fetches book cover images from Google Books API using ISBN
 * No API key required for basic usage (but rate limited)
 */

const GOOGLE_BOOKS_API_BASE = 'https://www.googleapis.com/books/v1/volumes';

/**
 * Fetch book cover URL from Google Books API
 * 
 * @param isbn - ISBN or ISBN13 of the book
 * @returns Cover image URL or null if not found
 */
export async function fetchBookCover(isbn: string): Promise<string | null> {
  if (!isbn) return null;

  try {
    // Clean ISBN - remove any quotes or special characters
    const cleanIsbn = isbn.replace(/[^0-9X]/gi, '');
    if (!cleanIsbn) return null;

    const url = `${GOOGLE_BOOKS_API_BASE}?q=isbn:${cleanIsbn}`;
    
    const response = await fetch(url, {
      // Cache for 7 days to reduce API calls
      next: { revalidate: 604800 }
    });

    if (!response.ok) {
      console.warn(`Google Books API error for ISBN ${cleanIsbn}: ${response.status}`);
      return null;
    }

    const data: GoogleBooksResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    // Get the first result's thumbnail
    const imageLinks = data.items[0]?.volumeInfo?.imageLinks;
    
    // Prefer higher quality images
    const coverUrl = 
      imageLinks?.large ||
      imageLinks?.medium ||
      imageLinks?.thumbnail ||
      imageLinks?.smallThumbnail;

    // Convert to HTTPS and higher resolution if available
    if (coverUrl) {
      return coverUrl
        .replace('http://', 'https://')
        .replace('&edge=curl', '') // Remove edge effects
        .replace('zoom=1', 'zoom=2'); // Request higher resolution
    }

    return null;
  } catch (error) {
    console.error(`Error fetching cover for ISBN ${isbn}:`, error);
    return null;
  }
}

/**
 * Batch fetch book covers for multiple ISBNs
 * Adds a small delay between requests to avoid rate limiting
 * 
 * @param isbns - Array of ISBNs
 * @param delayMs - Delay between requests in milliseconds
 * @returns Map of ISBN to cover URL
 */
export async function batchFetchBookCovers(
  isbns: string[],
  delayMs: number = 100
): Promise<Map<string, string | null>> {
  const coverMap = new Map<string, string | null>();

  for (const isbn of isbns) {
    const cover = await fetchBookCover(isbn);
    coverMap.set(isbn, cover);
    
    // Add delay to avoid rate limiting
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return coverMap;
}

/**
 * Get cover URL with fallback to ISBN13 if ISBN fails
 * 
 * @param isbn - Primary ISBN
 * @param isbn13 - Fallback ISBN13
 * @returns Cover image URL or null
 */
export async function fetchBookCoverWithFallback(
  isbn: string,
  isbn13: string
): Promise<string | null> {
  // Try ISBN13 first (more reliable)
  if (isbn13) {
    const cover = await fetchBookCover(isbn13);
    if (cover) return cover;
  }

  // Fallback to ISBN
  if (isbn && isbn !== isbn13) {
    const cover = await fetchBookCover(isbn);
    if (cover) return cover;
  }

  return null;
}
