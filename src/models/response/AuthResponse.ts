import { User } from "../User";
import { Error } from "../Error";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
    error: Error;
    errors: [];
}