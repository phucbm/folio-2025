import {GoodreadsBook} from "@/components/goodreads/types";
import {BookCover} from "@/components/goodreads/BookCover";
import {formatDate} from "@/components/goodreads/goodreads-parser";


/**
 * Individual book list item component
 * Displays: Cover image, Title, Author, Date Read
 */
export function BookListItem({
                                 book,
                                 showCover = true,
                                 priority = false
                             }: {
    book: GoodreadsBook & { coverUrl?: string | null };
    showCover?: boolean;
    priority?: boolean;
}) {
    return (
        <div className="">
            {/* Book Cover */}
            {showCover && (
                <div className="mb-4">
                    <BookCover
                        coverUrl={book.coverUrl || null}
                        title={book.title}
                        author={book.author}
                        priority={priority}
                    />
                </div>
            )}

            {/* Book Info */}
            <div className="">
                <div className="">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {book.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{book.author}</p>

                    {book.dateRead && (
                        <div className="flex items-center gap-2 text-sm mb-2">
                            <span className="text-gray-500">Read on:</span>
                            <span className="text-gray-700 font-medium">
                    {formatDate(book.dateRead)}
                  </span>
                        </div>
                    )}

                    {!book.dateRead && book.exclusiveShelf && (
                        <div
                            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 mb-2">
                            {book.exclusiveShelf.replace('-', ' ')}
                        </div>
                    )}

                    {/* Additional metadata */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        {book.numberOfPages && (
                            <span>{book.numberOfPages} pages</span>
                        )}
                        {book.yearPublished && (
                            <span>Published {book.yearPublished}</span>
                        )}
                        {book.binding && (
                            <span>{book.binding}</span>
                        )}
                    </div>
                </div>

                {/* Rating */}
                {book.myRating > 0 && (
                    <div className="flex items-center gap-1 text-yellow-500 text-sm flex-shrink-0">
                        {'★'.repeat(book.myRating)}
                        {'☆'.repeat(5 - book.myRating)}
                    </div>
                )}
            </div>
        </div>
    );
}