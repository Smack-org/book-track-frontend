import { createAuthApiInstance, handleApiError } from "../axios"
import type { AddFavoriteBookRequest, AddFavoriteBookResponse, GetFavoriteBooksResponse, RemoveFavoriteBookResponse } from "./types/favorites"
import type { BookType } from "../../types/book"
import { adaptBookFromDTO } from "../../types/bookDTOAdapter"

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL
const api = createAuthApiInstance(USER_SERVICE_URL)

export const FavoritesService = {
    async getFavoriteBooks(): Promise<BookType[]> {
        try {
            const { data } = await api.get<GetFavoriteBooksResponse>(USER_SERVICE_URL + "/favourites")
            return data.map((b) => adaptBookFromDTO(b.book))
        } catch (e) {
            throw handleApiError(e)
        }
    },

    async setFavoriteBook(bookId: number, isFavorite: boolean) {
        if (isFavorite) {
            this.addFavoriteBook(bookId)
        } else {
            this.removeFavoriteBook(bookId)
        }
    },

    async addFavoriteBook(bookId: number) {
        const payload: AddFavoriteBookRequest = {
            book_id: bookId,
        }
        try {
            await api.post<AddFavoriteBookRequest, AddFavoriteBookResponse>(USER_SERVICE_URL + "/favourites", payload)
        } catch (e) {
            throw handleApiError(e)
        }
    },

    async removeFavoriteBook(bookId: number) {
        try {
            await api.delete<object, RemoveFavoriteBookResponse>(USER_SERVICE_URL + `/favourites/${bookId}`)
        } catch (e) {
            throw handleApiError(e)
        }
    },
}
