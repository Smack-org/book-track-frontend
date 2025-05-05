import { mount } from "@vue/test-utils"
import Pagination from "./Pagination.vue"
import { describe, it, expect } from "vitest"

describe("Pagination Component", () => {
    it("renders with initial props", () => {
        const wrapper = mount(Pagination, {
            props: {
                pagesNum: 10,
                curPage: 3,
            },
        })

        expect(wrapper.find("input").element.value).toBe("3")
        expect(wrapper.find(".page-indicator").text()).toContain("Page 3 of 10")
    })

    it("clamps current page to valid range on mount", () => {
        const wrapper1 = mount(Pagination, {
            props: {
                pagesNum: 10,
                curPage: -5,
            },
        })
        expect(wrapper1.find("input").element.value).toBe("1")

        const wrapper2 = mount(Pagination, {
            props: {
                pagesNum: 10,
                curPage: 15,
            },
        })
        expect(wrapper2.find("input").element.value).toBe("10")
    })

    it("emits selectedPage event when page changes", async () => {
        const wrapper = mount(Pagination, {
            props: {
                pagesNum: 10,
                curPage: 3,
            },
        })

        await wrapper.find(".pagination-button:first-child").trigger("click")
        expect(wrapper.emitted("selectedPage")).toEqual([[2]])

        await wrapper.find(".pagination-button:last-child").trigger("click")
        expect(wrapper.emitted("selectedPage")).toEqual([[2], [3]])
    })

    it("disables buttons appropriately", () => {
        const wrapper1 = mount(Pagination, {
            props: {
                pagesNum: 10,
                curPage: 1,
            },
        })
        expect(wrapper1.find(".pagination-button:first-child").attributes("disabled")).toBeDefined()
        expect(wrapper1.find(".pagination-button:last-child").attributes("disabled")).toBeUndefined()

        const wrapper2 = mount(Pagination, {
            props: {
                pagesNum: 10,
                curPage: 10,
            },
        })
        expect(wrapper2.find(".pagination-button:first-child").attributes("disabled")).toBeUndefined()
        expect(wrapper2.find(".pagination-button:last-child").attributes("disabled")).toBeDefined()
    })

    it("updates page when input changes", async () => {
        const wrapper = mount(Pagination, {
            props: {
                pagesNum: 10,
                curPage: 3,
            },
        })

        const input = wrapper.find("input")
        await input.setValue(5)
        expect(wrapper.emitted("selectedPage")).toEqual([[5]])
    })

    it("clamps input values to valid range", async () => {
        const wrapper = mount(Pagination, {
            props: {
                pagesNum: 10,
                curPage: 3,
            },
        })

        await wrapper.find("input").setValue(-5)
        expect(wrapper.find("input").element.value).toBe("1")
        expect(wrapper.emitted("selectedPage")).toEqual([[1]])

        await wrapper.find("input").setValue(15)
        expect(wrapper.find("input").element.value).toBe("10")
        expect(wrapper.emitted("selectedPage")).toEqual([[1], [10]])
    })

    it("emits event on enter key press", async () => {
        const wrapper = mount(Pagination, {
            props: {
                pagesNum: 10,
                curPage: 3,
            },
        })

        const input = wrapper.find("input")
        await input.setValue(7)
        await input.trigger("keydown.enter")
        expect(wrapper.emitted("selectedPage")).toEqual([[7], [7]])
    })

    it("renders default slot content", () => {
        const wrapper = mount(Pagination, {
            props: {
                pagesNum: 10,
                curPage: 3,
            },
            slots: {
                default: "Custom Content",
            },
        })

        expect(wrapper.text()).toContain("Custom Content")
    })
})
