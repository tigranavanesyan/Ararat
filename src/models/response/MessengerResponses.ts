import { IChat } from "../IChat";
import { User } from "../User";
import { IMessage } from "../IMessage";
import { IDialogType } from "../IDialogType";

export interface IgetDialogs {
    chats: Array<IChat>;
}
export interface IgetChat {
    _id: string;
    user: User;
    messages: Array<IMessage>;
    isGroup: boolean;
    description: string;
    users?: Array<User>;
}
export interface IcreateChat {
    dialog: IChat;
}
export interface IsendMessage {
    message: IMessage;
}
export interface IsearchDialogs {
    dialogs: Array<IChat>;
}
export interface IeditChatTag {
    dialog_types: IDialogType[];
}