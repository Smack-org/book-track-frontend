export type BookDTO = {
    id: number
    title: string
    authors: BookDTOAuthor[]
    summaries: string[]
    translators: BookDTOAuthor[]
    subjects: string[]
    bookshelves: string[]
    languages: BookDTOLanguage[]
    copyright: boolean
    media_type: BookDTOMediaType
    formats: BookDTOFromats
    download_count: number
    is_favourite: boolean
    status: BookDTOStatus
}

export const BookDTOStatusMap = {
    want: "want_to_read",
    reading: "reading",
    read: "done",
    none: "",
} as const

type BookDTOStatus = (typeof BookDTOStatusMap)[keyof typeof BookDTOStatusMap]

export type BookDTOAuthor = {
    name: string
    birth_year?: number
    death_year?: number
}

export type BookDTOFromats = {
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

export enum BookDTOLanguage {
    En = "en",
}

export enum BookDTOMediaType {
    Text = "Text",
}
