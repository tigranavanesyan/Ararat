import { IDialogType } from "./IDialogType";

export interface User {
    _id: string;
    email: string;
    name: string;
    sname: string;
    tname: string;
    avatar?: string;
    role?: string;
    online?: boolean;
    lastOnline: Date;
    dialog_types?: IDialogType[];
    lichess?: string;
    requizits?: number;
    born?: Date;
    country?: string;
    sex?: string;
    archive?: boolean;
    seance?: boolean;
    offline?: boolean;
    groups?: [{_id: string, name: string}]
    shedule?: {time: string, date: string[]}[]
    format?: string,
    durency?: string,
    comment?:string
}