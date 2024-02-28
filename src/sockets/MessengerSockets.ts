import { socket } from "./socket"
import { User } from "../models/User"

export const ChatRoomSocket = (room: string) => {
    socket.emit("chat:joinroom", room)    
}

export const ChatRoomNotificationSocket = (room: string) => {
    socket.emit("chat:joinnotificationroom", room)    
}

export const ChatRoomDisconnectSocket = (room: string) => {
    socket.emit("chat:disconnectroom", room)    
}

export const sendMessageSocket = (msg_id : string) => {
    socket.emit("message:send", {id: msg_id})    
}

export const deleteMessageSocket = (msg_id : string, dialog_id: string) => {
    socket.emit("message:delete", {id: msg_id, dialog_id})    
}

export const CallChatSocket = (user: User, room: string, notification_id: string) => {
    socket.emit("chat:call", {user, room, notification_id})    
}
