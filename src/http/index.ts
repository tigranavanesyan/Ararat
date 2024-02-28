import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";

export const API_URL = `https://api.araratchess.com/api`
// export const API_URL = `http://localhost:8089/api`


const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`; // eslint-disable-line @typescript-eslint/restrict-template-expressions
    return config;
})

$api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const originalRequest = error.config
    localStorage.setItem('error', error.response.data.error);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if(error.response.status === 401) {
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/auth/refresh`, {withCredentials: true});
            localStorage.setItem('token', response.data.accessToken);
            return $api.request(originalRequest) // eslint-disable-line @typescript-eslint/no-unsafe-argument
        } catch (e) {
            console.log('НЕ АВТОРИЗОВАН !')
        }
    }
});

export default $api;