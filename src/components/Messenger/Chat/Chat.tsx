import { FC, useRef, useEffect, useLayoutEffect, useState, Fragment } from 'react'
import TopInfo from './TopInfo';
import Message from './Message';
import EmptyChat from './EmptyChat';
import SendMessage from './SendMessage';
import { useAppSelector } from '../../../hooks/redux';
import MessageMenu from './Menus/MessageMenu/MessageMenu';
import { IContext } from '../../../models/IContext';
import AttachmentModal from '../../Modals/AttachmentModal';
import { setAttachmentModal } from '../../../store/reducers/MessengerSlice';
import { useAppDispatch } from '../../../hooks/redux';
import GroupInfo from './GroupInfo/GroupInfo';
import ChatCall from '../Chats/Call/ChatCall';
import Data from './Data';
import format from 'date-fns/format';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import isThisWeek from 'date-fns/isThisWeek';
import isToday from 'date-fns/isToday';
import ru from 'date-fns/locale/ru';

const Chat: FC = () => {
    const {attachment, attachmentModal} = useAppSelector(state=> state.MessengerSlice);
    const [info, setInfo] = useState<boolean>(false);
    const [callState, setCallState] = useState<boolean>(false);
    const [context, setContext] = useState<IContext>({
        active: false,
        x: 0,
        y: 0,
        message_id: '',
        message_text: '',
        isMe: false
    });
    
    const [dates, setDates] = useState<Array<{date: string, render: string}>>([]);
    const dispath = useAppDispatch();
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const { user } = useAppSelector(state => state.UserSlice)
    const { chat } = useAppSelector(state => state.MessengerSlice)
    useEffect(() => {
        const tmp: Array<{date: string, render: string}> = [];
        chat.messages.map(msg=>{
            if(!tmp.find(item=> item.date === format(new Date(msg.time), 'dd.MM.Y'))) {
                tmp.push({date: format(new Date(msg.time), 'dd.MM.Y'), render: isThisWeek(new Date(msg.time)) ? isToday(new Date(msg.time)) ? 'сегодня' : format(new Date(msg.time), 'EEEE', {locale: ru}) : format(new Date(msg.time), 'dd.MM.Y')});
            } 
        })
        setDates(tmp);
        const scrollToMyRef = () => {
            if(messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView();
            }
        }

        setTimeout(scrollToMyRef, 200);
    }, [chat.messages])
    const setM = (bool: boolean) => {
        dispath(setAttachmentModal({modal: bool, attachment: {}}));
    }
    return (
        <>
            <div className='absolute z-50 top-36 h-[calc(100vh-235px)] xl:h-full xl:static w-full bg-gray-300 bg-chat-pattern flex flex-col'>
                <TopInfo setCallActive={setCallState} setInfo={setInfo} data={chat.user}/>
                <div className={['flex-grow custom-scroll', context.active ? 'overflow-y-hidden' : 'overflow-y-auto'].join(' ')}>
                    <div className={['w-full flex flex-col mx-auto max-w-[1350px]', chat.messages.length > 0 ? 'mt-10' : 'h-full justify-center'].join(' ')}>
                        {chat.messages.length > 0
                        ?
                        <>
                        {dates.map(date=>
                            <Fragment key={date.date}>
                                <Data data={date.render}/>
                                {chat.messages.map(message=>
                                    format(new Date(message.time), 'dd.MM.Y') === date.date &&
                                    <Fragment key={message._id}>
                                        <Message msg={message} user={message.from?._id === user._id ? user : chat.user} isMe={message.from?._id === user._id ? true : false} setContext={setContext}/>
                                    </Fragment>
                                )}
                            </Fragment>
                        )}
                        <MessageMenu context={context} setContext={setContext}/>
                        <div ref={messagesEndRef}></div>
                        </>
                        :
                        <EmptyChat/>
                        }
                        
                    </div>
                </div>
                <AttachmentModal modal={attachmentModal} setModal={setM} attachment={attachment}/>
                <SendMessage/>
            </div>
            <GroupInfo active={info} setActive={setInfo}/>
            {user._id &&
                <ChatCall setActive={setCallState} active={callState} roomid={user._id} username={user.name} email={user.email}/>
            }
        </>
    )
}

export default Chat;