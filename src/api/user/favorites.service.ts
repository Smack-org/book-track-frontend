import axios from "axios"
import { addAuthInterceptor, handleApiError } from "../axios"
import type { AddFavoriteBookRequest, AddFavoriteBookResponse, GetFavoriteBooksResponse, RemoveFavoriteBookResponse } from "./types/favorites"

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL
const DEFAULT_TIMEOUT = 5000

const api = axios.create({ baseURL: USER_SERVICE_URL, timeout: DEFAULT_TIMEOUT })
addAuthInterceptor(api)

export const FavoritesService = {
    async getFavoriteBooks(): Promise<GetFavoriteBooksResponse> {
        try {
            const { data } = await api.get<GetFavoriteBooksResponse>(USER_SERVICE_URL + "/favourites")
            return data
        } catch (e) {
            throw handleApiError(e)
        }
    },

    async addFavoriteBook(bookId: number) {
        const payload: AddFavoriteBookRequest = {
            book_id: bookId,
        }
        try {
            const data = await api.post<AddFavoriteBookRequest, AddFavoriteBookResponse>(USER_SERVICE_URL + "/favourites", payload)
            return data
        } catch (e) {
            throw handleApiError(e)
        }
    },

    async removeFavoriteBook(bookId: number) {
        try {
            const data = await api.delete<object, RemoveFavoriteBookResponse>(USER_SERVICE_URL + `/favourites/${bookId}`)
            return data
        } catch (e) {
            throw handleApiError(e)
        }
    },
}
