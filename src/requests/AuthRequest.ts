export interface AuthPayload {
    email: string;
    password: string;
}

export interface AuthResponse {
    msg: string;
    user: {
        name: string;
        lastName: string;
        email: string;
        location: string;
    }
}