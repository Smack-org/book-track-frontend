import type { BookDTO } from "./bookDTO"
import type { BookType } from "./book"

export function adaptBookFromDTO(dto: BookDTO): BookType {
    return {
        ...dto,
        authors: dto.authors.map((author) => ({
            name: author.name,
        })),
    }
}
