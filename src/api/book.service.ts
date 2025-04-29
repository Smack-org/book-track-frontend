import axios from "axios"
import type { Book } from "../types/book"
import type { BookType } from "./book"

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

type ApiResponse = {
    count: number
    next: string
    previous: null
    results: BookType[]
}

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

    async getBooksByIds(ids: number[]): Promise<Book[]> {
        try {
            const response = await apiClient.get<ApiResponse>(`/`, {
                params: { ids },
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
