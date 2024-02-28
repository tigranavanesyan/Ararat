import { FC, useEffect } from 'react'
import TopMenu from '../../components/UI/TopMenu/TopMenu';
import { useParams } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { useNavigate } from 'react-router-dom';
import { getGroup } from '../../store/reducers/GroupSlice';
import Student from '../../assets/student.png'
import Time from '../../assets/icons/time.png'
import Container from '../../components/OnlineLesson/Container';
import { GroupRoomSocket, GroupRoomDisconnectSocket } from '../../sockets/GroupSockets';
import ModalChat from './ModalChat/ModalChat';
import ModalTechChat from './ModalChat/ModalTechChat';
import { socket } from '../../sockets/socket';
import { ChatRoomSocket } from '../../sockets/MessengerSockets';
const Lesson: FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state=> state.UserSlice)
    const { group } = useAppSelector(state=> state.GroupSlice)
    const navigate = useNavigate();
    const { groupId } = useParams();
    useEffect(() => {
        const fetchData = async() => {
            if(groupId) {
                await dispatch(getGroup(groupId));
            }
        }
        void fetchData();
    }, [dispatch])  // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if(groupId) {
            GroupRoomSocket(groupId);
        }
        return () => {
            if(groupId) {
                GroupRoomDisconnectSocket(groupId);
            }
        }
    }, [groupId])
    
    useEffect(() => {
        if(group.dialog_id) {
            ChatRoomSocket(group.dialog_id);
        }
    }, [group.dialog_id, socket]) 
    return (
        <div className='w-full relative'>
            <TopMenu/>
            {group.open ?
                <div className="">
                    <Container lesson={true}/>
                </div>
                :
                <>
                    <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-75 flex flex-col items-center justify-center ">
                        <div className="w-[1100px] h-[440px] bg-white border-2 border-[#B7975A] rounded-lg flex items-center px-10 mb-5">
                            <div className="flex flex-col">
                                <p className='text-[#353535] text-4xl mb-4'>Дождитесь пока тренер начнет конференцию</p>
                                <p className='text-lg mb-3'>1. Если вы ждете более 2-3 минут и нет подключение, жмите Ctrl+Shift+R и страница обновится.</p>
                                <p className='text-lg'>2. Для избежания разных проблем при подключении к конференции рекомендуем всегда использовать именно GOOGLE CHROME.</p>
                                <p className='text-lg mb-3'>3. Если снова не получилось подключиться, пишите сообщения в WhatsApp администратору школы или в группе на портале где тренер и администратор.</p>
                            </div>
                            <div className="flex">
                                <div className="w-[70px]"><img src={Time} alt="time" /></div>
                                <div className='ml-5 border-2 rounded-lg p-12 py-8 border-[#CCCCCC] flex flex-col items-center'>
                                    <img className='mb-4' src={Student} alt="student" />
                                    <p className='text-xl text-center'>{user.name} {user.sname}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <ModalTechChat />
                            <ModalChat />
                        </div>
                    </div>

                </>
            }
        </div>
    )
}

export default Lesson;