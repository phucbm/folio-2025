import { GoogleBooksResponse } from './types';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Google Books API Service with Local File Fallback
 *
 * Priority order:
 * 1. Check local file: /public/goodreads/<bookId>.jpg or /public/goodreads/<isbn>.jpg
 * 2. Fetch from Google Books API using ISBN
 * 3. Return null (will show placeholder)
 */

const GOOGLE_BOOKS_API_BASE = 'https://www.googleapis.com/books/v1/volumes';

/**
 * Check if local cover image exists
 * Checks both bookId and ISBN
 *
 * @param bookId - Goodreads book ID
 * @param isbn - ISBN or ISBN13 of the book
 * @returns Local cover path (relative to public folder) or null
 */
function checkLocalCover(bookId: string, isbn: string): string | null {
    // Try bookId first (Goodreads naming)
    if (bookId) {
        const bookIdPath = join(process.cwd(), 'public', 'goodreads', `${bookId}.jpg`);
        if (existsSync(bookIdPath)) {
            return `/goodreads/${bookId}.jpg`;
        }
    }

    // Try ISBN as fallback
    if (isbn) {
        const cleanIsbn = isbn.replace(/[^0-9X]/gi, '');
        if (cleanIsbn) {
            const isbnPath = join(process.cwd(), 'public', 'goodreads', `${cleanIsbn}.jpg`);
            if (existsSync(isbnPath)) {
                return `/goodreads/${cleanIsbn}.jpg`;
            }
        }
    }

    return null;
}

/**
 * Fetch book cover URL from Google Books API
 *
 * @param isbn - ISBN or ISBN13 of the book
 * @returns Cover image URL or null if not found
 */
async function fetchFromGoogleBooks(isbn: string): Promise<string | null> {
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
 * Fetch book cover with priority: Local (bookId/ISBN) -> Google Books API -> null
 *
 * @param bookId - Goodreads book ID
 * @param isbn - ISBN or ISBN13 of the book
 * @returns Cover image URL/path or null if not found
 */
export async function fetchBookCover(bookId: string, isbn: string): Promise<string | null> {
    // 1. Check local file first (bookId or ISBN)
    const localCover = checkLocalCover(bookId, isbn);
    if (localCover) {
        return localCover;
    }

    // 2. Try Google Books API
    const googleCover = await fetchFromGoogleBooks(isbn);
    if (googleCover) {
        return googleCover;
    }

    // 3. Return null (will show placeholder)
    return null;
}

/**
 * Batch fetch book covers for multiple books
 * Adds a small delay between requests to avoid rate limiting
 *
 * @param books - Array of {bookId, isbn} objects
 * @param delayMs - Delay between requests in milliseconds
 * @returns Map of bookId to cover URL
 */
export async function batchFetchBookCovers(
    books: Array<{bookId: string; isbn: string}>,
    delayMs: number = 100
): Promise<Map<string, string | null>> {
    const coverMap = new Map<string, string | null>();

    for (const book of books) {
        const cover = await fetchBookCover(book.bookId, book.isbn);
        coverMap.set(book.bookId, cover);

        // Add delay to avoid rate limiting (only for API calls, not local checks)
        if (delayMs > 0 && cover && !cover.startsWith('/goodreads/')) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    return coverMap;
}

/**
 * Get cover URL with fallback to ISBN13 if ISBN fails
 *
 * @param bookId - Goodreads book ID
 * @param isbn - Primary ISBN
 * @param isbn13 - Fallback ISBN13
 * @returns Cover image URL or null
 */
export async function fetchBookCoverWithFallback(
    bookId: string,
    isbn: string,
    isbn13: string
): Promise<string | null> {
    // Check local first (bookId or any ISBN)
    const localCover = checkLocalCover(bookId, isbn13 || isbn);
    if (localCover) {
        return localCover;
    }

    // Try ISBN13 first (more reliable)
    if (isbn13) {
        const cover = await fetchBookCover(bookId, isbn13);
        if (cover) return cover;
    }

    // Fallback to ISBN
    if (isbn && isbn !== isbn13) {
        const cover = await fetchBookCover(bookId, isbn);
        if (cover) return cover;
    }

    return null;
}