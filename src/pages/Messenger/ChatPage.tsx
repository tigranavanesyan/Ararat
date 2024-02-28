import React, { FC, useEffect, Suspense } from 'react'
import Chats from '../../components/Messenger/Chats/Chats';
const Chat =  React.lazy(() => import('../../components/Messenger/Chat/Chat')) ;
import { useAppDispatch } from '../../hooks/redux';
import { getChat } from '../../store/reducers/MessengerSlice';
import { useParams } from "react-router-dom";
import { socket } from '../../sockets/socket';
import { ChatRoomSocket, ChatRoomDisconnectSocket } from '../../sockets/MessengerSockets';
import { setReplyMessage, setEditMessage } from '../../store/reducers/MessengerSlice';
import { ServerError } from '../../models/response/ServerError';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/UI/Loader';

const ChatPage: FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { userid } = useParams();
    
    useEffect(() => {
        if(userid) {
            const getDialog = async () => {
                const response = await dispatch(getChat(userid));
                const err = response.payload as ServerError
                if(err.error) {
                    navigate('/messenger');
                }
            };
            void getDialog();
        }
        return () => {
            if(userid) {
                ChatRoomDisconnectSocket(userid);
            }
            dispatch(setReplyMessage(null));
            dispatch(setEditMessage(null));
        }
    }, [userid]); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        if(userid) {
            ChatRoomSocket(userid);
        }
    }, [userid, socket])  // eslint-disable-line react-hooks/exhaustive-deps
    

    return (
        <>
            
            <Chats/>
            <Suspense fallback={<Loader />}>
                <Chat/>
            </Suspense>
        </>
    )
}

export default ChatPage;