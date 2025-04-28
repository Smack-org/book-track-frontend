export const BookStatuses = ["want", "reading", "read", ""] as const
export type BookStatus = (typeof BookStatuses)[number]

export type AuthorType = {
    name: string
    birth_year?: number
    death_year?: number
}

export type Book = {
    id: number
    title: string
    authors: AuthorType[]
    summaries: string[]
    translators: AuthorType[]
    subjects: string[]
    bookshelves: string[]
    copyright: boolean
    is_favorite: boolean
    status: BookStatus
}
