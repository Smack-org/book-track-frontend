import { mount } from "@vue/test-utils"
import { assert, describe, expect, it, vi } from "vitest"
import RegistrationPage from "./RegistrationPage.vue"
import { createTestingPinia } from "@pinia/testing"
import useAuthStore from "../../stores/auth.store"
import { useRoute, useRouter, type RouteLocationNormalizedLoaded, type Router } from "vue-router"

vi.mock("vue-router", () => ({
    useRoute: vi.fn(),
    useRouter: vi.fn(() => ({
        replace: vi.fn(),
    })),
}))

describe("RegistrationPage", () => {
    it("renders the registration page", () => {
        const wrapper = mount(RegistrationPage, { global: { plugins: [createTestingPinia()] } })

        const form = wrapper.find("form")
        assert(form.exists())
        assert(form.find("input#password").exists())
        assert(form.find("input#login").exists())
        assert(form.find("button").exists())
    })

    it("shows error on failed registration", async () => {
        const testError = new Error("Registration failed: Invalid credentials")

        const wrapper = mount(RegistrationPage, {
            global: {
                plugins: [createTestingPinia()],
            },
        })

        const authStore = useAuthStore()
        authStore.register = vi.fn().mockRejectedValue(testError)

        await wrapper.find("#login").setValue("wronglogin")
        await wrapper.find("#password").setValue("wrongpassword")
        await wrapper.find("form").trigger("submit.prevent")

        await wrapper.vm.$nextTick()

        const errDiv = wrapper.find(".error")
        assert(errDiv.exists())
        expect(errDiv.text()).contain("Registration failed")
        expect(errDiv.text()).contain("Invalid credentials")
    })

    describe("handles successful registration", () => {
        it("redirects to default by default", async () => {
            vi.mocked(useRoute).mockReturnValue({
                query: {},
                path: "/register",
                fullPath: "/register",
            } as unknown as RouteLocationNormalizedLoaded)

            const mockRouter = {
                replace: vi.fn(),
                currentRoute: {
                    value: { path: "/" },
                    __v_isRef: true,
                },
            } as unknown as Router
            vi.mocked(useRouter).mockReturnValue(mockRouter)

            const wrapper = mount(RegistrationPage, {
                global: {
                    plugins: [createTestingPinia()],
                },
            })

            const authStore = useAuthStore()
            authStore.register = vi.fn().mockResolvedValue({})

            await wrapper.find("form").trigger("submit.prevent")

            expect(mockRouter.replace).toHaveBeenCalledWith({ name: "search" })
        })

        it("redirects to redirect parameter if has one", async () => {
            vi.mocked(useRoute).mockReturnValue({
                query: { redirect: "/favorites" },
                path: "/register",
                fullPath: "/register/?redirect=/favorites",
            } as unknown as RouteLocationNormalizedLoaded)

            const mockRouter = {
                replace: vi.fn(),
                currentRoute: {
                    value: { path: "/" },
                    __v_isRef: true,
                },
            } as unknown as Router
            vi.mocked(useRouter).mockReturnValue(mockRouter)

            const wrapper = mount(RegistrationPage, {
                global: {
                    plugins: [createTestingPinia()],
                },
            })

            const authStore = useAuthStore()
            authStore.register = vi.fn().mockResolvedValue({})

            await wrapper.find("form").trigger("submit.prevent")

            expect(mockRouter.replace).toHaveBeenCalledWith("/favorites")
        })
    })
})
