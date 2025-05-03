export interface LoginRequest {
    username: string
    password: string
}

export interface LoginResponse {
    access_token: string
    token_type: string
}

export interface RegisterRequest {
    username: string
    login: string
    password: string
}

export interface RegisterResponse {
    access_token: string
    token_type: string
}

export interface GetUserResponse {
    login: string
    id: string
    username: string
    created_at: string
}
