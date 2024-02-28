import $api from "../http";
import { AxiosResponse } from 'axios';
import { IgetThemes, IgetTheme, IgetMaterial, IgetMaterials } from "../models/response/ProgramResponses";
import { IGroup } from "../models/response/IGroup";
import { ITheme } from "../models/Program/ITheme";

export default class ProgramService {
    static async getThemes(payload: object): Promise<AxiosResponse<IgetThemes>> {
        return $api.get<IgetThemes>('/program/theme', {params: payload})
    }
    static async createTheme(name: string, filter: string, level: number): Promise<AxiosResponse<IgetTheme>> {
        return $api.post<IgetTheme>('/program/theme', {name: name, filter: filter, level: level}, {withCredentials: true});
    }
    static async getMaterials(theme_id: string): Promise<AxiosResponse<IgetMaterials>> {
        return $api.get<IgetMaterials>('/program/material', {params: {theme_id}})
    }
    static async createMaterial(theme_id: string, pgn: string): Promise<AxiosResponse<IgetMaterial>> {
        return $api.post<IgetMaterial>('/program/material', {theme_id: theme_id, pgn: pgn}, {withCredentials: true});
    }
    static async createCustomMaterial(theme_id: string, fen: string, custom: [{square: string, type: string}], theory?: string): Promise<AxiosResponse<IgetMaterial>> {
        return $api.post<IgetMaterial>('/program/custom_material', {theme_id: theme_id, fen: fen, custom: custom, theory: theory}, {withCredentials: true});
    }
    static async editCustomMaterial(material_id: string, fen: string, custom: [{square: string, type: string}], theory?: string): Promise<AxiosResponse<IgetMaterial>> {
        return $api.put<IgetMaterial>('/program/custom_material/'+material_id, {fen: fen, custom: custom, theory: theory}, {withCredentials: true});
    } 
    static async editTheme(themeId: string, name?: string, seq?: {oldseq: number, seq: number}, filter?: string, level?: number): Promise<AxiosResponse<IgetTheme>> {
        const payload = {} as {name: string, seq: {oldseq: number, seq: number}, filter: string, level: number};
        if(name) {
            payload.name = name;
        }
        if(seq) {
            payload.seq = seq;
        }
        if(filter) {
            payload.filter = filter;
        }
        if(level) {
            payload.level = level;
        }
        return $api.put<IgetTheme>('/program/theme/'+themeId, payload, {withCredentials: true})
    }
    static async deleteTheme(themeId: string): Promise<AxiosResponse<IgetTheme>> {
        return $api.delete<IgetTheme>('/program/theme/'+themeId, {withCredentials: true});
    }
    static async deleteMaterial(materialId: string): Promise<AxiosResponse<IgetMaterial>> {
        return $api.delete<IgetMaterial>('/program/material/'+materialId, {withCredentials: true});
    }
}