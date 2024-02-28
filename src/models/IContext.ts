export interface IContext {
    active: boolean;
    x: number;
    y: number;
    message_id: string;
    message_text: string;
    isMe: boolean;
}

export interface IContextChat {
    active: boolean;
    x: number;
    y: number;
    chat_id: string;
    tags: Array<string>;
    type?: string;
}