/**
 * Complete TypeScript types for Goodreads library export CSV
 */

export interface GoodreadsBook {
    bookId: string;
    title: string;
    author: string;
    authorLastFirst: string;
    additionalAuthors: string;
    isbn: string;
    isbn13: string;
    myRating: number;
    averageRating: number;
    publisher: string;
    binding: string;
    numberOfPages: number | null;
    yearPublished: number | null;
    originalPublicationYear: number | null;
    dateRead: string;
    dateAdded: string;
    bookshelves: string;
    bookshelvesWithPositions: string;
    exclusiveShelf: string;
    myReview: string;
    spoiler: string;
    privateNotes: string;
    readCount: number;
    ownedCopies: number;
}

export type ExclusiveShelf = 'read' | 'currently-reading' | 'to-read' | 'unfinished-books';

export type Binding =
    | 'Paperback'
    | 'Hardcover'
    | 'Kindle Edition'
    | 'ebook'
    | 'Mass Market Paperback'
    | 'Unknown Binding'
    | '';