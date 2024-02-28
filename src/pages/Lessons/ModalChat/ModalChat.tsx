import { FC, useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { useParams } from 'react-router-dom';
import { getChat } from '../../../store/reducers/MessengerSlice';
import Message from './Message';
import Textarea from '../../../components/UI/Textarea';
import {VscSend} from '@react-icons/all-files/vsc/VscSend'
import { sendMessage } from '../../../store/reducers/MessengerSlice';

const ModalChat: FC<{className?: string}> = ({className}) => {
    const dispatch = useAppDispatch();
    const {group} = useAppSelector(state=> state.GroupSlice);
    const {chat} = useAppSelector(state=> state.MessengerSlice);
    const [msg, setMsg] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if(group.dialog_id) {
            const fetchData = async()=> {
                await dispatch(getChat(group.dialog_id));
            }
            void fetchData();
        }
    }, [group.dialog_id])

    
    const sendMessageHandler = async () => {
        
        if(msg.length > 0 && group.dialog_id) {

            const response = await dispatch(sendMessage({msg, userid: group.dialog_id, fileList: [], audio: undefined, reply: null}));

            // GroupSendMessageSocket({room: groupId, msg: {id: (Date.now() + Math.random()).toString(), name: user.name, sname: user.sname, msg: message}})
            setMsg('');
            if(messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView();
            }
        }
    }

    useEffect(() => {
        const scrollToMyRef = () => {
            if(messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView();
            }
        }

        setTimeout(scrollToMyRef, 200);
    }, [chat.messages])

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void sendMessageHandler();
        }
    }

    
    
    return (
        <div className='flex flex-col'>
            <p className='text-red-500 text-xl font-bold mb-2 text-center'>Чат вашей группы</p>
            <div className={["flex flex-col  rounded-lg overflow-hidden bg-gray-200 shadow-xl w-[550px] h-[400px] pb-4", className].join(' ')}>
                <div className="flex items-center border-b-gray-600 border-b-2 px-4 pt-2 pb-2 shadow-2xl shadow-white bg-gray-300">
                    <img className='mr-4 w-12' src={chat.user.avatar} alt="avatar" />
                    <h2 className="text-lg">{chat.user.name}</h2>
                </div>
                <div className="px-4 mt-5 flex-grow overflow-auto">
                    {chat.messages.map(message=>
                        message.type !== 'system' &&
                        <Message message={message}/>
                    )}
                    <div ref={messagesEndRef}></div>
                </div>
                <div className="px-3">
                    <div className="flex items-center border-2 border-[#CCC] rounded-full justify-between py-1 px-4 mt-3">
                        <input onKeyDown={e=> onKeyDownHandler(e)} type="text" placeholder='Введите сообщение...' className='w-full bg-transparent focus:outline-none'  value={msg} onChange={e=> setMsg(e.target.value)}/>
                        <div onClick={sendMessageHandler} className="cursor-pointer"><VscSend/></div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ModalChat;