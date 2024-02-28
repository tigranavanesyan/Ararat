import $api from "../http";
import axios, { AxiosResponse } from 'axios';
import { AuthResponse } from "../models/response/AuthResponse";

export default class AuthService {
    static async registration(email: string, name: string, sname: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth/registration', {email, name, sname, password})
    }
    
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth/login', {email, password})
    }

    static async login_lichess(): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth/login_lichess')
    }

    static async logout(): Promise<void> {
        return $api.post('/auth/logout')
    }

    static async editUser(data : {email: string, name?: string, sname?: string, password?: string, born?: Date, country?: string, sex?: string, tname?: string, shedule?: {time: string, days: string[]}[], format?: string, durency?: string, comment?:string}): Promise<AxiosResponse<AuthResponse>> {
        return $api.put<AuthResponse>('/auth/user', data)
    }
    static async setRequizits(type: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth/setrequizits', {type: type})
    }
    static async JitsiJWT(avatar: string, email: string, name: string, id: string, moderator: boolean): Promise<AxiosResponse<string>> {
        const perm = [];
        if(moderator) {
            perm.push("RECORDING");
        }
        const CurrentTime = new Date();
        CurrentTime.setMinutes(CurrentTime.getMinutes() + 120);
        return axios.post<string>('https://ararat-47375650f6ef.herokuapp.com/token-generator/token', 
        {
            avatar: avatar,
            email: email,
            expTimestampSec: Math.round(CurrentTime / 1000),
            id: id,
            moderator: moderator,
            name: name,
            permissions: [
                'RECORDING'
            ],
            roomName: '*'
        })
    }
}