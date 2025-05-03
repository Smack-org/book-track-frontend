import { defineStore } from "pinia"
import type { User } from "../types/user"
import { AuthAPI, AuthenticationError } from "../api/auth/auth.api"
import { TokenService } from "./tokens.localstore"

type AuthCreds = {
    login: string
    password: string
    username: string
}

const useAuthStore = defineStore("userStore", {
    state() {
        return {
            user: null as User | null,
            token: TokenService.getToken() || null,
            loading: false,
            error: null as string | null,
            initialized: false,
        }
    },

    getters: {
        isAuthentificated: (state) => !!state.token,
    },

    actions: {
        async login({ login: user_login, password }: AuthCreds) {
            this.loading = true
            this.error = null
            try {
                const { access_token } = await AuthAPI.login(user_login, password)
                this.setTokens(access_token)
                await this.fetchUser()
            } catch (e) {
                this.error = handleAuthError(e) || "login failed"
                console.error(e)
                throw e
            } finally {
                this.loading = false
            }
        },

        async register({ login, password, username }: AuthCreds) {
            this.loading = true
            try {
                const { access_token } = await AuthAPI.register(username, login, password)
                this.setTokens(access_token)
                await this.fetchUser()
            } catch (e: unknown) {
                this.error = handleAuthError(e) || "registration failed"
                throw e
            } finally {
                this.loading = false
            }
        },

        logout() {
            this.token = null
            this.user = null
            TokenService.removeToken()
        },

        async fetchUser() {
            if (!this.token) return

            try {
                const { username, login, uid } = await AuthAPI.getUser()
                this.user = { username, login, uid }
            } catch (e) {
                this.logout()
                throw e
            }
        },

        setTokens(idToken: string) {
            this.token = idToken
            TokenService.saveToken(idToken)
        },
    },
})

export const handleAuthError = (e: unknown): string => {
    if (e instanceof AuthenticationError) {
        return `${e.name}: ${e.errorCode} ${e.message}`
    } else if (e instanceof Error) {
        return `Unrecognized error: ${e.message}`
    } else {
        return `Unrecognized error: ${e}`
    }
}

export default useAuthStore
