import $api from "../http";
import { AxiosResponse } from 'axios';
import { IgetHomeworks, IgetHomework } from "../models/response/HomeworkResponses";
import { IGroup, IGroupEdit } from "../models/response/IGroup";
import { IHomeworkEdit } from "../models/IHomwork";

export default class HomeworkService {
    static async getHomeworks(group_id ?: string): Promise<AxiosResponse<IgetHomeworks>> {
        return $api.get<IgetHomeworks>('/homework', {params: {group_id}})
    }
    static async getHomework(homeworkId: string): Promise<AxiosResponse<IgetHomework>> {
        return $api.get<IgetHomework>('/homework/'+homeworkId);
    }

    static async createHomework(group_id: string, end: Date, program: Array<string>, autocheck: boolean): Promise<AxiosResponse<IgetHomework>> {
        return $api.post<IgetHomework>('/homework', {group_id: group_id, end: end, program: program, autocheck: autocheck}, {withCredentials: true })
    }
    static async editHomework(homeworkId: string, payload?: IGroupEdit): Promise<AxiosResponse<IgetHomework>> {
        return $api.put<IgetHomework>('/homework/'+homeworkId, payload, {withCredentials: true })
    }
    static async sendHomework(group_id: string, homework_id: string, results?: [{user_id: string, material: string, result: string}]): Promise<AxiosResponse<IgetHomework>> {
        return $api.post<IgetHomework>('/homework/send/'+group_id, {homework_id: homework_id, results: results}, {withCredentials: true })
    }
    static async toLessonHomework(group_id: string): Promise<AxiosResponse<IgetHomework>> {
        return $api.post<IgetHomework>('/homework/tolesson/'+group_id, {}, {withCredentials: true })
    }
}