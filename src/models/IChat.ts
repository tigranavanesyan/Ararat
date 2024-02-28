import { IMessage } from "./IMessage";

export interface IChat {
    _id: string;
    name: string;
    sname: string;
    avatar: string;
    unreaded: number;
    lastmsg: IMessage;
    isOnline: boolean;
    isTech: boolean;
    group_id?: string;
    archive?: boolean;
}