import axios from "axios"
import { addAuthInterceptor, handleApiError } from "../axios"
import type {
    AddFavoriteBookRequest,
    AddFavoriteBookResponse,
    GetFavoriteBooksResponse,
    RemoveFavoriteBookParameters as RemoveFavoriteBookParameters,
    RemoveFavoriteBookResponse,
} from "./types/favorites"

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL
const DEFAULT_TIMEOUT = 5000

const api = axios.create({ baseURL: USER_SERVICE_URL, timeout: DEFAULT_TIMEOUT })
addAuthInterceptor(api)

export const FavoritesService = {
    async getFavoriteBooks(): Promise<GetFavoriteBooksResponse> {
        try {
            const { data } = await api.get<GetFavoriteBooksResponse>(USER_SERVICE_URL + "/favorites")
            return data
        } catch (e) {
            throw handleApiError(e)
        }
    },

    async addFavoriteBook(bookId: number) {
        const payload: AddFavoriteBookRequest = {
            bookId,
        }
        try {
            const data = await api.post<AddFavoriteBookRequest, AddFavoriteBookResponse>(USER_SERVICE_URL + "/favorites", payload)
            return data
        } catch (e) {
            throw handleApiError(e)
        }
    },

    async removeFavoriteBook(bookId: number) {
        const payload: RemoveFavoriteBookParameters = {
            bookId: String(bookId),
        }
        try {
            const data = await api.delete<object, RemoveFavoriteBookResponse, RemoveFavoriteBookParameters>(USER_SERVICE_URL + "/favorites", { params: payload })
            return data
        } catch (e) {
            throw handleApiError(e)
        }
    },
}
