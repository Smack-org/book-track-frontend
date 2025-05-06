import { setActivePinia, createPinia } from "pinia"
import { describe, beforeEach, expect, it, vi } from "vitest"
import useAuthStore from "./auth.store"
import { TokenService } from "./tokens.localstore"
import { AuthAPI, AuthenticationError } from "../api/auth/auth.api"

vi.mock("../api/auth/auth.api.ts", () => ({
    AuthAPI: {
        login: vi.fn(),
        register: vi.fn(),
        getUser: vi.fn(),
    },
    AuthenticationError: class extends Error {
        name = "AuthenticationError"
        errorCode = "401"
        constructor(message = "Invalid credentials") {
            super(message)
        }
    },
}))

vi.mock("./tokens.localstore.ts", () => ({
    TokenService: {
        getToken: vi.fn(),
        saveToken: vi.fn(),
        removeToken: vi.fn(),
    },
}))

describe("useAuthStore", () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    it("logs in successfully", async () => {
        const store = useAuthStore()

        const token = "mock-token"
        const mockUser = { username: "test", login: "test", uid: "1", created_at: "2023-01-01" }

        vi.mocked(AuthAPI.login).mockResolvedValue({ access_token: token, token_type: "Bearer" })
        vi.mocked(AuthAPI.getUser).mockResolvedValue(mockUser)

        await store.login({ login: "test", password: "123", username: "" })

        expect(store.token).toBe(token)
        expect(store.user).toEqual(mockUser)
        expect(TokenService.saveToken).toHaveBeenCalledWith(token)
    })

    it("handles login error", async () => {
        const store = useAuthStore()

        const error = new AuthenticationError("Unauthorized", "Bad credentials")
        vi.mocked(AuthAPI.login).mockRejectedValue(error)

        await expect(store.login({ login: "fail", password: "wrong", username: "" })).rejects.toThrow("Unauthorized")

        expect(store.error).toContain("AuthenticationError")
        expect(store.token).toBe(null)
    })

    it("registers successfully", async () => {
        const store = useAuthStore()
        const token = "register-token"
        const mockUser = { username: "new", login: "new", uid: "2", created_at: "2023-02-02" }

        vi.mocked(AuthAPI.register).mockResolvedValue({ access_token: token, token_type: "Bearer" })
        vi.mocked(AuthAPI.getUser).mockResolvedValue(mockUser)

        await store.register({ login: "new", password: "1234", username: "new" })

        expect(store.token).toBe(token)
        expect(store.user).toEqual(mockUser)
        expect(TokenService.saveToken).toHaveBeenCalledWith(token)
    })

    it("logs out correctly", () => {
        const store = useAuthStore()
        store.token = "some-token"
        store.user = { username: "x", login: "x", uid: "x", created_at: "x" }

        store.logout()

        expect(store.token).toBe(null)
        expect(store.user).toBe(null)
        expect(TokenService.removeToken).toHaveBeenCalled()
    })

    it("fetches user if token exists", async () => {
        const store = useAuthStore()
        store.token = "token"
        const user = { username: "y", login: "y", uid: "y", created_at: "2024" }
        vi.mocked(AuthAPI.getUser).mockResolvedValue(user)

        await store.fetchUser()

        expect(store.user).toEqual(user)
    })

    it("clears token on fetchUser error", async () => {
        const store = useAuthStore()
        store.token = "token"
        vi.mocked(AuthAPI.getUser).mockRejectedValue(new Error("fail"))

        await expect(store.fetchUser()).rejects.toThrow("fail")
        expect(store.token).toBe(null)
        expect(store.user).toBe(null)
    })
})
