import axios from "axios"
import type { Book } from "../types/book"

const BASE_URL = "https://gutendex.com/books"
const DEFAULT_TIMEOUT = 10000

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
})

type SearchParams = {
    query?: string
    sort?: "ascending" | "descending"
    topic?: string
}

export const BookService = {
    async getBooks(): Promise<Book[]> {
        try {
            const response = await apiClient.get<ApiResponse>("/")
            return response.data.results
        } catch (error) {
            handleApiError(error)
            throw error
        }
    },

    async getBookById(id: number): Promise<Book> {
        try {
            const response = await apiClient.get<ApiResponse>(`/`, {
                params: { ids: id },
            })
            return response.data.results[0]
        } catch (error) {
            handleApiError(error)
            throw error
        }
    },

    async getBookByIds(id: number): Promise<Book[]> {
        try {
            const response = await apiClient.get<ApiResponse>(`/`, {
                params: { ids: id },
            })
            return response.data.results
        } catch (error) {
            handleApiError(error)
            throw error
        }
    },

    async searchBooks({ query, sort, topic }: SearchParams): Promise<BookType[]> {
        try {
            const response = await apiClient.get<ApiResponse>("/", {
                params: { search: query, sort: sort, topic: topic },
            })
            return response.data.results
        } catch (error) {
            handleApiError(error)
            throw error
        }
    },
}

function handleApiError(error: unknown): void {
    if (axios.isAxiosError(error)) {
        console.error("API Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        })
        throw new Error(error.response?.data?.message || "An error occurred while fetching books")
    }
    console.error("Unexpected error:", error)
    throw new Error("An unexpected error occurred")
}

type ApiResponse = {
    count: number
    next: string
    previous: null
    results: BookType[]
}

type BookStatus = "want" | "reading" | "read" | ""

type BookType = {
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
    birth_year: number | null
    death_year: number | null
}

type Formats = {
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
