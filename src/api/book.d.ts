export type BookStatus = "want" | "reading" | "read" | ""

export type BookType = {
    id: number
    title: string
    authors: AuthorType[]
    summaries: string[]
    translators: AuthorType[]
    subjects: string[]
    bookshelves: string[]
    languages: Language[]
    copyright: boolean
    media_type: MediaType
    formats: Formats
    download_count: number
    is_favorite: boolean
    status: BookStatus
}

export type AuthorType = {
    name: string
    birth_year?: number
    death_year?: number
}

export type Formats = {
    "text/html": string
    "application/epub+zip": string
    "application/x-mobipocket-ebook": string
    "application/rdf+xml": string
    "image/jpeg": string
    "text/plain; charset=us-ascii": string
    "application/octet-stream": string
    "text/plain; charset=utf-8"?: string
    "text/html; charset=utf-8"?: string
    "text/plain; charset=iso-8859-1"?: string
    "text/html; charset=iso-8859-1"?: string
}

export enum Language {
    En = "en",
}

export enum MediaType {
    Text = "Text",
}
