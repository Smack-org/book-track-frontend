import axios, { type AxiosResponse } from "axios"
import { createAuthApiInstance } from "../axios"
import type { GetUserResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./types/auth"
import type { User } from "../../types/user"
import qs from "qs"

const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL
const api = createAuthApiInstance(AUTH_SERVICE_URL)

export const AuthAPI = {
    async login(username: string, password: string): Promise<LoginResponse> {
        const params: LoginRequest = {
            username,
            password,
        }

        const paramsStr = qs.stringify(params)

        const config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }

        try {
            const { data } = await api.post<LoginResponse>(`/users/token`, paramsStr, config)
            return data
        } catch (e) {
            throw handleAxiosError(e)
        }
    },

    async register(username: string, login: string, password: string): Promise<RegisterResponse> {
        const payload: RegisterRequest = {
            username,
            login,
            password,
        }

        try {
            const { data } = await api.post<RegisterResponse, AxiosResponse<RegisterResponse>, RegisterRequest>(`/users/new`, payload)
            return data
        } catch (e) {
            throw handleAxiosError(e)
        }
    },

    async getUser(): Promise<User> {
        try {
            const { data } = await api.get<GetUserResponse>(`${AUTH_SERVICE_URL}/users/me`)

            return {
                login: data.login,
                uid: data.id,
                username: data.username,
                created_at: data.created_at,
            }
        } catch (error) {
            throw handleAxiosError(error)
        }
    },
}
export class AuthenticationError extends Error {
    constructor(
        public errorCode: string,
        message: string
    ) {
        super(message)
        this.name = this.constructor.name
        this.message = message
    }
}

const handleAxiosError = (e: unknown): Error | AuthenticationError => {
    if (axios.isAxiosError(e) && e.response) {
        return new AuthenticationError(`${e.response.status}`, e.response.data.error.message)
    } else if (e instanceof Error) {
        return e
    } else {
        return new Error(String(e))
    }
}
