import $api from "../http";
import { AxiosResponse } from 'axios';
import { IgetVideo, IgetVideos, IgetVideoCounter } from "../models/response/VideoResponses";
import { IGroup, IGroupEdit } from "../models/response/IGroup";

export default class VideoService {
    static async getVideos(group_id?:string): Promise<AxiosResponse<IgetVideos>> {
        return $api.get<IgetVideos>('/videos', {params: {group_id}})
    }
    static async getVideo(videoId: string): Promise<AxiosResponse<IgetVideo>> {
        return $api.get<IgetVideo>('/video/'+videoId);
    }
    static async uploadVideo(groupId: string, file: File): Promise<AxiosResponse<IgetVideo>> {
        const formData = new FormData();
        formData.append('file', file);
        return $api.post<IgetVideo>('/video/'+groupId, formData, {withCredentials: true, headers: { "Content-Type": "multipart/form-data" }});
    }
    static async getCounters(): Promise<AxiosResponse<IgetVideoCounter>> {
        return $api.get<IgetVideoCounter>('/videocounters');
    }
}