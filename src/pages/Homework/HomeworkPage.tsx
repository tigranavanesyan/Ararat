import { FC, useEffect } from 'react'
import TopMenu from '../../components/UI/TopMenu/TopMenu';
import { useParams } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { useNavigate } from 'react-router-dom';
import { getGroup } from '../../store/reducers/GroupSlice';
import Student from '../../assets/student.png'
import Time from '../../assets/icons/time.png'
import Container from '../../components/Homework/Container';
import { GroupRoomSocket, GroupRoomDisconnectSocket } from '../../sockets/GroupSockets';
const HomeworkPage: FC = () => {
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

    return (
        <div className='w-full relative'>
            <div className="">
                <Container lesson={true}/>
            </div>
        </div>
    )
}

export default HomeworkPage;