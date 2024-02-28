import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { User } from "../../models/User";
import { IChat } from "../../models/IChat";
import { IgetChat, IcreateChat } from "../../models/response/MessengerResponses";
import { IMessage } from "../../models/IMessage";
import GroupService from "../../services/GroupService";
import { AxiosError } from "axios";
import { ServerError } from "../../models/response/ServerError";
import { sendMessageSocket, deleteMessageSocket } from "../../sockets/MessengerSockets";
import { IAttachment } from "../../models/IAttachment";
import { IAttachmentModal } from "../../models/IAttachmentModal";
import { IGroup, IGroupEdit } from "../../models/response/IGroup";
import { IGroupMessage } from "../../models/MyGroups/IGroupMessage";
import { IMove } from "../../models/MyGroups/IMove";
import { IHomework, IHomeworkEdit } from "../../models/IHomwork";
import HomeworkService from "../../services/HomeworkService";

export interface HomeworkState {
    homeworks: IHomework[];
    homework: IHomework;
    game: IMove[];
    gameHistory: string[];
}


const initialState: HomeworkState = {
    homeworks: [],
    homework: {} as IHomework,
    game: [],
    gameHistory: [],
}

export const getHomeworks = createAsyncThunk<IHomework[], {group_id?: string}>(
    'homeworkSlice/getHomeworks',
    async (data, {rejectWithValue}) => {
        try {
            const { group_id } = data;
            const response = await HomeworkService.getHomeworks(group_id);
            return response.data.homeworks;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

export const getHomework = createAsyncThunk<IHomework, string>(
    'homeworkSlice/getHomework',
    async (homeworkId, {rejectWithValue}) => {
        try {
            const response = await HomeworkService.getHomework(homeworkId);
            return response.data.homework;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

export const editHomework = createAsyncThunk<IHomework, {groupId: string, payload: IHomeworkEdit}>(
    'homeworkSlice/editHomework',
    async (data, {rejectWithValue}) => {
        try {
            const {groupId, payload} = data;
            const response = await HomeworkService.editHomework(groupId, payload);
            return response.data.homework;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)



export const homeworkSlice = createSlice({
    name: 'homeworkSlice',
    initialState,
    reducers: {
        setMovesState (state, action) {
            const move = action.payload as {user_id: string, name: string, sname: string, color: string, move: string};
            const indx = state.game.findIndex(user=> user.user_id === move.user_id);
            if(indx !== -1) {
                state.game[indx].moves.push({color: move.color, move: move.move});
            } else {
                state.game.push({id: (Date.now() + Math.random()).toString(), user_id: move.user_id, name: move.name, sname: move.sname, moves: [{color: move.color, move: move.move}]});
            }
        },
        clearUserMoves(state, action) {
            const user_id = action.payload as string;
            const indx = state.game.findIndex(item=> item.user_id === user_id);
            if(state.game[indx].moves.length > 0) {
                if(!state.game[indx].deleted) {
                    state.game[indx].deleted = [];
                }
                state.game[indx].deleted.push(state.game[indx].moves);
                state.game[indx].moves = [];
            }
        },
        clearFullUserMoves(state, action) {
            const user_id = action.payload as string;
            const indx = state.game.findIndex(item=> item.user_id === user_id);
            if(state.game[indx].moves.length > 0) {
                state.game[indx].moves = [];
            }
        },
        setGameState (state, action) {
            const material = action.payload as {materialId: string, user_id: string, name: string, sname: string};
            if(state.homework?.history.length > 0) {
                try {
                    const cond = state.homework.history.find(item=> item.material === material.materialId);
                    if(cond) {
                        const cond2 = cond.moves.find(item=> item.user_id === material.user_id);
                        if(cond2) {
                            state.game = [cond2];
                            state.gameHistory = cond2.movesHistory;
                        }
                        else {
                            state.game = [{id: (Date.now() + Math.random()).toString(), user_id: material.user_id, name: material.name, sname: material.sname, moves: []}];
                        }
                        
                    } else {
                        state.game = [];
                    }
                    
                } catch (error) {
                    state.game = [];
                    console.log(error)
                }
            }
        },
        stepBack (state, action) {
            const move = action.payload as IMove;
            console.log(move);
            const indx = state.game.findIndex(user=> user.user_id === move.user_id);
            if(indx !== -1) {
                state.game[indx].moves.pop();
            }   
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getHomeworks.fulfilled, (state, { payload }) => {
                state.homeworks = payload;
            })
            .addCase(getHomework.fulfilled, (state, { payload }) => {
                state.homework = payload;
            })
            .addCase(editHomework.fulfilled, (state, { payload }) => {
                state.homework.history = payload.history;
            })
    }
})

export default homeworkSlice.reducer;
export const { setMovesState, setGameState, clearUserMoves, clearFullUserMoves, stepBack } = homeworkSlice.actions;