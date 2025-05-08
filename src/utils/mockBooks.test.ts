import { describe, it, expect } from "vitest"
import { convertBookToDTO, generateMockBookDTOs } from "./mockBooks"
import { BookDTOLanguage, BookDTOMediaType } from "../types/bookDTO.d"
import type { BookType } from "../types/book.d"

describe("generateMockBookDTOs", () => {
    it("returns the correct number of books", () => {
        const result = generateMockBookDTOs(5)
        expect(result).toHaveLength(5)
    })

    it("returns books with expected properties", () => {
        const result = generateMockBookDTOs(1)[0]

        expect(result).toHaveProperty("id")
        expect(result).toHaveProperty("title")
        expect(result).toHaveProperty("authors")
        expect(result.authors.length).toBeGreaterThan(0)
        expect(result).toHaveProperty("summaries")
        expect(Array.isArray(result.summaries)).toBe(true)
        expect(result).toHaveProperty("translators")
        expect(Array.isArray(result.translators)).toBe(true)
        expect(result).toHaveProperty("subjects")
        expect(Array.isArray(result.subjects)).toBe(true)
        expect(result).toHaveProperty("bookshelves")
        expect(Array.isArray(result.bookshelves)).toBe(true)
        expect(result.languages).toContain(BookDTOLanguage.En)
        expect(result).toHaveProperty("media_type", BookDTOMediaType.Text)
        expect(typeof result.download_count).toBe("number")
        expect(typeof result.is_favourite).toBe("boolean")
    })
})

describe("convertBookToDTO", () => {
    it("correctly maps a BookType to a BookDTO", () => {
        const book: BookType = {
            id: 1,
            title: "Test Book",
            authors: [{ name: "Author A" }],
            summaries: ["Test summary"],
            translators: [],
            subjects: ["Fiction"],
            bookshelves: ["Featured"],
            is_favourite: true,
            status: "reading",
            copyright: true,
        }

        const dto = convertBookToDTO(book)

        expect(dto.id).toBe(book.id)
        expect(dto.title).toBe(book.title)
        expect(dto.authors).toEqual(book.authors)
        expect(dto.summaries).toEqual(book.summaries)
        expect(dto.subjects).toEqual(book.subjects)
        expect(dto.bookshelves).toEqual(book.bookshelves)
        expect(dto.is_favourite).toBe(book.is_favourite)
        expect(dto.languages).toEqual([BookDTOLanguage.En])
        expect(dto.media_type).toBe(BookDTOMediaType.Text)
        expect(dto.formats["text/html"]).toBeDefined()
        expect(typeof dto.download_count).toBe("number")
        expect(["want_to_read", "reading", "", undefined]).toContain(dto.status)
    })
})
