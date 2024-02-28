import { FC } from 'react'
import { IMessage } from '../../../models/IMessage';
import Attachment from './Attachments/Attachment';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setBlinkMessage, setEditMessage } from '../../../store/reducers/MessengerSlice';

interface ReplyMessageProps {
    msg: IMessage;
}

const ReplyMessage: FC<ReplyMessageProps> = ({msg}) => {
    const dispatch = useAppDispatch();
    const { editMsg } = useAppSelector(state=> state.MessengerSlice)
    const clickHandler = () => {
        const elem = document.getElementById(msg._id);
        if(elem) {
            elem.scrollIntoView();
            dispatch(setBlinkMessage(msg._id));
            setTimeout(() => {
                dispatch(setBlinkMessage(''))
            }, 1000)
            
        }
    }
    return (
        <div onClick={()=>clickHandler()} className='cursor-pointer relative border-l-4 border-[#FFAE7A] px-2 py-3 rounded-sm overflow-hidden mb-2'>
            <div className="relative z-10">
                {msg?.attachments.length > 0 &&
                    <Attachment attachment={msg.attachments[0]}/>
                }
                {msg.type === 'text' &&
                    <p className='text-xs break-all'>{msg.msg}</p>
                }
                {msg.type === 'audio' &&
                    <p className='text-xs'>Audio message</p>
                }
                {/* <button onClick={e => {e.stopPropagation(); dispatch(setEditMessage(null))}} className=" bg-red-300 p-3 absolute right-0 top-0">X</button> */}
            </div>
            <div className="bg-white opacity-40 w-full h-full absolute top-0 left-0 z-0"></div>
        </div>
    )
}

export default ReplyMessage;