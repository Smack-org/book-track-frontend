import type { BookDTOStatuses } from "../../../types/bookDTO"
import type { BookDTO } from "../../types/bookDTO"

export type AddToReadingListRequest = {
    bookId: string
    status: BookDTOStatuses
}

export type AddToReadingListResponse = {
    book: BookDTO
    added_at: string
}

export type RemoveFromReadingListParameters = {
    bookId: string
}

export type RemoveFromReadingListResponse = {
    book: BookDTO
    added_at: string
}

export type GetReadingListsParameters = {
    offset?: string
    limit?: string
    status?: BookDTOStatuses
}

export type GetReadingListsResponse = ReadonlyArray<{
    book: BookDTO
    added_at: string
}>
