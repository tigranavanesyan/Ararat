import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { User } from "../../models/User"
import { AuthResponse } from "../../models/response/AuthResponse";
import AuthService from "../../services/AuthService";
import { ServerError } from "../../models/response/ServerError";
import { AxiosError } from 'axios';
import { API_URL } from "../../http";
import axios from "axios";
import DialogService from "../../services/DialogService";
import { IeditChatTag } from "../../models/response/MessengerResponses";

export interface UserState {
    user: User;
    isAuth: boolean;
    isLoading: boolean;
}


const initialState: UserState = {
    user: {} as User,
    isAuth: false,
    isLoading: true
}

export const registration = createAsyncThunk<User, {email: string, name: string, sname: string, password: string}>(
    'userSlice/registration',
    async (user, {rejectWithValue}) => {
        try {
            const {email, name, sname, password} = user;
            const response = await AuthService.registration(email, name, sname, password);
            localStorage.setItem('token', response.data.accessToken);
            return response.data.user;
        } catch (error) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
        
    }
)

export const login = createAsyncThunk<User, {email: string, password: string}>(
    'userSlice/login',
    async (user, {rejectWithValue}) => {
        try {
            const {email, password} = user;
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('error', "");
            return response.data.user;
        } catch ( error ) {
            const error__message = localStorage.getItem('error');
            const e = error__message as unknown as ServerError
            return rejectWithValue(e);
        }
    }
)
export const login_lichess = createAsyncThunk<User>(
    'userSlice/login_lichess',
    async (_, {rejectWithValue}) => {
        try {
            const response = await AuthService.login_lichess();
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('error', "");
            return response.data.user;
        } catch ( error ) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
    }
)

export const checkAuth = createAsyncThunk<User>(
    'userSlice/checkAuth',
    async (_, {rejectWithValue}) => {
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/auth/refresh`, {withCredentials: true});
            localStorage.setItem('token', response.data.accessToken);
            return response.data.user;
        } catch (error) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e.error);
        }
    }
)

export const logout = createAsyncThunk<boolean>(
    'userSlice/logout',
    async (_, {rejectWithValue}) => {
        try {
            await AuthService.logout();
            localStorage.removeItem('token');
            return true;
        } catch (error) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e.error);
        }
    }
)

export const editUser = createAsyncThunk<User, {email: string, name?: string, sname?: string, tname?: string, password?: string, born?: Date, country?: string, sex?: string, shedule?: {time: string, days: string[]}[], format?: string, durency?: string, comment?:string}>(
    'userSlice/editUser',
    async (user, {rejectWithValue}) => {
        try {
            const {email, name, sname, tname, password, born, country, sex, shedule, format, durency, comment} = user;
            const response = await AuthService.editUser({email, name, sname, password, born, country, sex, tname, shedule, format, durency, comment});
            return response.data.user;
        } catch (error) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
        
    }
)

export const setRequizits = createAsyncThunk<User, string>(
    'userSlice/setRequizits',
    async (type, {rejectWithValue}) => {
        try {
            const response = await AuthService.setRequizits(type);
            return response.data.user;
        } catch (error) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
        
    }
)

export const editChatTag = createAsyncThunk<IeditChatTag, {dialog_id: string, name: string}>(
    'userSlice/editChatTag',
    async (user, {rejectWithValue}) => {
        try {
            const {dialog_id, name} = user;
            const response = await DialogService.editChatTag(dialog_id, name);
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            const e = err.response?.data as ServerError
            return rejectWithValue(e);
        }
        
    }
)


export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        storeLoad(state) {
            state.isLoading = false;
        },
        authUser(state, action) {
            state.user = {_id: (Date.now() + Math.random()).toString(), name: action.payload.name, sname: action.payload.sname, role: 'STUDENT'}
        },
        editUserNameAuth(state, action) {
            state.user.name = action.payload.name;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registration.fulfilled, (state, { payload }) => {
                state.isAuth = true;
                state.user = payload;
            })
            .addCase(registration.rejected, (_, { payload }) => {
                console.log(payload);
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.isAuth = true;
                state.user = payload;
            })
            .addCase(login.rejected, (_, { payload }) => {
                console.log(payload);
            })
            .addCase(login_lichess.fulfilled, (state, { payload }) => {
                state.isAuth = true;
                state.user = payload;
            })
            .addCase(login_lichess.rejected, (_, { payload }) => {
                console.log(payload);
            })
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuth = true;
                state.isLoading = false;
            })
            .addCase(checkAuth.rejected, (state, { payload }) => {
                state.isLoading = false;
                console.log(payload);
            })
            .addCase(logout.fulfilled, (state) => {
                state.isAuth = false;
                state.user = {} as User;
            })
            .addCase(logout.rejected, (_, { payload }) => {
                console.log(payload);
            })
            .addCase(editChatTag.fulfilled, (state, { payload }) => {
                state.user.dialog_types = payload.dialog_types;
            })
            .addCase(editUser.fulfilled, (state, { payload }) => {
                state.user = payload;
            })
            .addCase(setRequizits.fulfilled, (state, { payload }) => {
                state.user.requizits = payload.requizits;
            })
            
    }
})

export default userSlice.reducer;
export const { authUser, editUserNameAuth } = userSlice.actions;