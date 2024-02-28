import { IAttachment } from "./IAttachment";

interface IMessageFrom {
    _id: string;
    name: string;
    sname: string;
    avatar: string;
    hex: string;
    role: string;
}

export interface IMessage {
    _id: string;
    msg: string;
    time: Date;
    to?: string;
    from?: IMessageFrom;
    readed?: boolean;
    type: string;
    audio?: string;
    attachments: IAttachment[];
    reply?: IMessage;
    homework?: string;
    color?: string;
    attemps?: [Date];
}