import { http, HttpResponse } from "msw"
import type { GetUserResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../../api/auth/types/auth"

const AUTH_URL = import.meta.env.VITE_AUTH_SERVICE_URL

export default function () {
    return [
        http.post<RegisterRequest, RegisterResponse>(AUTH_URL + "/auth/register", () => {
            const resonse: RegisterResponse = {
                access_token: "123",
                token_type: "bearer",
            }

            return HttpResponse.json(resonse)
        }),
        http.post<LoginRequest, LoginResponse>(AUTH_URL + "/auth/login", () => {
            const resonse: LoginResponse = {
                access_token: "123",
                token_type: "bearer",
            }

            return HttpResponse.json(resonse)
        }),
        http.get<GetUserResponse>(AUTH_URL + "/me", () => {
            const resonse: GetUserResponse = {
                login: "some_login",
                id: "123",
                username: "some_username",
                created_at: new Date().toISOString(),
            }

            return HttpResponse.json(resonse)
        }),
    ]
}
