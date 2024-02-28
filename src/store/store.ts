import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserSlice from "./reducers/UserSlice";
import MessengerSlice from "./reducers/MessengerSlice";
import GroupSlice from "./reducers/GroupSlice";
import ProgramSlice from "./reducers/ProgramSlice";
import HomeworkSlice from "./reducers/HomeworkSlice";
import FaqSlice from "./reducers/FAQSlice";

const rootReducer = combineReducers({
    UserSlice,
    MessengerSlice,
    GroupSlice,
    ProgramSlice,
    HomeworkSlice,
    FaqSlice
})

export const store = () => {
    return configureStore({
        reducer: rootReducer
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof store>
export type AppDispatch = AppStore['dispatch']