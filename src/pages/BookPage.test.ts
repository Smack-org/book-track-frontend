import { mount } from "@vue/test-utils"
import { beforeEach, describe, expect, it, vi } from "vitest"
import BookPage from "./BookPage.vue"
import type { BookType } from "../types/book"
import { BookService } from "../api/book.service"

const mockBook: BookType = {
    id: 1,
    title: "Test Book",
    authors: [{ name: "Author One" }],
    summaries: ["A test book summary"],
    translators: [{ name: "Translator One" }],
    subjects: ["Fiction"],
    bookshelves: ["Test Shelf"],
    copyright: true,
    is_favourite: false,
    status: "want",
}

vi.mock("../api/book.service", () => ({
    BookService: {
        getBookById: vi.fn(),
    },
}))

describe("BookPage", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renderes a book", async () => {
        vi.mocked(BookService.getBookById).mockResolvedValue(mockBook)

        const wrapper = mount(BookPage, { props: { bookId: 1 } })

        await wrapper.vm.$nextTick()
        await wrapper.vm.$nextTick()

        expect(wrapper.findComponent({ name: "DummyBook" }).props("book")).toEqual(mockBook)
    })

    it("loading is showing", () => {
        vi.mocked(BookService.getBookById).mockImplementation(() => new Promise(() => {}))

        const wrapper = mount(BookPage, {
            props: { bookId: 1 },
        })

        expect(wrapper.find("p").text()).toContain("Loading...")
    })

    it("should show an error", async () => {
        vi.mocked(BookService.getBookById).mockRejectedValue(new Error("Network error"))

        const wrapper = mount(BookPage, {
            props: { bookId: 1 },
        })

        await new Promise((resolve) => setTimeout(resolve, 0))
        await wrapper.vm.$nextTick()

        expect(wrapper.find("p").text()).toContain("error")
    })
})
