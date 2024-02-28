import $api from "../http";
import { AxiosResponse } from 'axios';
import { IgetTestLesson } from "../models/response/TestLessonResponses";
import { ITestLessonEdit } from "../models/ITestLesson";

export default class TestLessonService {
    static async getGroup(lessonId: string): Promise<AxiosResponse<IgetTestLesson>> {
        return $api.get<IgetTestLesson>('/testlesson/'+lessonId);
    }
    static async createGroup(): Promise<AxiosResponse<IgetTestLesson>> {
        return $api.post<IgetTestLesson>('/testlesson', {}, {withCredentials: true })
    }
    static async editGroup(lessonId: string, payload?: ITestLessonEdit): Promise<AxiosResponse<IgetTestLesson>> {
        return $api.put<IgetTestLesson>('/testlesson/'+lessonId, payload, {withCredentials: true })
    }
}