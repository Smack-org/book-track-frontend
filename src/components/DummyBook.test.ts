/**
 * @vitest-enviroment
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { mount, RouterLinkStub } from "@vue/test-utils"
import DummyBook from "./DummyBook.vue"
import { type BookType } from "../types/book.d"
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
    is_favorite: false,
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
        const wrapper = mount(DummyBook, {
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
        const wrapper = mount(DummyBook, {
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
        const wrapper = mount(DummyBook, {
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
})
