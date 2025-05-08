/**
 * @vitest-enviroment
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { mount, RouterLinkStub } from "@vue/test-utils"
import Book from "./Book.vue"
import { BookStatuses, type BookType } from "../types/book.d"
import { FavoritesService } from "../api/user/favorites.service"
import { BooksWithStatusesService } from "../api/user/booksWithStatus.service"
import { nextTick } from "vue"
import { createMemoryHistory, createRouter, RouterLink } from "vue-router"

vi.mock("../api/user/favorites.service")
vi.mock("../api/user/booksWithStatus.service")

const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/book/:bookId", name: "book", component: { template: "<div>Mock Route</div>" } }],
})

const mockBook: BookType = {
    id: 1,
    title: "Test Book",
    authors: [
        { name: "Author One", birth_year: undefined, death_year: undefined },
        { name: "Author Two", birth_year: 1950, death_year: 2020 },
    ],
    subjects: ["Fiction", "Science Fiction"],
    is_favourite: false,
    status: "want",
    summaries: [],
    translators: [],
    bookshelves: [],
    copyright: true,
}

describe("BookComponent", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders book title as a router link", () => {
        const wrapper = mount(Book, {
            props: { book: mockBook },
            global: {
                components: { RouterLink },
                plugins: [router],
                stubs: {
                    RouterLink: RouterLinkStub,
                },
            },
        })

        const link = wrapper.findComponent(RouterLink)
        expect(link.exists()).toBe(true)
        expect(link.text()).toContain(mockBook.title)
        expect(link.props().to).toEqual({
            name: "book",
            params: { bookId: `${mockBook.id}` },
        })
    })

    it('shows "no authors" when authors array is empty', () => {
        const wrapper = mount(Book, {
            props: {
                book: {
                    ...mockBook,
                    authors: [],
                },
            },
            global: {
                stubs: {
                    RouterLink: RouterLinkStub,
                },
            },
        })

        expect(wrapper.find("p").text()).toContain("no authors")
    })

    it("displays all subjects", () => {
        const wrapper = mount(Book, {
            props: { book: mockBook },
            global: {
                stubs: {
                    RouterLink: RouterLinkStub,
                },
            },
        })

        const subjects = wrapper.findAll("li")
        expect(subjects.length).toBeGreaterThanOrEqual(mockBook.subjects.length)
        expect(subjects.some((li) => li.text() === "Fiction")).toBe(true)
        expect(subjects.some((li) => li.text() === "Science Fiction")).toBe(true)
    })

    it("renders all available status options", () => {
        const wrapper = mount(Book, {
            props: { book: mockBook },
            global: {
                stubs: {
                    RouterLink: RouterLinkStub,
                },
            },
        })

        const options = wrapper.findAll("option")
        expect(options.length).toBe(BookStatuses.length)
        BookStatuses.forEach((status) => {
            expect(options.some((opt) => opt.text() === status)).toBe(true)
        })
    })

    it("toggles favorite status when button is clicked", async () => {
        const mockSetFavorite = vi.spyOn(FavoritesService, "setFavoriteBook").mockResolvedValue(undefined)
        const wrapper = mount(Book, {
            props: { book: mockBook },
            global: {
                stubs: {
                    RouterLink: RouterLinkStub,
                },
            },
        })

        const button = wrapper.find("button")
        expect(button.text()).toContain("add to favorites")

        await button.trigger("click")
        expect(mockSetFavorite).toHaveBeenCalledWith(mockBook.id, true)
        expect(wrapper.vm.book.is_favourite).toBe(true)
        await nextTick()
        expect(button.text()).toContain("remove from favorites")

        await button.trigger("click")
        expect(mockSetFavorite).toHaveBeenCalledWith(mockBook.id, false)
        expect(wrapper.vm.book.is_favourite).toBe(false)
        await nextTick()
        expect(button.text()).toContain("add to favorites")
    })

    it("updates book status when selection changes", async () => {
        const mockSetStatus = vi.spyOn(BooksWithStatusesService, "setStatus").mockResolvedValue(undefined)
        const wrapper = mount(Book, {
            props: { book: mockBook },
            global: {
                stubs: {
                    RouterLink: RouterLinkStub,
                },
            },
        })

        const select = wrapper.find("select")
        await select.setValue("reading")

        expect(mockSetStatus).toHaveBeenCalledWith(mockBook.id, "reading")
        expect(wrapper.vm.book.status).toBe("reading")
    })

    it("displays correct favorite button text based on initial state", () => {
        const favoriteBook = { ...mockBook, is_favourite: true }
        const wrapper = mount(Book, {
            props: { book: favoriteBook },
            global: {
                stubs: {
                    RouterLink: RouterLinkStub,
                },
            },
        })

        expect(wrapper.find("button").text()).toContain("remove from favorites")
    })
})
