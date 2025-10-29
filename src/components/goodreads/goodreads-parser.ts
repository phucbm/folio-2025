import { GoodreadsBook } from './types';

/**
 * Parse a CSV line handling quoted fields and commas within quotes
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"' && nextChar === '"') {
      // Escaped quote
      current += '"';
      i++; // Skip next quote
    } else if (char === '"') {
      // Toggle quote mode
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current); // Add last field
  return result;
}

/**
 * Clean field value by removing quotes and Excel formula prefixes
 */
function cleanField(value: string): string {
  // Remove surrounding quotes
  let cleaned = value.trim();
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1);
  }
  
  // Remove Excel formula prefix (="...")
  if (cleaned.startsWith('=""') && cleaned.endsWith('""')) {
    cleaned = cleaned.slice(3, -2);
  }
  
  return cleaned.trim();
}

/**
 * Parse Goodreads CSV file and return array of books
 */
export function parseGoodreadsCSV(csvContent: string): GoodreadsBook[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    return [];
  }
  
  // Skip header line
  const dataLines = lines.slice(1);
  
  const books: GoodreadsBook[] = dataLines.map(line => {
    const fields = parseCSVLine(line);
    
    return {
      bookId: cleanField(fields[0] || ''),
      title: cleanField(fields[1] || ''),
      author: cleanField(fields[2] || ''),
      authorLastFirst: cleanField(fields[3] || ''),
      additionalAuthors: cleanField(fields[4] || ''),
      isbn: cleanField(fields[5] || ''),
      isbn13: cleanField(fields[6] || ''),
      myRating: parseInt(cleanField(fields[7] || '0')) || 0,
      averageRating: parseFloat(cleanField(fields[8] || '0')) || 0,
      publisher: cleanField(fields[9] || ''),
      binding: cleanField(fields[10] || ''),
      numberOfPages: parseInt(cleanField(fields[11] || '')) || null,
      yearPublished: parseInt(cleanField(fields[12] || '')) || null,
      originalPublicationYear: parseInt(cleanField(fields[13] || '')) || null,
      dateRead: cleanField(fields[14] || ''),
      dateAdded: cleanField(fields[15] || ''),
      bookshelves: cleanField(fields[16] || ''),
      bookshelvesWithPositions: cleanField(fields[17] || ''),
      exclusiveShelf: cleanField(fields[18] || ''),
      myReview: cleanField(fields[19] || ''),
      spoiler: cleanField(fields[20] || ''),
      privateNotes: cleanField(fields[21] || ''),
      readCount: parseInt(cleanField(fields[22] || '0')) || 0,
      ownedCopies: parseInt(cleanField(fields[23] || '0')) || 0,
    };
  });
  
  return books;
}

/**
 * Format date string to readable format
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}
