/**
 * @vitest-enviroment
 */

import { mount } from "@vue/test-utils"
import { describe, it, expect } from "vitest"
import BookList from "./BookList.vue"
import Book from "./Book.vue"
import type { BookType } from "../types/book"

const mockBooks: BookType[] = [
    {
        id: 1,
        title: "Test Book 1",
        authors: [{ name: "Author 1" }],
        subjects: ["Fiction"],
        is_favorite: false,
        status: "want",
        summaries: [],
        translators: [],
        bookshelves: [],
        copyright: true,
    },
    {
        id: 2,
        title: "Test Book 2",
        authors: [{ name: "Author 2" }],
        subjects: ["Science"],
        is_favorite: true,
        status: "reading",
        summaries: [],
        translators: [],
        bookshelves: [],
        copyright: true,
    },
]

describe("BookList", () => {
    it("renders a list of Book components", () => {
        const wrapper = mount(BookList, {
            props: { books: mockBooks },
        })

        const bookComponents = wrapper.findAllComponents(Book)
        expect(bookComponents.length).toBe(mockBooks.length)
    })

    it("passes correct book prop to each Book component", () => {
        const wrapper = mount(BookList, {
            props: { books: mockBooks },
        })

        const bookComponents = wrapper.findAllComponents(Book)
        mockBooks.forEach((book, index) => {
            expect(bookComponents[index].props("book")).toEqual(book)
        })
    })

    it("renders correct number of list items", () => {
        const wrapper = mount(BookList, {
            props: { books: mockBooks },
        })

        const listItems = wrapper.findAll(".books-item")
        expect(listItems.length).toBe(mockBooks.length)
    })

    it("renders empty state when no books provided", () => {
        const wrapper = mount(BookList, {
            props: { books: [] },
        })

        const listItems = wrapper.findAll(".books-item")
        expect(listItems.length).toBe(0)
        expect(wrapper.find("ul").exists()).toBe(true)
    })

    it("updates when books prop changes", async () => {
        const wrapper = mount(BookList, {
            props: { books: [mockBooks[0]] },
        })

        expect(wrapper.findAllComponents(Book).length).toBe(1)

        await wrapper.setProps({ books: mockBooks })
        expect(wrapper.findAllComponents(Book).length).toBe(2)
    })
})
