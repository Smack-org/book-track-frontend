import { describe, it, expect } from "vitest"
import { adaptBookFromDTO, mapBookStatus, mapDTOBookStatus } from "../types/bookDTOAdapter"
import { BookDTOLanguage, BookDTOMediaType, type BookDTO } from "../types/bookDTO.d"
import type { BookStatus, BookType } from "../types/book.d"

describe("mapDTOBookStatus", () => {
    const cases: [BookDTO["status"], BookStatus][] = [
        ["want_to_read", "want"],
        ["reading", "reading"],
        ["done", "done"],
        ["", "--"],
    ]

    it.each(cases)("maps %s to %s", (dtoStatus, expectedStatus) => {
        expect(mapDTOBookStatus(dtoStatus)).toBe(expectedStatus)
    })
})

describe("mapBookStatus", () => {
    const cases: [BookStatus, BookDTO["status"]][] = [
        ["want", "want_to_read"],
        ["reading", "reading"],
        ["done", "done"],
        ["--", ""],
    ]

    it.each(cases)("maps %s to %s", (bookStatus, expectedDTOStatus) => {
        expect(mapBookStatus(bookStatus)).toBe(expectedDTOStatus)
    })
})

describe("adaptBookFromDTO", () => {
    it("adapts a BookDTO into a BookType with simplified authors and mapped status", () => {
        const dto: BookDTO = {
            id: 1,
            title: "1984",
            authors: [{ name: "George Orwell", birth_year: 1903, death_year: 1950 }],
            summaries: ["Dystopian future under surveillance."],
            translators: [],
            subjects: ["Fiction"],
            bookshelves: ["Classics"],
            languages: [BookDTOLanguage.En],
            copyright: false,
            media_type: BookDTOMediaType.Text,
            formats: {
                "text/html": "http://example.com/html",
                "application/epub+zip": "http://example.com/epub",
                "application/x-mobipocket-ebook": "http://example.com/mobi",
                "application/rdf+xml": "http://example.com/rdf",
                "image/jpeg": "http://example.com/jpeg",
                "text/plain; charset=us-ascii": "http://example.com/ascii",
                "application/octet-stream": "http://example.com/octet",
            },
            download_count: 1234,
            is_favorite: true,
            status: "want_to_read",
        }

        const result: BookType = adaptBookFromDTO(dto)

        expect(result.id).toBe(dto.id)
        expect(result.title).toBe(dto.title)
        expect(result.authors).toEqual([{ name: "George Orwell" }])
        expect(result.status).toBe("want")
        expect(result.is_favorite).toBe(true)
    })
})
