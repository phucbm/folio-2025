import {readFile} from 'fs/promises';
import {join} from 'path';
import {formatDate, parseGoodreadsCSV} from './goodreads-parser';
import {GoodreadsBook} from './types';

/**
 * Generic Goodreads Import Component
 *
 * A server component that reads a Goodreads library export CSV file
 * from the public folder and displays books as a list.
 *
 * This is designed as a generic import component that can be used as
 * the initial import step, with other components customizing the display
 * based on specific needs.
 *
 * @param csvFileName - Name of the CSV file in the public folder (default: 'goodreads_library_export.csv')
 * @param filterFn - Optional filter function to filter books
 * @param sortFn - Optional sort function to sort books
 */

interface GoodreadsImportProps {
    csvFileName?: string;
    filterFn?: (book: GoodreadsBook) => boolean;
    sortFn?: (a: GoodreadsBook, b: GoodreadsBook) => number;
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
                <h2 className="text-xl font-semibold text-amber-900 mb-2">
                    No Books Found
                </h2>
                <p className="text-amber-700">
                    Make sure your Goodreads CSV file is placed in the{' '}
                    <code className="px-2 py-1 bg-amber-100 rounded">public/</code> folder
                    as <code className="px-2 py-1 bg-amber-100 rounded">{csvFileName}</code>
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Goodreads Library Import
                </h1>
                <p className="text-gray-600">
                    {books.length} {books.length === 1 ? 'book' : 'books'} imported from {csvFileName}
                </p>
            </div>

            <div className="space-y-4">
                {books.map((book) => (
                    <BookListItem key={book.bookId} book={book}/>
                ))}
            </div>
        </div>
    );
}

/**
 * Individual book list item component
 * Displays: Title, Author, Date Read
 */
function BookListItem({book}: { book: GoodreadsBook }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {book.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{book.author}</p>

                    {book.dateRead && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Read on:</span>
                            <span className="text-gray-700 font-medium">
                {formatDate(book.dateRead)}
              </span>
                        </div>
                    )}

                    {!book.dateRead && book.exclusiveShelf && (
                        <div
                            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                            {book.exclusiveShelf.replace('-', ' ')}
                        </div>
                    )}
                </div>

                {book.myRating > 0 && (
                    <div className="flex items-center gap-1 text-yellow-500 text-sm">
                        {'★'.repeat(book.myRating)}
                        {'☆'.repeat(5 - book.myRating)}
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Export the component with display name for debugging
 */
GoodreadsImport.displayName = 'GoodreadsImport';
