import {readFile} from 'fs/promises';
import {join} from 'path';
import {parseGoodreadsCSV} from './goodreads-parser';
import {GoodreadsBook} from './types';
import {fetchBookCoverWithFallback} from './google-books-api';
import {BookListItem} from "@/components/goodreads/BookListItem";

/**
 * Generic Goodreads Import Component
 *
 * A server component that reads a Goodreads library export CSV file
 * from the public folder and displays books as a list with cover images
 * fetched from Google Books API.
 *
 * This is designed as a generic import component that can be used as
 * the initial import step, with other components customizing the display
 * based on specific needs.
 *
 * @param csvFileName - Name of the CSV file in the public folder (default: 'goodreads_library_export.csv')
 * @param filterFn - Optional filter function to filter books
 * @param sortFn - Optional sort function to sort books
 * @param showCovers - Whether to show book covers (default: true)
 */

interface GoodreadsImportProps {
    csvFileName?: string;
    filterFn?: (book: GoodreadsBook) => boolean;
    sortFn?: (a: GoodreadsBook, b: GoodreadsBook) => number;
    showCovers?: boolean;
}

async function loadGoodreadsData(fileName: string): Promise<GoodreadsBook[]> {
    try {
        const filePath = join(process.cwd(), 'public', fileName);
        const fileContent = await readFile(filePath, 'utf-8');
        return parseGoodreadsCSV(fileContent);
    } catch (error) {
        console.error('Error reading Goodreads CSV:', error);
        return [];
    }
}

export default async function GoodreadsImport({
                                                  csvFileName = 'goodreads_library_export.csv',
                                                  filterFn,
                                                  sortFn,
                                                  showCovers = true,
                                              }: GoodreadsImportProps) {
    // Load and parse the CSV file
    let books = await loadGoodreadsData(csvFileName);

    // Apply optional filter
    if (filterFn) {
        books = books.filter(filterFn);
    }

    // Apply optional sort
    if (sortFn) {
        books = books.sort(sortFn);
    }

    // If no books found
    if (books.length === 0) {
        return (
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-700">
                    Make sure your Goodreads CSV file is placed in the{' '}
                    <code className="px-2 py-1 bg-amber-100 rounded">public/</code> folder
                    as <code className="px-2 py-1 bg-amber-100 rounded">{csvFileName}</code>
                </p>
            </div>
        );
    }

    // Fetch cover URLs if showCovers is enabled
    const booksWithCovers = showCovers
        ? await Promise.all(
            books.map(async (book) => ({
                ...book,
                coverUrl: await fetchBookCoverWithFallback(book.bookId, book.isbn, book.isbn13),
            }))
        )
        : books.map((book) => ({...book, coverUrl: null}));

    return (
        <div className="">
            <div className="mb-6">
                <p className="text-gray-600">
                    {books.length} {books.length === 1 ? 'book' : 'books'} imported
                </p>
            </div>

            <div className="not-prose grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-8">
                {booksWithCovers.map((book, index) => (
                    <BookListItem
                        key={book.bookId}
                        book={book}
                        showCover={showCovers}
                        priority={index < 3} // Prioritize loading first 3 images
                    />
                ))}
            </div>
        </div>
    );
}

/**
 * Export the component with display name for debugging
 */
GoodreadsImport.displayName = 'GoodreadsImport';