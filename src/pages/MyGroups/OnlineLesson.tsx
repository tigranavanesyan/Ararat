import { FC, useState, useEffect } from 'react'
import TopMenuOnlineLesson from '../../components/UI/TopMenu/TopMenuOnlineLesson';
import Container from '../../components/OnlineLesson/Container';
import { ITopMenuOnlineLesson } from '../../models/ITopMenu';
import { useParams } from 'react-router-dom';
import { GroupRoomSocket, GroupRoomDisconnectSocket } from '../../sockets/GroupSockets';
import { socket } from '../../sockets/socket';

const OnlineLesson: FC = () => {
    const { groupId } = useParams();
    const [api, setApi] = useState();
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
    

    const [menu] = useState<ITopMenuOnlineLesson[]>([
        {id: 0, name: 'Программа', openProgram: true}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 1, name: 'Ученики'},
        {id: 2, name: 'История', openHistory: true}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 3, name: 'Домашнее задание', dropdown: true, openHomework: true},
        {id: 4, name: 'Описание группы', dropdown: true, openDescription: true}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
    ])
    return (
        <div className='w-full'>
            <TopMenuOnlineLesson menu={menu} api={api}/>
            <Container setApi={setApi}/>
        </div>
    )
}

export default OnlineLesson;