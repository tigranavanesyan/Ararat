import { socket } from "./socket"
import { User } from "../models/User"
import { IGroupMessage } from "../models/MyGroups/IGroupMessage"
import { IMaterial } from "../models/Program/IMaterial"

export const GroupRoomSocket = (room: string) => {
    socket.emit("group:joinroom", room)    
}
export const GroupRoomDisconnectSocket = (room: string) => {
    socket.emit("group:disconnectroom", room)    
}
export const GroupSendMessageSocket = (data: {room: string, msg: IGroupMessage} ) => {
    socket.emit("group:send_message", data); 
}
export const GroupChangeMaterialSocket = (data: {room: string, material: IMaterial} ) => {
    socket.emit("group:change_material", data); 
}

export const GroupChangeGameSocket = (data: {room: string, game: any, fen: string} ) => {
    socket.emit("group:change_game", data); 
}
export const GroupMakeMoveSocket = (data: {room: string, user_id: string, color: string, move: string} ) => {
    socket.emit("group:make_move", data); 
}
export const GroupMakeMoveBackSocket = (data: {room: string} ) => {
    socket.emit("group:move_back", data); 
}
export const GroupEntryModeSocket = (data: {room: string, bool: boolean} ) => {
    socket.emit("group:entry_mode", data); 
}
export const GroupGlobalModeSocket = (data: {room: string, user_id: string, bool: boolean} ) => {
    socket.emit("group:global_mode", data); 
}
export const GroupFullCleanSocket = (data: {room: string} ) => {
    socket.emit("group:full_clean", data); 
}
export const GroupUserCleanSocket = (data: {room: string, user_id: string} ) => {
    socket.emit("group:user_clean", data); 
}
export const GroupUserEditSocket = (data: {room: string, user_id: string, name: string} ) => {
    socket.emit("group:user_edit", data); 
}
export const GroupAddGameUserSocket = (data: {room: string, move: {user_id: string, name: string, sname: string, moves: []}} ) => {
    socket.emit("group:add_game_user", data); 
}

export const GroupUpdateSocket = (data: {room: string} ) => {
    socket.emit("group:update", data); 
}

export const GroupDrawArrowSocket = (data: {room: string, info: {frox: string, fromy: string, tox: string, toy: string, color: string}} ) => {
    socket.emit("group:draw_arrow", data); 
}
export const GroupDrawCircleSocket = (data: {room: string, info: {x: string, y: string, color: string}} ) => {
    socket.emit("group:draw_circle", data); 
}
export const GroupClearCanvasSocket = (data: {room: string} ) => {
    socket.emit("group:clear_canvas", data); 
}


export const GroupStepBackSocket = (data: {room: string, user_id: string} ) => {
    socket.emit("group:back", data); 
}
export const GroupStepNextSocket = (data: {room: string, user_id: string, color: string, move: string} ) => {
    socket.emit("group:next", data); 
}

export const GroupEndLessonSocket = (data: {room: string} ) => {
    socket.emit("group:end_lesson", data); 
}
