import axios, { type AxiosInstance } from "axios"
import useAuthStore from "../stores/auth.store"

export const addAuthInterceptor = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.request.use((config) => {
        const { token } = useAuthStore()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    })

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                console.log(`Axios interceptor: got 401, logging out`)
                useAuthStore().logout()
                window.location.href = "/login"
            }
            return Promise.reject(new Error(error))
        }
    )

    return axiosInstance
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
