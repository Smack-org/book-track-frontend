import axios from "axios"
import type { BookType } from "../types/book"
import type { BookDTO } from "../types/bookDTO"
import { handleApiError } from "./axios"

const BOOK_SERVICE_URL = import.meta.env.VITE_BOOK_SERVICE_URL
const DEFAULT_TIMEOUT = 10000

const apiClient = axios.create({
    baseURL: BOOK_SERVICE_URL,
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
    results: BookDTO[]
}

type SearchParams = {
    query?: string
    sort?: "ascending" | "descending"
    topic?: string
}

export const BookService = {
    async getBooks(): Promise<BookType[]> {
        try {
            const response = await apiClient.get<ApiResponse>("/books")
            return response.data.results
        } catch (error) {
            throw handleApiError(error)
        }
    },

    async getBookById(id: number): Promise<BookType> {
        try {
            const response = await apiClient.get<ApiResponse>(`/books`, {
                params: { ids: id },
            })
            return response.data.results[0]
        } catch (error) {
            throw handleApiError(error)
        }
    },

    async getBooksByIds(ids: number[]): Promise<BookType[]> {
        try {
            const response = await apiClient.get<ApiResponse>(`/books`, {
                params: { ids },
            })
            return response.data.results
        } catch (error) {
            throw handleApiError(error)
        }
    },

    async searchBooks({ query, sort, topic }: SearchParams): Promise<BookType[]> {
        try {
            const response = await apiClient.get<ApiResponse>("/books", {
                params: { search: query, sort: sort, topic: topic },
            })
            return response.data.results
        } catch (error) {
            throw handleApiError(error)
        }
    },
}
