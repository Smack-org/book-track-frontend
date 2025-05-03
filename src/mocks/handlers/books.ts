import { http, HttpResponse } from "msw"
import type { BookDTO } from "../../types/bookDTO"

const SERVICE_URL = import.meta.env.VITE_BOOK_SERVICE_URL

export default function (mockBooks: BookDTO[]) {
    return [
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

        http.get(SERVICE_URL + "/books", ({ request }) => {
            const url = new URL(request.url)

            const query = url.searchParams.get("search")
            const sort = url.searchParams.get("sort")
            const topic = url.searchParams.get("topic")

            let results = [...mockBooks]

            if (query) {
                results = results.filter((book) => book.title.toLowerCase().includes(query.toLowerCase()) || book.authors.some((author) => author.name.toLowerCase().includes(query.toLowerCase())))
            }

            if (topic) {
                results = results.filter((book) => book.subjects.find((t) => t.toLowerCase().includes(topic)) !== undefined)
            }

            if (sort === "ascending") {
                results.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
            } else if (sort === "descending") {
                results.sort((a, b) => b.title.toLocaleUpperCase().localeCompare(a.title.toLowerCase()))
            }

            return HttpResponse.json({
                count: results.length,
                next: null,
                previous: null,
                results,
            })
        }),
    ]
}
