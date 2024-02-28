import { FC, useEffect, useState } from 'react'
import { IMessage } from '../../../models/IMessage'
import { User } from '../../../models/User';
import format from 'date-fns/format';
import { BsCheckAll } from '@react-icons/all-files/bs/BsCheckAll'
import Avatar from '../../UI/Avatar';
import { IContext } from '../../../models/IContext';
import AudioMessage from './AudioMessage';
import ReplyMessage from './ReplyMessage';
import Attachments from './Attachments/Attachments';
import { useAppSelector } from '../../../hooks/redux';
import sanitize from 'sanitize-html';
import { IoIosArrowDown } from '@react-icons/all-files/io/IoIosArrowDown'
import { Link } from 'react-router-dom';
import differenceInDays from 'date-fns/differenceInDays';
import BtnArrowContextMenuMobile from "../../UI/BtnArrowContextMenuMobile.tsx";

interface MessageProps {
    className?: string;
    msg: IMessage;
    user?: User;
    isMe: boolean;
    setContext?: (obj: IContext) => void;
}

const Message: FC<MessageProps> = ({ msg, isMe, setContext, className }) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        if (setContext) setContext({ active: true, x: e.clientX, y: e.clientY, message_id: msg._id, message_text: msg.msg, isMe });
    }

    const [wrapMessage, setWrapMessage] = useState<string>('');

    useEffect(() => {
        const urlPattern = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/gi;   // eslint-disable-line no-useless-escape  
        const regex = new RegExp(`${'@'}\\S*`, 'gi');
        const FirstReplace = msg.msg.replace(urlPattern, '<a class="text-blue-600" target="_blank" href="$&">$&</a>');
        const SecondReplace = FirstReplace.replace(regex, '<span class="text-blue-600">$&</span>');
        setWrapMessage(sanitize(SecondReplace, { allowedTags: ["span", "a"], allowedAttributes: { a: ["href", "target"] }, allowedClasses: { 'span': ['text-blue-600'], 'a': ['text-blue-600'] } }))
    }, [])


    const { blinkMessage } = useAppSelector(state => state.MessengerSlice)
    const { user } = useAppSelector(state => state.UserSlice)
    const { chat } = useAppSelector(state => state.MessengerSlice);
    const userfrom = chat.since?.find(item => item.user_id === msg.from?._id);
    return (
        <>
            {console.log("message content ------>", msg)}
            {msg.type === 'system'
                ?
                msg.color === 'green'
                    ?
                    <div id={msg._id} className={['flex w-full basis-full mb-10 text-white', isMe ? 'self-center justify-center' : 'self-start justify-start'].join(' ')}>

                        <div onContextMenu={e => handleClick(e)} className={['w-full text-black shadow-md transition-all rounded-md py-2 px-4 relative before:absolute before:right-0 before:translate-x-1/2 bg-green-300 order-1 mr-5 before:border-t-green-300'].join(' ')}>
                            <h2 className='font-medium mb-1'>System</h2>

                            <p className='text-sm whitespace-pre-wrap break-all' dangerouslySetInnerHTML={{ __html: wrapMessage }}></p>

                            <div className="flex items-center justify-end">
                                <p className='text-xs'>{format(new Date(msg.time), 'MM/dd HH:mm')}</p>
                                {isMe &&
                                    <span className={['ml-1 text-lg', msg.readed ? 'text-blue-600' : 'text-gray-800'].join(' ')}><BsCheckAll /></span>
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <Link to={user.role !== 'STUDENT' ? `/group/${chat.group_id}/homework/${msg.homework}` : `/homework/${msg.homework}`} id={msg._id} className={['flex w-full basis-full mb-10 text-white', isMe ? 'self-center justify-center' : 'self-start justify-start'].join(' ')}>

                        <div onContextMenu={e => handleClick(e)}
                            className={['w-full shadow-md transition-all rounded-md py-1 px-4 relative before:absolute before:right-0 before:translate-x-1/2', msg.color === 'yellow' ? 'bg-yellow-400 order-1 mr-5 before:border-t-yellow-400' : msg.color === 'blue' ? 'bg-blue-500 order-1 mr-5 before:border-t-blue-500' : msg.color === 'green' ? 'bg-green-500 order-1 mr-5 before:border-t-yellow-400' : 'bg-red-500 order-1 mr-5 before:border-t-red-500'].join(' ')}>
                            <div className="flex justify-between">
                                <div className="">
                                    <h2 className='font-medium mb-1'>System</h2>

                                    <div className="flex items-center justify-between">
                                        <p className='text-sm break-all'>{msg.msg}</p>
                                    </div>
                                </div>
                                {msg.attemps &&
                                    <div className='flex overflow-auto max-w-[70%]'>
                                        {
                                            msg.attemps.map((item, index) =>
                                                <div className="bg-white text-black flex flex-col items-center mr-2 text-lg rounded-lg p-1">
                                                    <p className='text-xl'>{index + 2} попытка</p>
                                                    <p className='text-base'>{format(new Date(item), 'd MMM')} {format(new Date(item), 'MM/dd HH:mm')}</p>
                                                </div>
                                            )
                                        }
                                    </div>
                                }
                            </div>



                            <div className="flex items-center justify-end">
                                <p className='text-xs'>{format(new Date(msg.time), 'MM/dd HH:mm')}</p>
                                {isMe &&
                                    <span className={['ml-1 text-lg', msg.readed ? 'text-blue-600' : 'text-gray-800'].join(' ')}><BsCheckAll /></span>
                                }
                            </div>

                        </div>
                    </Link>
                :
                <div id={msg._id} className={['flex w-2/3 mb-10 [&>div>.arr-menu]:hover:block', isMe ? 'self-end justify-end' : 'self-start justify-start', className].join(' ')}>
                    <Avatar className='-translate-y-[5px] order-2' avatar={msg.from?.avatar} />
                    <div onContextMenu={e => handleClick(e)} className={['msg-con pr-8 shadow-md transition-all rounded-md py-2 px-3 relative before:absolute before:border-[10px] before:border-transparent before:border-t-[10px] before:top-0', isMe ? 'bg-apricot order-1 mr-5 before:border-t-apricot before:right-0 before:translate-x-1/2' : 'bg-white order-3 ml-5 before:border-t-white before:left-0 before:-translate-x-1/2', !isMe && blinkMessage === msg._id ? '!bg-gray-600' : null, isMe && blinkMessage === msg._id ? '!bg-[#FFAE7A]' : null].join(' ')}>
                        <div className='absolute right-2 top-2 w-6 h-4 flex'>
                            <BtnArrowContextMenuMobile btnType={'chat'}/>
                        </div>

                        {/*<div className={['arr-menu hidden absolute right-2 text-gray-800 top-2 text-xl cursor-pointer', isMe ? 'bg-apricot' : 'bg-white'].join(' ')} onClick={e => handleClick(e)}><IoIosArrowDown /></div>*/}
                        <h2 className={['font-medium text-sm mb-1', (msg.from?.role === 'DIRECTOR' || msg.from?.role === 'ZDIRECTOR' || msg.from?.role === 'ADMIN') && '!text-red-700'].join(' ')} style={{ color: msg.from?.hex }}>
                            {(!chat.anonim || user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || (user.role === 'ADMIN' && (chat._id === '651c1e9fbfbc95c1f9d7f8b8' || chat._id === '64e260054ae1183395474c7b'))) ? msg.from?.name + ' ' + msg.from?.sname : 'Пользователь'}
                            <span className='text-red-500'>
                                {(userfrom ? (differenceInDays(new Date(), new Date(userfrom.date)) <= 10 ? ' (Новый пользователь)' : '') : '')}
                            </span>
                        </h2> { /* eslint-disable-line @typescript-eslint/restrict-plus-operands*/}
                        {msg.reply &&
                            <ReplyMessage msg={msg.reply} />
                        }
                        {msg.attachments.length > 0 &&
                            <Attachments attachments={msg.attachments} />
                        }
                        {msg.type === 'text' &&
                            <p className='text-sm whitespace-pre-wrap break-all pr-14' dangerouslySetInnerHTML={{ __html: wrapMessage }}></p>
                        }

                        {msg.type === 'audio' &&
                            <AudioMessage msg={msg} isMe={isMe} />
                        }

                        <div className="flex flex-col text-right items-end">
                            <div className='flex flex-row justify-end -mr-5'>
                                <p className='text-xs text-gray-600'>{format(new Date(msg.time), 'dd/MM HH:mm')}</p>
                                {isMe &&
                                    <span className={['ml-1 text-lg', msg.readed ? 'text-blue-600' : 'text-gray-800'].join(' ')}><BsCheckAll /></span>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }

        </>
    )
}

export default Message;