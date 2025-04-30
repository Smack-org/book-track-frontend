import { http, HttpResponse } from "msw"
import type { BookDTO, BookDTOStatus } from "../../types/bookDTO"

interface UpdateStatusRequest {
    status: BookDTOStatus
}
const SERVICE_URL = import.meta.env.VITE_BOOK_SERVICE_URL

console.log(SERVICE_URL)

export default function (mockBooks: BookDTO[]) {
    return [
        http.get(SERVICE_URL + "/books", ({ request }) => {
            const url = new URL(request.url)
            const ids = url.searchParams.get("ids")

            let results = mockBooks

            if (ids) {
                const idArray = ids.split(",").map(Number)
                results = mockBooks.filter((book) => idArray.includes(book.id))
            }

            return HttpResponse.json({
                count: results.length,
                next: null,
                previous: null,
                results,
            })
        }),

        http.get(SERVICE_URL + "/books/:id", ({ params }) => {
            const book = mockBooks.find((b) => b.id === Number(params.id))

            if (!book) {
                return new HttpResponse(null, { status: 404 })
            }

            return HttpResponse.json({
                count: 1,
                next: null,
                previous: null,
                results: [book],
            })
        }),

        http.get(SERVICE_URL + "/books/search", ({ request }) => {
            const url = new URL(request.url)
            const query = url.searchParams.get("search")
            const sort = url.searchParams.get("sort")
            const topic = url.searchParams.get("topic")

            let results = [...mockBooks]

            if (query) {
                results = results.filter((book) => book.title.toLowerCase().includes(query.toLowerCase()) || book.authors.some((author) => author.name.toLowerCase().includes(query.toLowerCase())))
            }

            if (topic) {
                results = results.filter((book) => book.subjects.includes(topic) || book.bookshelves.includes(topic))
            }

            if (sort === "ascending") {
                results.sort((a, b) => a.title.localeCompare(b.title))
            } else if (sort === "descending") {
                results.sort((a, b) => b.title.localeCompare(a.title))
            }

            return HttpResponse.json({
                count: results.length,
                next: null,
                previous: null,
                results,
            })
        }),

        http.patch<{ id: string }, UpdateStatusRequest>(SERVICE_URL + "/books/:id/status", async ({ request, params }) => {
            const { status } = await request.json()
            const bookIndex = mockBooks.findIndex((b) => b.id === Number(params.id))

            if (bookIndex === -1) {
                return new HttpResponse(null, { status: 404 })
            }

            mockBooks[bookIndex].status = status

            return HttpResponse.json(mockBooks[bookIndex])
        }),

        http.patch(SERVICE_URL + "/books/:id/favorite", async ({ params }) => {
            const bookIndex = mockBooks.findIndex((b) => b.id === Number(params.id))

            if (bookIndex === -1) {
                return new HttpResponse(null, { status: 404 })
            }

            mockBooks[bookIndex].is_favorite = !mockBooks[bookIndex].is_favorite

            return HttpResponse.json(mockBooks[bookIndex])
        }),
    ]
}
