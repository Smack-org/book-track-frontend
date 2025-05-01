import type { BookDTO, BookDTOStatus } from "./bookDTO"
import type { BookStatus, BookType } from "./book"

export function adaptBookFromDTO(dto: BookDTO): BookType {
    return {
        ...dto,
        authors: dto.authors.map((author) => ({
            name: author.name,
        })),
        status: mapDTOBookStatus(dto.status),
    }
}

export function mapDTOBookStatus(dtoStatus: BookDTOStatus): BookStatus {
    const reverseMap: Record<BookDTOStatus, BookStatus> = {
        want_to_read: "want",
        reading: "reading",
        done: "done",
        "": "",
    }
    return reverseMap[dtoStatus]
}

export function mapBookStatus(status: BookStatus): BookDTOStatus {
    const reverseMap: Record<BookStatus, BookDTOStatus> = {
        want: "want_to_read",
        reading: "reading",
        done: "done",
        "": "",
    }
    return reverseMap[status]
}
