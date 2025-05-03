import type { BookDTOStatuses } from "../../../types/bookDTO"
import type { BookDTO } from "../../types/bookDTO"

export type AddToReadingListRequest = {
    book_id: number
    status: BookDTOStatuses
}

export type AddToReadingListResponse = {
    book: BookDTO
    added_at: string
}

export type RemoveFromReadingListParameters = {
    book_id: string
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
