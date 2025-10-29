'use client';

import {GoodreadsBook} from "./types";
import {BookCover} from "./BookCover";
import {formatDate} from "./goodreads-parser";
import {Button} from "@/components/ui/button";
import {ExternalLink} from "lucide-react";
import {DialogDrawer} from "@/components/DialogDrawer";


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
    const goodreadsUrl = `https://www.goodreads.com/book/show/${book.bookId}`;
    const hasReview = book.myReview && book.myReview.trim().length > 0;

    return (
        <div className="flex flex-col justify-between">
            <div>
                {/* Book Cover */}
                {showCover && (
                    <div className="mb-4">
                        <a href={goodreadsUrl} target="_blank" rel="noopener noreferrer">
                            <BookCover
                                coverUrl={book.coverUrl || null}
                                title={book.title}
                                author={book.author}
                                priority={priority}
                            />
                        </a>
                    </div>
                )}
                <div className="">
                    <h3 className="leading-[1.2] mb-2">
                        <a
                            href={goodreadsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 transition-colors"
                        >
                            {book.title}
                        </a>
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
                    </div>
                </div>
            </div>

            {/* Book Info */}
            <div className="">
                {/* Rating and Review */}
                {book.myRating > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-yellow-500 text-sm">
                            {'★'.repeat(book.myRating)}
                            {'☆'.repeat(5 - book.myRating)}
                        </div>
                        {hasReview && (
                            <>
                                <DialogDrawer
                                    title={book.title}
                                    description={
                                        <div className="inline-flex gap-2">
                                            by {book.author}
                                            {book.dateRead && ` • Read on ${formatDate(book.dateRead)}`}
                                            <a
                                                href={goodreadsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                <ExternalLink className="h-5 w-5"/>
                                            </a>
                                        </div>
                                    }
                                    trigger={
                                        <Button variant="outline" size="sm" className="h-7 text-xs">
                                            See my review
                                        </Button>
                                    }
                                    contentClassName=""
                                    desktopScrollClassName="pr-2"
                                    mobileScrollClassName="px-4"
                                >
                                    <div className="mt-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-sm text-gray-600">My rating:</span>
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                {'★'.repeat(book.myRating)}
                                                {'☆'.repeat(5 - book.myRating)}
                                            </div>
                                        </div>
                                        <div
                                            className="prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{__html: book.myReview}}
                                        />
                                    </div>
                                </DialogDrawer>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}