/**
 * @vitest-enviroment
 */

import { mount } from "@vue/test-utils"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { createRouter, createMemoryHistory, type Router } from "vue-router"
import Header from "./Header.vue"
import { RouterLinkStub } from "@vue/test-utils"
import { setActivePinia, createPinia } from "pinia"
import useAuthStore, { type AuthStoreType } from "../stores/auth.store"

describe("Header Component", () => {
    let router: Router
    let authStore: AuthStoreType

    beforeEach(() => {
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: "/login", name: "login", component: { template: "<div>Login</div>" } },
                { path: "/register", name: "register", component: { template: "<div>Register</div>" } },
                { path: "/search", name: "search", component: { template: "<div>Search</div>" } },
                { path: "/reading-list", name: "reading-list", component: { template: "<div>Reading List</div>" } },
                { path: "/dashboard", name: "dashboard", component: { template: "<div>Dashboard</div>" } },
                { path: "/favorites", name: "favorites", component: { template: "<div>Favorites</div>" } },
            ],
        })

        setActivePinia(createPinia())
        authStore = useAuthStore()
    })

    it("displays login and register links when not authenticated", async () => {
        const wrapper = mount(Header, {
            global: {
                plugins: [router],
                stubs: {
                    RouterLink: RouterLinkStub,
                },
            },
        })

        await router.isReady()

        const links = wrapper.findAllComponents(RouterLinkStub)
        expect(links.length).toBe(2)
        expect(links[0].text()).toBe("login")
        expect(links[1].text()).toBe("register")
    })

    it("shows authenticated navigation when logged in", async () => {
        authStore.token = "123"
        authStore.user = { login: "testuser", created_at: "", uid: "", username: "" }

        const wrapper = mount(Header, {
            global: {
                plugins: [router],
                stubs: {
                    RouterLink: RouterLinkStub,
                },
            },
        })

        await router.isReady()

        expect(wrapper.text()).toContain("hello, testuser")

        const links = wrapper.findAllComponents(RouterLinkStub)
        const linkTexts = links.map((link) => link.text())
        expect(linkTexts).toContain("logout")
        expect(linkTexts).toContain("search books")
        expect(linkTexts).toContain("reading list")
        expect(linkTexts).toContain("dashboard")
        expect(linkTexts).toContain("favorites")
    })

    it("triggers logout when logout link is clicked", async () => {
        authStore.token = "123"
        authStore.user = { login: "testuser", created_at: "", uid: "", username: "" }
        authStore.logout = vi.fn()

        const wrapper = mount(Header, {
            global: {
                plugins: [router],
                stubs: {
                    RouterLink: RouterLinkStub,
                },
            },
        })

        await router.isReady()

        const links = wrapper.findAllComponents(RouterLinkStub)

        const logoutLink = links.find((link) => link.text() === "logout")

        if (!logoutLink) {
            throw new Error("Logout link not found")
        }

        await logoutLink.trigger("click")

        expect(authStore.logout).toHaveBeenCalledTimes(1)
    })

    it("does not show authenticated links when logged out", async () => {
        const wrapper = mount(Header, {
            global: {
                plugins: [router],
                stubs: {
                    RouterLink: RouterLinkStub,
                },
            },
        })

        await router.isReady()

        expect(wrapper.text()).not.toContain("search books")
        expect(wrapper.text()).not.toContain("reading list")
        expect(wrapper.text()).not.toContain("dashboard")
        expect(wrapper.text()).not.toContain("favorites")
    })

    it("shows correct number of navigation items for each state", async () => {
        let wrapper = mount(Header, {
            global: {
                plugins: [router],
                stubs: {
                    RouterLink: RouterLinkStub,
                },
            },
        })
        await router.isReady()
        expect(wrapper.findAllComponents(RouterLinkStub).length).toBe(2)

        authStore.token = "123"
        authStore.user = { login: "testuser", created_at: "", uid: "", username: "" }
        wrapper = mount(Header, {
            global: {
                plugins: [router],
                stubs: {
                    RouterLink: RouterLinkStub,
                },
            },
        })
        await router.isReady()
        expect(wrapper.findAllComponents(RouterLinkStub).length).toBe(5)
    })
})
