import { FC, useRef, useEffect } from 'react'
import { MdOutlineEdit } from '@react-icons/all-files/md/MdOutlineEdit'
import { BsArrow90DegLeft } from '@react-icons/all-files/bs/BsArrow90DegLeft'
import { BsArrow90DegRight } from '@react-icons/all-files/bs/BsArrow90DegRight'
import { MdContentCopy } from '@react-icons/all-files/md/MdContentCopy'
import { AiOutlineDelete } from '@react-icons/all-files/ai/AiOutlineDelete'
import { AiOutlineCheckCircle } from '@react-icons/all-files/ai/AiOutlineCheckCircle'
import MenuItem from './MenuItem';
import { IContext } from '../../../../../models/IContext'
import { clickOuter } from '../../../../../utils/clickOuter'
import copy from 'copy-to-clipboard';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux'
import { setReplyMessage, setEditMessage, deleteMessage } from '../../../../../store/reducers/MessengerSlice'
import { useParams } from 'react-router-dom'

interface MessageMenuProps {
    context: IContext;
    setContext: (obj: IContext) => void;
}

const MessageMenu: FC<MessageMenuProps> = ({ context, setContext }) => {
    const { userid } = useParams();
    const { user } = useAppSelector(state => state.UserSlice);
    const menuRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if(menuRef.current) {
            return clickOuter(menuRef.current, ()=>setContext({...context, active: false}));
        }
    }, [context, setContext]);

    const copyHandler = () => {
        copy(context.message_text);
        setContext({...context, active: false})
    }

    const replyHandler = () => {
        const textReply = document.getElementById("textReply");
        textReply?.focus();
        dispatch(setReplyMessage(context.message_id))
        setContext({...context, active: false})
    }

    const editMessageHandler = () => {
        dispatch(setEditMessage(context.message_id))
        setContext({...context, active: false})
    }

    const deleteMessageHandler = async() => {
        if(userid) {
            await dispatch(deleteMessage({msg_id:context.message_id, dialog_id: userid}));
        }
        setContext({...context, active: false})
    }
    

    return (
        <>
        {context.active &&
        <div ref={menuRef} style={{left: context.x, top: context.y}} className={['z-10 bg-gray-800 rounded-sm h-auto absolute', context.y < 280 ? '' : '-translate-y-full'].join(' ')}>
            <ul className='flex flex-col'>
                <MenuItem onClick={replyHandler} icon={<BsArrow90DegLeft/>}>Reply</MenuItem>
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') &&
                    <MenuItem onClick={editMessageHandler} icon={<MdOutlineEdit/>}>Edit</MenuItem>
                }
                {/*<MenuItem icon={<BsArrow90DegRight/>}>Resend</MenuItem>*/}
                <MenuItem onClick={copyHandler} icon={<MdContentCopy/>}>Copy text</MenuItem>
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') &&
                    <MenuItem onClick={deleteMessageHandler} icon={<AiOutlineDelete/>}>Delete</MenuItem>
                }
                {/*<MenuItem icon={<AiOutlineCheckCircle/>}>Select</MenuItem>*/}
            </ul>
        </div>
        }
        </>
    )
}

export default MessageMenu;