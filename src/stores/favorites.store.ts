import { defineStore } from "pinia"
import type { BookType } from "../types/book"
import { FavoritesService } from "../api/user/favorites.service"

interface FavoritesState {
    books: BookType[]
    isLoading: boolean
    error: string | null
}

const useFavoritesStore = defineStore("favorites", {
    state: (): FavoritesState => ({
        books: [],
        isLoading: false,
        error: null,
    }),

    getters: {
        getBooks: (state) => state.books,
        hasBook: (state) => (bookId: number) => state.books.some((book) => book.id === bookId),
        isEmpty: (state) => state.books.length === 0,
    },

    actions: {
        async fetchFavoriteBooks() {
            this.isLoading = true
            this.error = null
            try {
                const response = await FavoritesService.getFavoriteBooks()
                this.books = response.map((b) => b.book)
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Failed to fetch favorites"
                console.error("Error fetching favorites:", error)
            } finally {
                this.isLoading = false
            }
        },

        async addBook(book: BookType) {
            if (this.hasBook(book.id)) return

            try {
                await FavoritesService.addFavoriteBook(book.id)
                this.books.push(book)
            } catch (error) {
                console.error("Error adding favorite:", error)
                throw error
            }
        },

        async removeBook(bookId: number) {
            try {
                await FavoritesService.removeFavoriteBook(bookId)
                this.books = this.books.filter((book) => book.id !== bookId)
            } catch (error) {
                console.error("Error removing favorite:", error)
                throw error
            }
        },

        async toggleBook(book: BookType) {
            if (this.hasBook(book.id)) {
                await this.removeBook(book.id)
            } else {
                await this.addBook(book)
            }
        },
    },
})

export default useFavoritesStore
