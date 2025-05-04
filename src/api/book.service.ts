import axios from "axios"
import type { BookType } from "../types/book"
import type { BookDTO } from "../types/bookDTO"
import { addAuthInterceptor, handleApiError } from "./axios"
import { adaptBookFromDTO } from "../types/bookDTOAdapter"
import type { SearchResult } from "../types/SearchResult"

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
addAuthInterceptor(apiClient)

type ApiSearchResponse = {
    count: number
    next: string
    previous: null
    results: BookDTO[]
}

type SearchParams = {
    query?: string
    sort?: "ascending" | "descending"
    topic?: string
    page?: number
}

export const BookService = {
    async getBookById(id: number): Promise<BookType> {
        try {
            const response = await apiClient.get<ApiSearchResponse>(`/books`, {
                params: { ids: id },
            })

            if (response.data.results.length === 0) {
                throw new Error("book not found")
            }

            return adaptBookFromDTO(response.data.results[0])
        } catch (error) {
            throw handleApiError(error)
        }
    },

    async getBooksByIds(ids: number[]): Promise<BookType[]> {
        try {
            const response = await apiClient.get<ApiSearchResponse>(`/books`, {
                params: { ids },
            })
            return response.data.results.map((b) => adaptBookFromDTO(b))
        } catch (error) {
            throw handleApiError(error)
        }
    },

    async searchBooks({ query, sort, topic, page }: SearchParams): Promise<SearchResult> {
        try {
            const response = await apiClient.get<ApiSearchResponse>("/books", {
                params: { search: query, sort, topic, page },
            })
            return {
                count: response.data.count,
                books: response.data.results.map((b) => adaptBookFromDTO(b)),
            }
        } catch (error) {
            throw handleApiError(error)
        }
    },
}
