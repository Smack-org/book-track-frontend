import { type BookType } from "./book"

export type SearchResult = {
    count: number
    books: BookType[]
}
