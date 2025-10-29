import GoodreadsImport, { GoodreadsBook } from '@/components/goodreads';

/**
 * Example page showing different ways to use the GoodreadsImport component
 * with Google Books API cover images
 */

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Example 1: Basic usage - import all books with covers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">All Books (with covers)</h2>
          <GoodreadsImport />
        </section>

        {/* Example 2: Only show read books, sorted by date read (most recent first) */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Recently Read Books</h2>
          <GoodreadsImport
            filterFn={(book: GoodreadsBook) => book.exclusiveShelf === 'read'}
            sortFn={(a: GoodreadsBook, b: GoodreadsBook) => {
              if (!a.dateRead || !b.dateRead) return 0;
              return new Date(b.dateRead).getTime() - new Date(a.dateRead).getTime();
            }}
          />
        </section>

        {/* Example 3: Currently reading books without covers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Currently Reading (no covers)</h2>
          <GoodreadsImport
            filterFn={(book: GoodreadsBook) => book.exclusiveShelf === 'currently-reading'}
            showCovers={false}
          />
        </section>

        {/* Example 4: Books with 5-star ratings */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">5-Star Books</h2>
          <GoodreadsImport
            filterFn={(book: GoodreadsBook) => book.myRating === 5}
            sortFn={(a: GoodreadsBook, b: GoodreadsBook) => 
              a.title.localeCompare(b.title)
            }
          />
        </section>

        {/* Example 5: Books from a specific bookshelf */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">History Books</h2>
          <GoodreadsImport
            filterFn={(book: GoodreadsBook) => 
              book.bookshelves.includes('history')
            }
          />
        </section>

        {/* Example 6: Books read in 2024 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Books Read in 2024</h2>
          <GoodreadsImport
            filterFn={(book: GoodreadsBook) => {
              if (!book.dateRead) return false;
              return new Date(book.dateRead).getFullYear() === 2024;
            }}
            sortFn={(a: GoodreadsBook, b: GoodreadsBook) => {
              if (!a.dateRead || !b.dateRead) return 0;
              return new Date(b.dateRead).getTime() - new Date(a.dateRead).getTime();
            }}
          />
        </section>
      </div>
    </div>
  );
}
