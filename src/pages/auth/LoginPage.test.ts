import { mount } from "@vue/test-utils"
import LoginForm from "./LoginPage.vue"
import { createTestingPinia } from "@pinia/testing"
import { useRoute, useRouter, type RouteLocationNormalizedLoaded, type Router } from "vue-router"
import { describe, it, expect, vi, beforeEach } from "vitest"
import useAuthStore from "../../stores/auth.store"

vi.mock("vue-router", () => ({
    useRoute: vi.fn(),
    useRouter: vi.fn(() => ({
        replace: vi.fn(),
    })),
}))

type LoginPageInstance = {
    creds: {
        login: string
        password: string
    }
    isLogging: boolean
    error: string
    login: () => Promise<void>
}

describe("LoginPage", () => {
    let mockRouter: Router
    let mockRoute: RouteLocationNormalizedLoaded

    beforeEach(() => {
        vi.clearAllMocks()

        mockRouter = {
            replace: vi.fn(),
            push: vi.fn(),
            currentRoute: {
                value: {
                    path: "/",
                    fullPath: "/",
                    query: {},
                },
            },
        } as unknown as Router

        mockRoute = {
            path: "/login",
            fullPath: "/login",
            query: {},
            params: {},
            name: undefined,
            hash: "",
            matched: [],
            meta: {},
            redirectedFrom: undefined,
        } as unknown as RouteLocationNormalizedLoaded

        vi.mocked(useRouter).mockReturnValue(mockRouter)
        vi.mocked(useRoute).mockReturnValue(mockRoute)
    })

    it("renders the login form", () => {
        const wrapper = mount(LoginForm, {
            global: {
                plugins: [createTestingPinia()],
            },
        })

        expect(wrapper.find("form").exists()).toBe(true)
        expect(wrapper.find("#login").exists()).toBe(true)
        expect(wrapper.find("#password").exists()).toBe(true)
        expect(wrapper.find("button").text()).toBe("login")
    })

    it("updates credentials when input changes", async () => {
        const wrapper = mount(LoginForm, {
            global: {
                plugins: [createTestingPinia()],
            },
        })

        await wrapper.find("#login").setValue("testuser")
        await wrapper.find("#password").setValue("testpass")

        const vm = wrapper.vm as unknown as LoginPageInstance
        expect(vm.creds.login).toBe("testuser")
        expect(vm.creds.password).toBe("testpass")
    })

    it("calls authStore.login on form submit", async () => {
        const wrapper = mount(LoginForm, {
            global: {
                plugins: [
                    createTestingPinia({
                        stubActions: false,
                        createSpy: vi.fn,
                    }),
                ],
            },
        })

        const authStore = useAuthStore()
        authStore.login = vi.fn().mockResolvedValue({})

        await wrapper.find("#login").setValue("testuser")
        await wrapper.find("#password").setValue("testpass")
        await wrapper.find("form").trigger("submit.prevent")

        expect(authStore.login).toHaveBeenCalledTimes(1)
        expect(authStore.login).toHaveBeenCalledWith({
            login: "testuser",
            username: "testuser",
            password: "testpass",
        })
    })

    it("shows loading state during login", async () => {
        const wrapper = mount(LoginForm, {
            global: {
                plugins: [createTestingPinia()],
            },
        })

        const authStore = useAuthStore()
        authStore.login = vi.fn(() => new Promise<void>((resolve) => setTimeout(resolve, 100)))

        wrapper.find("form").trigger("submit.prevent")
        await wrapper.vm.$nextTick()

        const vm = wrapper.vm as unknown as LoginPageInstance

        expect(vm.isLogging).toBe(true)
        expect(wrapper.html()).toContain("Logging...")
    })

    it("shows error message when login fails", async () => {
        const wrapper = mount(LoginForm, {
            global: {
                plugins: [createTestingPinia()],
            },
        })

        const authStore = useAuthStore()
        const testError = new Error("Test error")
        authStore.login = vi.fn().mockRejectedValue(testError)

        await wrapper.find("form").trigger("submit.prevent")
        await wrapper.vm.$nextTick()

        const vm = wrapper.vm as unknown as LoginPageInstance

        expect(vm.error).toContain("Failed to log in")
        expect(wrapper.html()).toContain("Failed to log in")
    })

    it("redirects to search page after successful login", async () => {
        const mockRouter = {
            replace: vi.fn(),
            currentRoute: {
                value: {
                    path: "/",
                },
            },
        } as unknown as Router
        vi.mocked(useRouter).mockReturnValue(mockRouter)

        const wrapper = mount(LoginForm, {
            global: {
                plugins: [createTestingPinia()],
            },
        })

        const authStore = useAuthStore()
        authStore.login = vi.fn().mockResolvedValue({})

        await wrapper.find("form").trigger("submit.prevent")
        await wrapper.vm.$nextTick()

        expect(mockRouter.replace).toHaveBeenCalledWith({ name: "search" })
    })

    it("redirects to query.redirect if present", async () => {
        const mockRoute = {
            query: {
                redirect: "/dashboard",
            },
            path: "/",
            fullPath: "/",
        } as unknown as RouteLocationNormalizedLoaded

        vi.mocked(useRoute).mockReturnValue(mockRoute)
        vi.mocked(useRouter).mockReturnValue(mockRouter)

        vi.mocked(useRoute).mockReturnValue({
            ...mockRoute,
            query: { redirect: "/dashboard" },
            fullPath: "/login?redirect=/dashboard",
        } as unknown as RouteLocationNormalizedLoaded)

        const wrapper = mount(LoginForm, {
            global: {
                plugins: [createTestingPinia()],
            },
        })

        const authStore = useAuthStore()
        authStore.login = vi.fn().mockResolvedValue({})

        await wrapper.find("form").trigger("submit.prevent")
        await wrapper.vm.$nextTick()

        expect(mockRouter.replace).toHaveBeenCalledWith("/dashboard")
    })

    it("handles auth errors properly", async () => {
        const wrapper = mount(LoginForm, {
            global: {
                plugins: [createTestingPinia()],
            },
        })

        const authStore = useAuthStore()
        const testError = new Error("Test error")
        authStore.login = vi.fn().mockRejectedValue(testError)

        await wrapper.find("form").trigger("submit.prevent")
        await wrapper.vm.$nextTick()

        const vm = wrapper.vm as unknown as LoginPageInstance

        expect(vm.error).toBe("Failed to log in. Unrecognized error: Test error")
    })
})
