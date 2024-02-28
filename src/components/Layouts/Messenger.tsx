import { FC, PropsWithChildren, useEffect, useState } from 'react'
import Sidebar from '../Messenger/Sidebar/Sidebar';
import {useAppSelector, useAppDispatch } from '../../hooks/redux';
import { getDialogs, getDialogsArchived } from '../../store/reducers/MessengerSlice';
import { socket } from '../../sockets/socket';
import ChatCall from '../Messenger/Chats/Call/ChatCall';
import Calling from '../Messenger/Chats/Call/Calling';
import MenuMobile from '../Index/Sidebar/MenuMobile';

const Layout: FC<PropsWithChildren> = ({children}) => {
    const dispatch = useAppDispatch();
    const {user} = useAppSelector(state => state.UserSlice);
    const [callingState, setCallingState] = useState<boolean>(false);
    const [callState, setCallState] = useState<boolean>(false);
    const [callData, setCallData] = useState<{room_id: string, name: string, sname: string, email: string}>({
        room_id: '',
        name: '',
        sname: '',
        email: '',
    });
    useEffect(() => {
        const getChats = async () => {
            await dispatch(getDialogs(user._id));
            if(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') {
                await dispatch(getDialogsArchived());
            }
        };
        void getChats();
    }, [dispatch, user._id]);
    
    useEffect(() => {
        socket.on("chat:call_recive", async (data)=>{
            const audio = new Audio('/rington.mp3');
            await audio.play();
            setCallingState(true);
            void setCallData({room_id: data.room, name: data.name, sname:data.sname, email:data.email});
        })
    }, [socket]) // eslint-disable-line react-hooks/exhaustive-deps
    
    return (
        <main className='realtive xl:flex h-screen'>
            <Sidebar/>
            {children}
            <div className='absolute xl:hidden bottom-0 w-full bg-gradient-silver'>
                <MenuMobile/>
            </div>
            <Calling active={callingState} setActive={setCallingState} user={callData} setCallActive={setCallState}/>
            <ChatCall active={callState} setActive={setCallState} roomid={callData.room_id} email={callData.email} username={callData.name}/>
        </main>
    )
}

export default Layout;