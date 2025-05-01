export const BookStatusMap = {
    want: "want",
    reading: "reading",
    read: "done",
    none: "",
} as const

type BookStatus = (typeof BookStatusMap)[keyof typeof BookStatusMap]
export const BookStatuses = Object.values(BookStatusMap)

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
