import { FC, useState, useRef, useEffect } from 'react'
import Title from '../../UI/Title';
import { IMaterial } from '../../../models/Program/IMaterial';
import Message from './Message';
import { VscSend } from '@react-icons/all-files/vsc/VscSend';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { GroupSendMessageSocket } from '../../../sockets/GroupSockets';
import { useParams } from 'react-router-dom';
import { socket } from '../../../sockets/socket';
import { sendMessage } from '../../../store/reducers/GroupSlice';
import { IGroupMessage } from '../../../models/MyGroups/IGroupMessage';

const Chat: FC = () => {
    const {groupId} = useParams();
    const dispatch = useAppDispatch();
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const { user } = useAppSelector(state=> state.UserSlice)
    const {chat} = useAppSelector(state=> state.GroupSlice)
    const [message, setMessage] = useState<string>('');
    const sendMessageHandle = () => {
        if(message.length > 0 && groupId) {

            dispatch(sendMessage({id: (Date.now() + Math.random()).toString(), name: user.name, sname: user.sname, msg: message}))
            GroupSendMessageSocket({room: groupId, msg: {id: (Date.now() + Math.random()).toString(), name: user.name, sname: user.sname, msg: message}})
            setMessage('');
            if(messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView();
            }
        }
    }

    useEffect(() => {
        socket.on("group:recive_message", (data: IGroupMessage)=>{
            dispatch(sendMessage(data))
        })
    }, [socket])
    

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void sendMessageHandle();
        }
    }
    
    return (
        <div className='flex flex-col'>
            <Title name='Чат'/>
            <div className="border-2 border-[#CCC] -mt-6 p-5 pt-8 rounded-b-2xl border-t-0">
                <div className="flex flex-col h-[185px] max-2xl:h-[100px] overflow-auto">
                    {chat.map(message=>
                        <Message key={message.id} message={message}/>
                    )}
                    <div ref={messagesEndRef}></div>
                </div>
                <div className="flex items-center border-2 border-[#CCC] rounded-full justify-between py-1 px-4 mt-3">
                    <input onKeyDown={e=> onKeyDownHandler(e)} type="text" className='w-full bg-transparent focus:outline-none' value={message} onChange={e=> setMessage(e.target.value)}/>
                    <div onClick={sendMessageHandle} className="cursor-pointer"><VscSend/></div>
                </div>
            </div>
        </div>
    )
}

export default Chat;