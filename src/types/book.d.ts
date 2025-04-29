export const BookStatuses = ["want", "reading", "read", ""] as const
export type BookStatus = (typeof BookStatuses)[number]

export type BookAuthor = {
    name: string
    birth_year?: number
    death_year?: number
}

export type BookType = {
    id: number
    title: string
    authors: BookAuthor[]
    summaries: string[]
    translators: BookAuthor[]
    subjects: string[]
    bookshelves: string[]
    copyright: boolean
    is_favorite: boolean
    status: BookStatus
}
