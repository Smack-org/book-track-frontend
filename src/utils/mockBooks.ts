import type { BookType } from "../types/book.d"
import { BookDTOMediaType, type BookDTO, type BookDTOAuthor, BookDTOLanguage, type BookDTOFromats, type BookDTOStatus } from "../types/bookDTO.d"
import { mapBookStatus } from "../types/bookDTOAdapter"

const STATUSES: BookDTOStatus[] = ["want_to_read", "reading", "reading", ""]
const SUBJECTS = ["Fiction", "Science Fiction", "Fantasy", "Romance", "Mystery", "History", "Science", "Philosophy"]
const BOOKSHELVES = ["Featured", "Popular", "Classics", "Staff Picks", "New Releases", "Award Winners"]

const AUTHORS: BookDTOAuthor[] = [
    { name: "Jane Austen", birth_year: 1775, death_year: 1817 },
    { name: "George Orwell", birth_year: 1903, death_year: 1950 },
    { name: "J.R.R. Tolkien", birth_year: 1892, death_year: 1973 },
    { name: "Agatha Christie", birth_year: 1890, death_year: 1976 },
    { name: "Isaac Asimov", birth_year: 1920, death_year: 1992 },
]

const TRANSLATORS: BookDTOAuthor[] = [{ name: "Margaret Jull Costa" }, { name: "Edith Grossman" }, { name: "Michael Hofmann" }]

const BOOK_TITLES = ["Pride and Prejudice", "1984", "The Hobbit", "Murder on the Orient Express", "Foundation", "Brave New World", "The Great Gatsby", "To Kill a Mockingbird"]

const SUMMARIES = [
    "A story of love and social standing in 19th century England.",
    "A dystopian novel about totalitarianism and surveillance.",
    "An adventure of a hobbit who discovers a magical ring.",
    "A detective solves a murder on a luxurious train.",
    "The fall of a galactic empire and the rise of a new order.",
    "A vision of a future society that has achieved stability at a terrible cost.",
    "The mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.",
    "A powerful story of racial injustice in the American South.",
]

const BASE_FORMATS: BookDTOFromats = {
    "text/html": "http://example.com/html",
    "application/epub+zip": "http://example.com/epub",
    "application/x-mobipocket-ebook": "http://example.com/mobi",
    "application/rdf+xml": "http://example.com/rdf",
    "image/jpeg": "http://example.com/jpeg",
    "text/plain; charset=us-ascii": "http://example.com/ascii",
    "application/octet-stream": "http://example.com/octet",
}

export function generateMockBookDTOs(count: number): BookDTO[] {
    return Array.from({ length: count }, (_, i) => {
        const authorCount = Math.floor(Math.random() * 2) + 1
        const translatorCount = Math.random() > 0.7 ? 1 : 0
        const subjectCount = Math.floor(Math.random() * 3) + 1
        const bookshelfCount = Math.floor(Math.random() * 2) + 1
        const downloadCount = Math.floor(Math.random() * 10000)

        return {
            id: i + 1,
            title: BOOK_TITLES[i % BOOK_TITLES.length] || `Book ${i + 1}`,
            authors: AUTHORS.slice(0, authorCount),
            summaries: [SUMMARIES[i % SUMMARIES.length] || "A compelling story about life and choices."],
            translators: Math.random() > 0.7 ? TRANSLATORS.slice(0, translatorCount) : [],
            subjects: [...new Set(Array.from({ length: subjectCount }, () => SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)]))],
            bookshelves: [...new Set(Array.from({ length: bookshelfCount }, () => BOOKSHELVES[Math.floor(Math.random() * BOOKSHELVES.length)]))],
            languages: [BookDTOLanguage.En],
            copyright: Math.random() > 0.5,
            media_type: BookDTOMediaType.Text,
            formats: {
                ...BASE_FORMATS,
                ...(Math.random() > 0.5
                    ? {
                          "text/plain; charset=utf-8": "http://example.com/utf8",
                      }
                    : {}),
            },
            download_count: downloadCount,
            is_favorite: Math.random() > 0.7,
            status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
        }
    })
}

export function convertBookToDTO(book: BookType): BookDTO {
    return {
        ...book,
        is_favorite: book.is_favorite,
        languages: [BookDTOLanguage.En],
        media_type: BookDTOMediaType.Text,
        formats: BASE_FORMATS,
        download_count: Math.floor(Math.random() * 10000),
        status: mapBookStatus(book.status),
    }
}
