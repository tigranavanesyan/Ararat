import $api from "../http";
import { AxiosResponse } from 'axios';
import { IgetDialogs, IgetChat, IcreateChat, IsendMessage, IsearchDialogs, IeditChatTag } from "../models/response/MessengerResponses";

export default class DialogService {
    static async getUnreaded(): Promise<AxiosResponse<{unreaded: string}>> {
        return $api.get<{unreaded: string}>('/dialog/getUnreaded')
    }
    static async getDialogs(id: string): Promise<AxiosResponse<IgetDialogs>> {
        return $api.get<IgetDialogs>('/dialog/getDialogs', {params: {id}})
    }
    static async getDialogsArchived(): Promise<AxiosResponse<IgetDialogs>> {
        return $api.get<IgetDialogs>('/dialog/getDialogsArchived')
    }
    static async getChat(id: string): Promise<AxiosResponse<IgetChat>> {
        return $api.get<IgetChat>('/dialog/chat', {params: {id}})
    }
    static async createChat(name: string, description: string, anonim: boolean): Promise<AxiosResponse<IcreateChat>> {
        return $api.post<IcreateChat>('/dialog/chat', {name: name, description:description, anonim: anonim}, {withCredentials: true, headers: { "Content-Type": "multipart/form-data" }})
    }
    static async deleteChat(chatId: string): Promise<AxiosResponse<IgetChat>> {
        return $api.delete<IgetChat>('/dialog/chat/'+chatId, {withCredentials: true});
    }
    static async editChat(name?: string, description?: string , dialog_id: string, avatar?: File | undefined, archive?: boolean): Promise<AxiosResponse<IcreateChat>> {
        const formData = new FormData();
        if(name) {
            formData.append('name', name);
        }
        if(description) {
            formData.append('description', description);
        }
        formData.append('dialog_id', dialog_id);
        if(avatar) {
            formData.append('avatar', avatar);
        }
        if(archive === true) {
            formData.append('archive', 'true');
        } else if (archive === false) {
            formData.append('archive', 'false');
        }
        return $api.put<IcreateChat>('/dialog/chat', formData, {withCredentials: true, headers: { "Content-Type": "multipart/form-data" }})
    }
    static async addUserToChat(email: string, dialog_id: string): Promise<AxiosResponse<IcreateChat>> {
        return $api.post<IcreateChat>('/dialog/addto', {email: email, dialog_id: dialog_id}, {withCredentials: true, headers: { "Content-Type": "multipart/form-data" }})
    }
    static async removeUserFromChat(_id: string, dialog_id: string): Promise<AxiosResponse<IcreateChat>> {
        return $api.post<IcreateChat>('/dialog/removefrom', {_id: _id, dialog_id: dialog_id}, {withCredentials: true, headers: { "Content-Type": "multipart/form-data" }})
    }
    static async sendMessage(msg: string, to: string, audio: Blob | undefined, fileList: File[], reply: string | null): Promise<AxiosResponse<IsendMessage>> {
        const formData = new FormData();
        formData.append('msg', msg);
        formData.append('to', to);
        if(audio) {
            formData.append('audio', audio, 'audio.webm');
        } else {
            fileList.map(file=>{
                formData.append('file', file);
            })
            if(reply) {
                formData.append('reply', reply);
            }
        }
        return $api.post<IsendMessage>('/dialog/sendMessage', formData, {withCredentials: true, headers: { "Content-Type": "multipart/form-data" }})
    }
    static async editMessage(msg_id: string, msg: string, fileList: File[]): Promise<AxiosResponse<IsendMessage>> {
        const formData = new FormData();
        formData.append('msg_id', msg_id);
        formData.append('msg', msg);
        fileList.map(file=>{
            formData.append('file', file);
        })
        return $api.put<IsendMessage>('/dialog/sendMessage', formData, {withCredentials: true, headers: { "Content-Type": "multipart/form-data" }})
    }
    static async deleteMessage(msg_id: string, dialog_id: string): Promise<AxiosResponse<IsendMessage>> {
        return $api.delete<IsendMessage>('/dialog/sendMessage', {params: {dialog_id, msg_id}})
    }
    static async searchDialogs(value: string): Promise<AxiosResponse<IsearchDialogs>> {
        return $api.get<IsearchDialogs>('/dialog/searchDialogs', {params: {value}})
    }
    static async editChatTag(dialog_id: string, name: string): Promise<AxiosResponse<IeditChatTag>> {
        return $api.post<IeditChatTag>('/dialog/chatCategory', {dialog_id: dialog_id, name: name}, {withCredentials: true, headers: { "Content-Type": "multipart/form-data" }})
    }
}