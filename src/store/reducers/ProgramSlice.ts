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
import { IGroup } from "../../models/response/IGroup";
import { ITheme } from "../../models/Program/ITheme";
import { IMaterial } from "../../models/Program/IMaterial";
import ProgramService from "../../services/ProgramService";

export interface ProgramState {
    themes: ITheme[];
    theme: string;
    materials: IMaterial[];
    group: IGroup;
}


const initialState: ProgramState = {
    themes: [] as ITheme[],
    theme: '',
    materials: [] as IMaterial[],
    group: {} as IGroup,
}

export const getThemes = createAsyncThunk<ITheme[], {filter?: string, level?: number | null}>(
    'programSlice/getThemes',
    async (data, {rejectWithValue}) => {
        try {
            const response = await ProgramService.getThemes(data);
            return response.data.themes;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

export const createTheme = createAsyncThunk<ITheme, {name: string, filter: string, level: number}>(
    'programSlice/createTheme',
    async (data, {rejectWithValue}) => {
        try {
            const {name, filter, level} = data;
            const response = await ProgramService.createTheme(name, filter, level);
            return response.data.theme;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

export const editTheme = createAsyncThunk<ITheme, {themeId: string, name?: string, seq?: {oldseq: number, seq: number}, filter?: string, level?: number}>(
    'programSlice/editTheme',
    async (data, {rejectWithValue}) => {
        try {
            const {themeId, name, seq, filter, level} = data;
            const response = await ProgramService.editTheme(themeId, name, seq, filter, level);
            return response.data.theme;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

export const deleteTheme = createAsyncThunk<ITheme, {themeId: string}>(
    'programSlice/deleteTheme',
    async (data, {rejectWithValue}) => {
        try {
            const {themeId} = data;
            const response = await ProgramService.deleteTheme(themeId);
            return response.data.theme;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

export const deleteMaterial = createAsyncThunk<IMaterial[], {materialId: string}>(
    'programSlice/deleteMaterial',
    async (data, {rejectWithValue}) => {
        try {
            const {materialId} = data;
            const response = await ProgramService.deleteMaterial(materialId);
            return response.data.material;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

export const getMaterials = createAsyncThunk<IMaterial[], string>(
    'programSlice/getMaterials',
    async (theme_id, {rejectWithValue}) => {
        try {
            const response = await ProgramService.getMaterials(theme_id);
            return response.data.materials;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)


export const createMaterial = createAsyncThunk<IMaterial[], {theme_id: string, pgn: string}>(
    'programSlice/createMaterial',
    async (data, {rejectWithValue}) => {
        try {
            const {theme_id, pgn} = data;
            const response = await ProgramService.createMaterial(theme_id, pgn);
            return response.data.material;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

export const createCustomMaterial = createAsyncThunk<IMaterial[], {theme_id: string, fen: string, custom: [{square: string, type: string}], theory?: string}>(
    'programSlice/createCustomMaterial',
    async (data, {rejectWithValue}) => {
        try {
            const {theme_id, fen, custom, theory} = data;
            const response = await ProgramService.createCustomMaterial(theme_id, fen, custom, theory);
            return response.data.material;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

export const editCustomMaterial = createAsyncThunk<IMaterial[], {material_id: string, fen: string, custom: [{square: string, type: string}], theory?: string}>(
    'programSlice/editCustomMaterial',
    async (data, {rejectWithValue}) => {
        try {
            const {material_id, fen, custom, theory} = data;
            const response = await ProgramService.editCustomMaterial(material_id, fen, custom, theory);
            return response.data.material;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)


export const programSlice = createSlice({
    name: 'programSlice',
    initialState,
    reducers: {
        setTheme(state, { payload }) {
            state.theme = payload as string;
        },
        setThemes(state, { payload }) {
            state.themes = payload;
        },
        setSeq(state, action) {
            const payload = action.payload as {oldseq: number, seq: number};
            
            const index = state.themes.findIndex(theme=> theme.seq === payload.oldseq);
            
            if(payload.oldseq > payload.seq) {
                state.themes.map(theme=>{
                    if(theme.seq >= payload.seq && theme.seq <= payload.oldseq) {
                        theme.seq ++;
                    }
                })
            } else {
                state.themes.map(theme=>{
                    if(theme.seq <= payload.seq && theme.seq >= payload.oldseq) {
                        theme.seq --;
                    }
                })
            }
            state.themes[index].seq = payload.seq;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getThemes.fulfilled, (state, { payload }) => {
                state.themes = payload;
            })
            .addCase(createTheme.fulfilled, (state, { payload }) => {
                state.themes.push(payload);
            })
            .addCase(getMaterials.fulfilled, (state, { payload }) => {
                state.materials = payload;
            })
            .addCase(createMaterial.fulfilled, (state, { payload }) => {
                payload.map(item=>{
                    state.materials.push(item);
                })
            })
            .addCase(editCustomMaterial.fulfilled, (state, { payload }) => {
                const indx = state.materials.findIndex(item=> item._id === payload[0]._id);
                if(indx !== -1) {
                    state.materials[indx] = payload[0];
                }
            })
            .addCase(deleteMaterial.fulfilled, (state, { payload }) => {
                state.materials = state.materials.filter(item=> item._id !== payload[0]._id);
            })
            .addCase(createCustomMaterial.fulfilled, (state, { payload }) => {
                payload.map(item=>{
                    state.materials.push(item);
                })
            })
            .addCase(editTheme.fulfilled, (state, { payload }) => {
                const indx = state.themes.findIndex(theme=> theme._id ===  payload._id);
                state.themes[indx] = payload;
            })
            .addCase(deleteTheme.fulfilled, (state, { payload }) => {
                const newThemes = state.themes.filter(theme=> theme._id !== payload._id);
                state.themes = newThemes;
            })
            
    }
})

export default programSlice.reducer;
export const { setTheme, setThemes, setSeq } = programSlice.actions;