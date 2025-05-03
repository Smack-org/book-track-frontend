import axios, { type AxiosResponse } from "axios"
import { addAuthInterceptor, handleApiError } from "../axios"
import type { AddToReadingListRequest, AddToReadingListResponse, GetReadingListsParameters, GetReadingListsResponse, RemoveFromReadingListParameters } from "./types/booksStatuses"
import type { BookStatus, BookType } from "../../types/book"
import { adaptBookFromDTO, mapBookStatus } from "../../types/bookDTOAdapter"
import type { BookDTOStatus } from "../../types/bookDTO"

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL
const DEFAULT_TIMEOUT = 5000

const api = axios.create({ baseURL: USER_SERVICE_URL, timeout: DEFAULT_TIMEOUT })
addAuthInterceptor(api)

export const BooksWithStatusesService = {
    async get(status: BookStatus = "--"): Promise<BookType[]> {
        let params: GetReadingListsParameters | null = null

        if (status !== "--") {
            params = {
                status: mapBookStatus(status),
            }
        }

        try {
            const { data } = await api.get<GetReadingListsResponse, AxiosResponse<GetReadingListsResponse>, GetReadingListsParameters>(USER_SERVICE_URL + "/reading-list", { params })

            if (!Array.isArray(data)) {
                throw new Error(`get books with status: Invalid response format ${data}`)
            }

            return data.map((v) => adaptBookFromDTO(v.book))
        } catch (e) {
            throw handleApiError(e)
        }
    },

    async setStatus(bookId: number, status: BookStatus) {
        const dtoStatus = mapBookStatus(status)
        if (dtoStatus === "") {
            return this.removeStatus(String(bookId))
        } else {
            return this.addStatus(bookId, dtoStatus)
        }
    },

    async removeStatus(bookId: string) {
        const params: RemoveFromReadingListParameters = {
            book_id: bookId,
        }
        try {
            const data = await api.delete(USER_SERVICE_URL + `/reading-list/${params.book_id}`)
            return data
        } catch (e) {
            throw handleApiError(e)
        }
    },

    async addStatus(bookId: number, status: BookDTOStatus) {
        const payload: AddToReadingListRequest = {
            book_id: bookId,
            status: status,
        }
        try {
            const data = await api.post<AddToReadingListRequest, AddToReadingListResponse>(USER_SERVICE_URL + "/reading-list", payload)
            return data
        } catch (e) {
            throw handleApiError(e)
        }
    },
}
