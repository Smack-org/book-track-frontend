import { defineStore } from "pinia"
import type { BookStatus, BookType } from "../types/book"
import { BooksWithStatusesService } from "../api/user/booksWithStatus.service"

interface BooksWithStatuses {
    books: BookType[]
    isLoading: boolean
    error: string | null
}

const useBooksWithStatusesStore = defineStore("books-with-statuses", {
    state: (): BooksWithStatuses => ({
        books: [],
        isLoading: false,
        error: null,
    }),

    getters: {
        getBooks: (state) => (bookStatus: BookStatus) => state.books.filter((book) => book.status === bookStatus),
        isEmpty: (state) => (bookStatus: BookStatus) => state.books.filter((book) => book.status === bookStatus).length === 0,
    },

    actions: {
        async fetch() {
            this.isLoading = true
            this.error = null
            try {
                const response = await BooksWithStatusesService.get()
                console.log(response)
                this.books = response
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Failed to fetch from reading list"
                console.error("Error fetching reading list:", error)
            } finally {
                this.isLoading = false
            }
        },

        async setStatus(bookId: number, status: BookStatus) {
            try {
                await BooksWithStatusesService.setStatus(String(bookId), status)
                this.books = this.books.filter((book) => book.id !== bookId)
            } catch (error) {
                console.error("Error removing from reading list:", error)
                throw error
            }
        },
    },
})

export default useBooksWithStatusesStore
