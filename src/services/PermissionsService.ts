import $api from "../http";
import { AxiosResponse } from 'axios';
import { IgetUsers, IgetUsersCounter } from "../models/response/PermissionsResponses";
import { User } from "../models/User";

export default class PermissionsService {
    static async getUsers(role?: string, search?: string, archive?: boolean, sort?: string, withoutgroups?: boolean): Promise<AxiosResponse<IgetUsers>> {
        const payload = {} as {role ?: string, search?: string, archive?: boolean, sort?: string, withoutgroups?: boolean}
        if(role) {
            payload.role = role;
        }
        if(search) {
            payload.search = search;
        }
        if(sort) {
            payload.sort = sort;
        }
        if(archive === true) {
            payload.archive = true;
        } else if (archive === false) {
            payload.archive = false;
        }
        if(withoutgroups === true) {
            payload.withoutgroups = true;
        } else if (withoutgroups === false) {
            payload.withoutgroups = false;
        }
        
        return $api.get<IgetUsers>('/users', {params: payload})
    }
    static async getUser(userid: string): Promise<AxiosResponse<User>> {
        return $api.get<User>('/users/'+userid);
    }
    static async setRole(_id: string, role?: string, name?: string, sname?: string, requizits?: number, archive?: boolean, seance?: boolean, online?: boolean, offline?: boolean, allgroups?: boolean, tname?: string): Promise<AxiosResponse<IgetUsers>> {
        const payload = {} as {role: string, name?: string, sname?: string, requizits?: number, archive: boolean, seance: boolean, online: boolean, offline: boolean, allgroups: boolean, tname?: string}
        if(role) {
            payload.role = role;
        }
        if(name) {
            payload.name = name;
        }
        if(sname) {
            payload.sname = sname;
        }
        if(tname) {
            payload.tname = tname;
        }
        if(requizits) {
            payload.requizits = requizits;
        }
        if(archive === true) {
            payload.archive = true;
        } else if (archive === false) {
            payload.archive = false;
        }
        if(seance === true) {
            payload.seance = true;
        } else if (seance === false) {
            payload.seance = false;
        }
        if(online === true) {
            payload.online = true;
        } else if (online === false) {
            payload.online = false;
        }
        if(offline === true) {
            payload.offline = true;
        } else if (offline === false) {
            payload.offline = false;
        }
        if(allgroups === true) {
            payload.allgroups = true;
        } else if (allgroups === false) {
            payload.allgroups = false;
        }
        return $api.post<IgetUsers>('/role', {_id: _id, ...payload}, {withCredentials: true })
    }
    static async getCounter(): Promise<AxiosResponse<IgetUsersCounter>> {
        return $api.get<IgetUsersCounter>('/userscounter');
    }
}