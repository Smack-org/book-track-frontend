export interface LoginRequest {
    login: string
    password: string
}

export interface LoginResponse {
    token: string
    expiresIn: string
    userId: string
}

export interface RegisterRequest {
    login: string
    password: string
}

export interface RegisterResponse {
    token: string
    expiresIn: string
    userId: string
}

export interface GetUserResponse {
    userId: string
    login: string
}
