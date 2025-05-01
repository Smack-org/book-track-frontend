import { defineStore } from "pinia"
import type { User } from "../types/user"
import { AuthAPI, AuthenticationError } from "../api/auth/auth.api"
import { TokenService } from "./tokens.localstore"

type AuthCreds = {
    email: string
    password: string
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
        async login({ email, password }: AuthCreds) {
            this.loading = true
            this.error = null
            try {
                const { token, userId } = await AuthAPI.login(email, password)

                console.log(token, userId)

                this.setTokens(token)
                this.user = { email, uid: userId }
            } catch (e) {
                this.error = handleAuthError(e) || "login failed"
                console.error(e)
                throw e
            } finally {
                this.loading = false
            }
        },

        async register({ email, password }: AuthCreds) {
            this.loading = true
            try {
                const { token, userId } = await AuthAPI.register(email, password)
                this.setTokens(token)
                this.user = { email, uid: userId }
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
                const userData = await AuthAPI.getUser()
                this.user = { email: userData.email, uid: userData.userId }
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
