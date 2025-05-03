import type { BookDTO } from "../../types/bookDTO"

export type AddFavoriteBookRequest = {
    book_id: number
}

export type AddFavoriteBookResponse = {
    book: BookDTO
    added_at: string
}

export type RemoveFavoriteBookParameters = {
    book_id: string
}

export type RemoveFavoriteBookResponse = {
    book: BookDTO
    added_at: string
}

export type GetFavoriteBooksParameters = {
    offset: string
    limit: string
}

export type GetFavoriteBooksResponse = {
    book: BookDTO
    added_at: string
}[]
