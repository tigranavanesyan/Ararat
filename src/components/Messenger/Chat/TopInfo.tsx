import { FC } from 'react'
import { User } from '../../../models/User';
import Avatar from '../../UI/Avatar';
import IcoButton from '../../UI/IcoButton';
//import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { BsTelephone } from '@react-icons/all-files/bs/BsTelephone';
import { BsCameraVideo } from '@react-icons/all-files/bs/BsCameraVideo';
import { useAppSelector } from '../../../hooks/redux';
import { CallChatSocket } from '../../../sockets/MessengerSockets';
import { useParams } from 'react-router-dom';

interface TopInfoProps {
    data: User;
    setInfo: (bool: boolean) => void;
    setCallActive: (bool: boolean) => void;
}

const TopInfo: FC<TopInfoProps> = ({data, setInfo, setCallActive}) => {
    const { chat } = useAppSelector(state => state.MessengerSlice)
    const { user } = useAppSelector(state => state.UserSlice)
    const {userid} = useParams();
    const clickHandler = () => {
        if(chat.isGroup) setInfo(true);
    }
    const callHandler = () => {

        if(userid) {
            CallChatSocket(chat.user, user._id, chat.user._id);
            setCallActive(true);
        }
    }

    return (
        <div className='bg-[#f0f2f5] flex justify-between px-12 p-2'>
            <div className="flex items-center">
                <div onClick={clickHandler} className={['flex items-center', chat.isGroup ? 'cursor-pointer' : null].join(' ')}>
                    <Avatar avatar={data.avatar} className='mr-3'/>
                    <div className="flex flex-col text-gray-900">
                        <h2 className='font-semibold'>{data.name} {data.sname}</h2>
                        <p className='text-sm text-apricot'>
                            {/*data.online
                            ?
                                'online'
                            :
                                formatDistanceToNow(new Date(data.lastOnline), {addSuffix: true})
                            */}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex items-center">
                {!chat.isGroup &&
                    <>
                        <IcoButton onClick={callHandler} icon={<BsTelephone/>} className='mr-2'/>
                        {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') && 
                            <IcoButton  onClick={callHandler} icon={<BsCameraVideo/>}/>
                        }
                    </>
                }
            </div>
        </div>
    )
}

export default TopInfo;