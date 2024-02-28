import $api from "../http";
import { AxiosResponse } from 'axios';
import { IgetGroups, IgetGroup, IgetLogs, IgetRecs } from "../models/response/GroupResponses";
import { IGroup, IGroupEdit } from "../models/response/IGroup";

export default class GroupService {
    static async getGroups(archive?: boolean, search?: string, videocounter?: boolean): Promise<AxiosResponse<IgetGroups>> {
        const payload = {} as {archive?: boolean, search?: string, videocounter?: boolean}
        if(archive === true) {
            payload.archive = true;
        } else if (archive === false) {
            payload.archive = false;
        }
        if(search) {
            payload.search = search;
        }
        if(videocounter === true) {
            payload.videocounter = true;
        } else if (videocounter === false) {
            payload.videocounter = false;
        }
        return $api.get<IgetGroups>('/groups', {params: payload})
    }
    static async getGroup(groupId: string): Promise<AxiosResponse<IgetGroup>> {
        return $api.get<IgetGroup>('/groups/'+groupId);
    }

    static async createGroup(name: string, traners: Array<string>, level: string, starts: string, dates?: [{days: [number],time: string}]): Promise<AxiosResponse<IgetGroup>> {
        return $api.post<IgetGroup>('/groups', {name: name, traners: traners, level: level, starts: starts, dates: dates}, {withCredentials: true })
    }
    static async editGroup(groupId: string, payload?: IGroupEdit): Promise<AxiosResponse<IgetGroup>> {
        return $api.put<IgetGroup>('/groups/'+groupId, payload, {withCredentials: true })
    }
    static async deleteGroup(groupId: string): Promise<AxiosResponse<IgetGroup>> {
        return $api.delete<IgetGroup>('/groups/'+groupId)
    }
    static async addUserToGroup(email: string, group_id: string): Promise<AxiosResponse<IgetGroup>> {
        return $api.post<IgetGroup>('/groups/addto', {email: email, group_id: group_id}, {withCredentials: true})
    }
    static async getLogs(type: string): Promise<AxiosResponse<IgetLogs>> {
        return $api.get<IgetLogs>('/groupslogs', {params: {type}});
    }
    static async getRecs(id: string): Promise<AxiosResponse<IgetRecs>> {
        return $api.get<IgetRecs>('/groupsrec', {params: {id}});
    }
    
}