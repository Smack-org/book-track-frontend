import { http, HttpResponse } from "msw"
import type { GetUserResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../../api/auth/types/auth"

const AUTH_URL = import.meta.env.VITE_AUTH_SERVICE_URL

export default function () {
    return [
        http.post<RegisterRequest, RegisterResponse>(AUTH_URL + "/auth/register", () => {
            const resonse: RegisterResponse = {
                token: "123",
                userId: "1",
                expiresIn: "22",
            }

            return HttpResponse.json(resonse)
        }),
        http.post<LoginRequest, LoginResponse>(AUTH_URL + "/auth/login", () => {
            const resonse: LoginResponse = {
                token: "123",
                userId: "1",
                expiresIn: "22",
            }

            return HttpResponse.json(resonse)
        }),
        http.get<GetUserResponse>(AUTH_URL + "/me", () => {
            const resonse: GetUserResponse = {
                userId: "1",
                login: "some_login",
            }

            return HttpResponse.json(resonse)
        }),
    ]
}
