export interface UserPayload {
    id: string;
    name: string;
    email: string;
    password: string;
    lastName?: string;
    location?: string;
    role?: string;

    createdAt: Date;
    updatedAt: Date;
}

export interface UserParams {
    id: string;
}