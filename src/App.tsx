import React, { useEffect, Suspense } from "react"
import RequireAuth from "./components/Auth/RequireAuth"
import RequireRole from "./components/Auth/RequireRole"
import OnlyUnauthorized from "./components/Auth/OnlyUnauthorized"
const IndexPage = React.lazy(() => import('./pages/IndexPage'));
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import MessengerPage from "./pages/Messenger/MessengerPage"
import ChatPage from "./pages/Messenger/ChatPage"
import MyGroups from "./pages/MyGroups/MyGroups"
import Group from "./pages/MyGroups/Group"
import OnlineLesson from "./pages/MyGroups/OnlineLesson"
import Lessons from "./pages/Lessons/Lessons"
import Lesson from "./pages/Lessons/Lesson"
import PermissionsPage from "./pages/PermissionsPage"
import ProgramPage from "./pages/ProgramPage"
import HistoryPage from "./pages/MyGroups/HistoryPage"
import DescriptionPage from "./pages/MyGroups/DescriptionPage"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { checkAuth, userSlice } from "./store/reducers/UserSlice";
import { useAppDispatch, useAppSelector } from "./hooks/redux"
import Layout from "./components/Layouts/Messenger"
import LayoutMain from "./components/Layouts/Main"
import { socket } from './sockets/socket';
import { pushMessage, delMessage, updateChat, incUnreaded } from './store/reducers/MessengerSlice';
import Room from "./pages/Room"
import { ChatRoomNotificationSocket } from "./sockets/MessengerSockets"
import BalancePage from "./pages/BalancePage"
import CabinetPage from "./pages/CabinetPage"

const UserCabinetPage = React.lazy(() => import('./pages/UserCabinetPage'));
const AddHomeworkPage = React.lazy(() => import('./pages/Homework/AddHomeworkPage'));
const HomeworksPage = React.lazy(() => import('./pages/Homework/HomeworksPage'));
const HomeworkPage = React.lazy(() => import('./pages/Homework/HomeworkPage'));
const HomeworksCheckPage = React.lazy(() => import('./pages/MyGroups/HomeworksCheckPage'));
const HomeworkCheckPage = React.lazy(() => import('./pages/MyGroups/HomeworkCheckPage'));
const VideoPage = React.lazy(() => import('./pages/Video/VideoPage'));
const VideoListPage = React.lazy(() => import('./pages/Video/VideoListPage'));
const FAQPage = React.lazy(() => import('./pages/FAQPage'));
const FAQTrainersPage = React.lazy(() => import('./pages/FAQTrainersPage'));
const CreateTestLesson = React.lazy(() => import('./pages/TestLesson/CreateTestLesson'));
const TestLesson = React.lazy(() => import('./pages/TestLesson/TestLesson'));
const GroupwaitingPage = React.lazy(() => import('./pages/GroupwaitingPage'));
const GroupwaitingArchivePage = React.lazy(() => import('./pages/GroupwaitingArchivePage'));


function App() {
    const {isLoading, user} = useAppSelector(state => state.UserSlice);
    const {storeLoad} = userSlice.actions
    const dispatch = useAppDispatch();
    
    useEffect(()=>{
        const CheckLogin = async () => {
            if(localStorage.getItem('token')) {
                await dispatch(checkAuth());
            } else {
                dispatch(storeLoad());
            }
        }
        CheckLogin().catch(console.error);
    }, [dispatch, storeLoad])

    useEffect(()=>{
        if(user._id) {
            ChatRoomNotificationSocket(user._id);
        }
    }, [user])

    useEffect(() => {
        const reciveHandler = async (data: { to: { _id: string; }; }) => {
            dispatch(incUnreaded());
            dispatch(updateChat(data));

            const audio = new Audio('/message.wav');
            if(!user.dialog_types?.find(type => (type.dialog === data.to._id && type.name === 'archive'))) {
                await audio.play();
            }
            
        }

        socket.on("message:recive", (data) => {
            dispatch(pushMessage(data));
        })
        socket.on("notification:recive", reciveHandler);
        socket.on("message:delete_recive", (data) => {
            dispatch(delMessage(data));
        })
        
        return  () => {
            socket.off("notification:recive", reciveHandler);
        }
    }, [socket]) // eslint-disable-line react-hooks/exhaustive-deps
    

    if(!isLoading) {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<RequireAuth><LayoutMain><Suspense><IndexPage/></Suspense></LayoutMain></RequireAuth>}/>
                    <Route path='/mygroups' element={<RequireRole roles={['DIRECTOR', 'ZDIRECTOR', 'TRANER', 'ADMIN']}><LayoutMain><MyGroups/></LayoutMain></RequireRole>}/>
                    <Route path='/group/:groupId' element={<RequireAuth><LayoutMain><Group/></LayoutMain></RequireAuth>}/>
                    <Route path='/group/:groupId/program' element={<RequireRole roles={['DIRECTOR', 'ZDIRECTOR', 'ADMIN', 'TRANER']}><LayoutMain><ProgramPage/></LayoutMain></RequireRole>}/>
                    <Route path='/group/:groupId/online-lesson' element={<RequireAuth><LayoutMain closedmenu={true}><OnlineLesson/></LayoutMain></RequireAuth>}/>
                    <Route path='/group/:groupId/history' element={<RequireRole roles={['DIRECTOR', 'ZDIRECTOR', 'ADMIN', 'TRANER']}><LayoutMain><HistoryPage/></LayoutMain></RequireRole>}/>
                    <Route path='/group/:groupId/description' element={<RequireRole roles={['DIRECTOR', 'ZDIRECTOR', 'ADMIN', 'TRANER']}><LayoutMain><DescriptionPage/></LayoutMain></RequireRole>}/>
                    <Route path='/group/:groupId/homework/add' element={<RequireRole roles={['DIRECTOR', 'ZDIRECTOR', 'TRANER']}><LayoutMain><Suspense><AddHomeworkPage/></Suspense></LayoutMain></RequireRole>}/>
                    <Route path='/group/:groupId/homework/edit/:homeworkId' element={<RequireRole roles={['DIRECTOR', 'ZDIRECTOR', 'TRANER']}><LayoutMain><Suspense><AddHomeworkPage/></Suspense></LayoutMain></RequireRole>}/>
                    <Route path='/group/:groupId/homework' element={<RequireRole roles={['DIRECTOR', 'ZDIRECTOR', 'TRANER']}><LayoutMain><Suspense><HomeworksCheckPage/></Suspense></LayoutMain></RequireRole>}/>
                    <Route path='/group/:groupId/homework/:homeworkId' element={<RequireRole roles={['DIRECTOR', 'ZDIRECTOR', 'TRANER']}><LayoutMain><Suspense><HomeworkCheckPage/></Suspense></LayoutMain></RequireRole>}/>
                    <Route path='/homework' element={<RequireRole roles={['DIRECTOR', 'ZDIRECTOR', 'TRANERMETODIST', 'STUDENT']}><LayoutMain><Suspense><HomeworksPage/></Suspense></LayoutMain></RequireRole>}/>
                    <Route path='/homework/:groupId' element={<RequireRole roles={['DIRECTOR', 'ZDIRECTOR', 'TRANERMETODIST', 'STUDENT']}><LayoutMain closedmenu={true}><Suspense><HomeworkPage/></Suspense></LayoutMain></RequireRole>}/>
                    <Route path='/video' element={<RequireRole roles={['STUDENT', 'DIRECTOR', 'ZDIRECTOR', 'TRANER', 'TRANERMETODIST']}><LayoutMain><Suspense><VideoPage/></Suspense></LayoutMain></RequireRole>}/>
                    <Route path='/video/:groupId' element={<RequireRole roles={['STUDENT', 'DIRECTOR', 'ZDIRECTOR', 'TRANER', 'TRANERMETODIST']}><LayoutMain><Suspense><VideoListPage/></Suspense></LayoutMain></RequireRole>}/>
                    
                    
                    <Route path='/lessons' element={<RequireRole roles={['STUDENT', 'DIRECTOR', 'ZDIRECTOR', 'TRANERMETODIST']}><LayoutMain><Lessons/></LayoutMain></RequireRole>}/>
                    <Route path='/lesson/:groupId' element={<RequireRole roles={['STUDENT', 'DIRECTOR', 'ZDIRECTOR', 'TRANERMETODIST']}><LayoutMain closedmenu={true}><Lesson/></LayoutMain></RequireRole>}/>
                    <Route path='/permissions' element={<RequireRole roles={['DIRECTOR', 'ZDIRECTOR', 'ADMIN']}><LayoutMain><PermissionsPage/></LayoutMain></RequireRole>}/>
                    <Route path='/program' element={<RequireRole roles={['DIRECTOR', 'ZDIRECTOR']}><LayoutMain><ProgramPage/></LayoutMain></RequireRole>}/>
                    <Route path='/login' element={<OnlyUnauthorized><LoginPage/></OnlyUnauthorized>}/>
                    <Route path='/register' element={<OnlyUnauthorized><RegisterPage/></OnlyUnauthorized>}/>
                    <Route path='/messenger' element={<RequireAuth><Layout><MessengerPage/></Layout></RequireAuth>}/>
                    <Route path='/messenger/chat/:userid' element={<RequireAuth><Layout><ChatPage/></Layout></RequireAuth>}/>
                    <Route path="/room/:roomID" element={<Room/>} />
                    <Route path='/balance' element={<RequireRole roles={['DIRECTOR', 'ZDIRECTOR', 'STUDENT']}><LayoutMain><BalancePage/></LayoutMain></RequireRole>}/>
                    <Route path='/profile' element={<RequireAuth><LayoutMain><CabinetPage/></LayoutMain></RequireAuth>}/>
                    <Route path='/profile/:userId' element={<RequireAuth><LayoutMain><Suspense><UserCabinetPage/></Suspense></LayoutMain></RequireAuth>}/>
                    
                    <Route path='/testlesson' element={<RequireRole roles={['DIRECTOR', 'ZDIRECTOR', 'TRANERMETODIST']}><LayoutMain><Suspense><CreateTestLesson/></Suspense></LayoutMain></RequireRole>}/>
                    <Route path='/testlesson/:groupId' element={<LayoutMain closedmenu={true}><Suspense><TestLesson/></Suspense></LayoutMain>}/>
                    
                    <Route path='/faq' element={<RequireRole roles={['DIRECTOR', 'ZDIRECTOR', 'TRANERMETODIST', 'STUDENT']}><LayoutMain><Suspense><FAQPage/></Suspense></LayoutMain></RequireRole>}/>
                    <Route path='/faqtrainers' element={<RequireRole roles={['DIRECTOR', 'ZDIRECTOR', 'TRANER']}><LayoutMain><Suspense><FAQTrainersPage/></Suspense></LayoutMain></RequireRole>}/>
                    <Route path='/groupwaiting' element={<RequireRole roles={['DIRECTOR', 'ZDIRECTOR', 'ADMIN']}><LayoutMain><Suspense><GroupwaitingPage/></Suspense></LayoutMain></RequireRole>}/>
                    <Route path='/groupwaiting/archive' element={<RequireRole roles={['DIRECTOR', 'ZDIRECTOR', 'ADMIN']}><LayoutMain><Suspense><GroupwaitingArchivePage/></Suspense></LayoutMain></RequireRole>}/>
                </Routes>
            </BrowserRouter>
        )
    }
}

export default App
