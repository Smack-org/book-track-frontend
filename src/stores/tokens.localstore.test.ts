import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { TokenService } from "./tokens.localstore"

const TOKEN_KEY = "access_token"
const REFRESH_TOKEN_KEY = "refresh_token"

describe("TokenService", () => {
    const testToken = "test_access_token"
    const testRefreshToken = "test_refresh_token"

    beforeEach(() => {
        localStorage.clear()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("saves and retrieves access token", () => {
        TokenService.saveToken(testToken)
        expect(localStorage.getItem(TOKEN_KEY)).toBe(testToken)
        expect(TokenService.getToken()).toBe(testToken)
    })

    it("removes access token", () => {
        localStorage.setItem(TOKEN_KEY, testToken)
        TokenService.removeToken()
        expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    })

    it("saves and retrieves refresh token", () => {
        TokenService.saveRefreshToken(testRefreshToken)
        expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe(testRefreshToken)
        expect(TokenService.getRefreshToken()).toBe(testRefreshToken)
    })

    it("removes refresh token", () => {
        localStorage.setItem(REFRESH_TOKEN_KEY, testRefreshToken)
        TokenService.removeRefreshToken()
        expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBeNull()
    })
})
