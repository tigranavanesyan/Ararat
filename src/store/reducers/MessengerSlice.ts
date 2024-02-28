import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { User } from "../../models/User";
import { IChat } from "../../models/IChat";
import { IgetChat, IcreateChat } from "../../models/response/MessengerResponses";
import { IMessage } from "../../models/IMessage";
import DialogService from "../../services/DialogService";
import { AxiosError } from "axios";
import { ServerError } from "../../models/response/ServerError";
import { sendMessageSocket, deleteMessageSocket } from "../../sockets/MessengerSockets";
import { IAttachment } from "../../models/IAttachment";
import { IAttachmentModal } from "../../models/IAttachmentModal";

export interface MessengerState {
    chats: IChat[];
    chatsContainer: IChat[];
    archived: IChat[];
    archiveContainer: IChat[];
    chat: {
        _id: string,
        user: User,
        messages: IMessage[]
        isGroup: boolean;
        anonim?: boolean;
        description: string;
        users?: Array<User>
        group_id?: string;
        isTech?: boolean;
        isChanel: boolean;
        since?: [{user_id: string; date: Date}]
    }
    attachmentModal: boolean;
    attachment: IAttachment;
    isChatsLoading: boolean;
    isChatLoading: boolean;
    isSendMessageLoading: boolean;
    blinkMessage: string;
    reply: string | null;
    editMsg: string | null;
    unreaded: number;
}


const initialState: MessengerState = {
    archiveContainer: [],
    chatsContainer: [],
    chats: [],
    archived: [],
    chat: {
        user: {} as User,
        messages: [],
        isGroup: false,
        description: '',
        users: [],
        since: [{}] as [{user_id: string; date: Date}]
    },
    attachmentModal: false,
    attachment: {} as IAttachment,
    isChatsLoading: true,
    isChatLoading: true,
    isSendMessageLoading: true,
    reply: null,
    editMsg: null,
    blinkMessage: '',
    unreaded: 0,
}


export const getUnreaded = createAsyncThunk<string>(
    'messengerSlice/getUnreaded',
    async (_, {rejectWithValue}) => {
        try {
            const response = await DialogService.getUnreaded();
            return response.data.unreaded;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

export const getDialogs = createAsyncThunk<IChat[], string>(
    'messengerSlice/getDialogs',
    async (id, {rejectWithValue}) => {
        try {
            const response = await DialogService.getDialogs(id);
            return response.data.chats;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

export const getDialogsArchived = createAsyncThunk<IChat[]>(
    'messengerSlice/getDialogsArchived',
    async (_, {rejectWithValue}) => {
        try {
            const response = await DialogService.getDialogsArchived();
            return response.data.chats;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

export const getChat = createAsyncThunk<IgetChat, string>(
    'messengerSlice/getChat',
    async (id, {rejectWithValue}) => {
        try {
            const response = await DialogService.getChat(id);
            return response.data;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

export const createChat = createAsyncThunk<IcreateChat, {name: string, description: string, anonim: boolean}>(
    'messengerSlice/createChat',
    async (data, {rejectWithValue}) => {
        try {
            const {name, description, anonim} = data;
            const response = await DialogService.createChat(name, description, anonim);
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
        
    }
)

export const editChat = createAsyncThunk<IcreateChat, {dialog_id: string, archive?: boolean}>(
    'messengerSlice/editChat',
    async (data, {rejectWithValue}) => {
        try {
            const {dialog_id, archive} = data;
            const response = await DialogService.editChat(undefined, undefined, dialog_id, undefined, archive);
            return response.data;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

export const deleteChat = createAsyncThunk<IgetChat, {chatId: string}>(
    'messengerSlice/deleteChat',
    async (data, {rejectWithValue}) => {
        try {
            const {chatId} = data;
            const response = await DialogService.deleteChat(chatId);
            return response.data;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

export const sendMessage = createAsyncThunk<IMessage, {msg: string, userid: string, audio: Blob | undefined, fileList: File[], reply: string | null}>(
    'messengerSlice/sendMessage',
    async (data, {rejectWithValue}) => {
        try {
            const {msg, userid, audio, fileList, reply} = data;
            const response = await DialogService.sendMessage(msg, userid, audio, fileList, reply);
            return response.data.message;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

export const addUserToChat = createAsyncThunk<IChat, {email: string, dialog_id: string}>(
    'messengerSlice/addUserToChat',
    async (data, {rejectWithValue}) => {
        try {
            const { email, dialog_id } = data;
            const response = await DialogService.addUserToChat(email, dialog_id);
            console.log("----------- response of axios -------", response)
            return response.data.dialog;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

export const editMessage = createAsyncThunk<IMessage, {msg_id: string, msg: string, fileList: File[]}>(
    'messengerSlice/editMessage',
    async (data, {rejectWithValue}) => {
        try {
            const {msg_id, msg, fileList} = data;
            const response = await DialogService.editMessage(msg_id, msg, fileList);
            return response.data.message;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

export const deleteMessage = createAsyncThunk<IMessage, {msg_id: string, dialog_id: string}>(
    'messengerSlice/deleteMessage',
    async (data, {rejectWithValue}) => {
        try {
            const {msg_id, dialog_id} = data;
            const response = await DialogService.deleteMessage(msg_id, dialog_id);
            return response.data.message;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

// export const searchDialogs = createAsyncThunk<IChat[], string>(
//     'messengerSlice/searchDialogs',
//     async (value, {rejectWithValue}) => {
//         try {
//             const response = await DialogService.searchDialogs(value);
//             return response.data.dialogs;
//         } catch ( error ) {
//             const err = error as AxiosError;
//             const e = err.response?.data as ServerError
//             return rejectWithValue(e);
//         }
//     }
// )

export const messengerSlice = createSlice({
    name: 'messengerSlice',
    initialState,
    reducers: {
        searchDialogs(state, action) {
            const s = action.payload as string;
            const regex = new RegExp(`${s.toLowerCase()}.*`);
            state.chats = state.chatsContainer.filter(chat => chat.name.toLowerCase().match(regex));
            state.archived = state.archiveContainer.filter(chat => chat.name.toLowerCase().match(regex));
        },
        updateChat (state, action) {
            const msg = action.payload as IMessage;
            const dialog = state.chats.filter(chat=> chat._id === msg.to._id);
            
            dialog[0].lastmsg = msg;
            dialog[0].unreaded ++;
        },
        incUnreaded (state) {
            state.unreaded ++;
        },
        pushMessage (state, action) {
            const msg = action.payload as IMessage;
            state.chat.messages.push(msg);
            const indx = state.chats.findIndex(item=> item._id === msg.to._id);
            if(indx !== -1) {
                state.chats[indx].unreaded = -1;
            }
        },
        delMessage (state, action) {
            const id = action.payload as string;
            state.chat.messages = state.chat.messages.filter(msg => msg._id !== id);
        },
        setAttachmentModal (state, action) {
            const data = action.payload as IAttachmentModal;
            if(data.attachment) {
                state.attachment = data.attachment;
            } else {
                state.attachment = {} as IAttachment;
            }
            state.attachmentModal = data.modal;
        },
        setBlinkMessage (state, { payload }) {
            state.blinkMessage = payload as string;
        },
        setReplyMessage (state, { payload }) {
            state.reply = payload as string | null;
            if(state.editMsg) {
                state.editMsg = null;
            }
        },
        setEditMessage (state, { payload }) {
            state.editMsg = payload as string | null;
            if(state.reply) {
                state.reply = null;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUnreaded.fulfilled, (state, { payload }) => {
                state.unreaded = +payload;
            })
            .addCase(getDialogs.pending, (state) => {
                state.isChatsLoading = true;
            })
            .addCase(getDialogs.fulfilled, (state, { payload }) => {
                state.isChatsLoading = false;
                state.chats = payload;
                state.chatsContainer = payload;
            })
            .addCase(getDialogsArchived.fulfilled, (state, { payload }) => {
                state.archived = payload;
                state.archiveContainer = payload;
            })
            .addCase(getDialogs.rejected, (state) => {
                state.isChatLoading = false;
            })
            .addCase(addUserToChat.rejected, (_, acrion) => {
                console.log(acrion);
            })
            .addCase(getChat.pending, (state) => {
                state.isChatsLoading = true;
            })
            .addCase(getChat.fulfilled, (state, { payload }) => {
                state.isChatLoading = false;
                state.chat = payload;
                const indx = state.chats.findIndex(item=> item._id === payload._id);
                if(indx !== -1) {
                    state.chats[indx].unreaded = 0;
                }
            })
            .addCase(getChat.rejected, (state) => {
                state.isChatLoading = false;
            })


            .addCase(createChat.pending, (state) => {
                state.isChatsLoading = true;
            })
            .addCase(createChat.fulfilled, (state, { payload }) => {
                state.isChatLoading = false;
                state.chats.push(payload.dialog)
                //state.chat = payload;
            })
            .addCase(editChat.fulfilled, (state, { payload }) => {
                if(payload.dialog.archive) {
                    const newChats = state.chats.filter(chat=> chat._id !== payload.dialog._id);
                    state.chats = newChats;
                    state.archived.push(payload.dialog);
                } else {
                    const newChats = state.archived.filter(chat=> chat._id !== payload.dialog._id);
                    state.archived = newChats;
                    state.chats.push(payload.dialog);
                }
                //
                //state.chat = payload;
            })
            .addCase(createChat.rejected, (state) => {
                state.isChatLoading = false;
            })

            .addCase(addUserToChat.fulfilled, (state, { payload }) => {
                state.chat.users = payload.users;
            })
            
            .addCase(sendMessage.pending, (state) => {
                state.isSendMessageLoading = true;
            })
            .addCase(sendMessage.fulfilled, (state, { payload }) => {
                state.isSendMessageLoading = false;
                state.chat.messages.push(payload);
                const dialog = state.chats.findIndex(chat=> chat._id === payload.to);
                if(dialog !== -1) {
                    state.chats[dialog].lastmsg = payload;
                }
                if(state.chats[0]?._id === '64e260054ae1183395474c7b') {
                    state.chats.unshift(...state.chats.splice(dialog,1));
                    state.chats.unshift(...state.chats.splice(1,1));
                } else {
                    state.chats.unshift(...state.chats.splice(dialog,1));
                }
                
                sendMessageSocket(payload._id);
            })
            .addCase(sendMessage.rejected, (state) => {
                state.isSendMessageLoading = false;
            })
            .addCase(editMessage.pending, (state) => {
                state.isSendMessageLoading = true;
            })
            .addCase(editMessage.fulfilled, (state, { payload }) => {
                const msgIndex = state.chat.messages.findIndex((msg => msg._id == payload._id));
                state.chat.messages[msgIndex] = payload;
                state.isSendMessageLoading = false;
            })
            .addCase(editMessage.rejected, (state) => {
                state.isSendMessageLoading = false;
            })
            .addCase(deleteMessage.pending, (state) => {
                state.isSendMessageLoading = true;
            })
            .addCase(deleteMessage.fulfilled, (state, { payload }) => {
               //const msgIndex = state.chat.messages.findIndex((msg => msg._id == payload._id));
               //state.chat.messages[msgIndex] = payload;
                state.chat.messages = state.chat.messages.filter(msg => msg._id !== payload._id);
                state.isSendMessageLoading = false;
                if(payload.to) {
                    deleteMessageSocket(payload._id, payload.to)
                }
            })
            .addCase(deleteMessage.rejected, (state) => {
                state.isSendMessageLoading = false;
            })
            // .addCase(searchDialogs.pending, (state) => {
            //     state.isChatsLoading = true;
            // })
            // .addCase(searchDialogs.fulfilled, (state, { payload }) => {
            //     state.isChatsLoading = false;
            //     state.chats = payload;
            // })
            // .addCase(searchDialogs.rejected, (state) => {
            //     state.isChatLoading = false;
            // })
            .addCase(deleteChat.fulfilled, (state, { payload }) => {
                const newChats = state.chats.filter(chat=> chat._id !== payload._id);
                state.chats = newChats;

                const newArchives = state.archived.filter(chat=> chat._id !== payload._id);
                state.archived = newArchives;
            })
            
    }
})

export default messengerSlice.reducer;
export const { incUnreaded, searchDialogs, pushMessage, delMessage, setAttachmentModal, setBlinkMessage, setReplyMessage, setEditMessage, updateChat } = messengerSlice.actions;