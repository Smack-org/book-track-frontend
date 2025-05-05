import axios, { type AxiosInstance } from "axios"
import useAuthStore from "../stores/auth.store"

export function createAuthApiInstance(baseURL: string): AxiosInstance {
    const instance = axios.create({ baseURL })

    instance.interceptors.request.use((config) => {
        const authStore = useAuthStore()
        if (authStore.token) {
            config.headers.Authorization = `Bearer ${authStore.token}`
        }

        return config
    })

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                const authStore = useAuthStore()
                authStore.logout()
                window.location.href = "/login"
            }
            return Promise.reject(new Error(error))
        }
    )

    return instance
}
export function handleApiError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
        console.error("API Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        })
        return new Error(error.response?.data?.message ?? "An error occurred while fetching books")
    }
    console.error("Unexpected error:", error)
    return new Error("An unexpected error occurred")
}
