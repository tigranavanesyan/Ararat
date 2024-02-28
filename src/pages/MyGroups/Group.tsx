import { FC, useState, useEffect } from 'react'
import TopMenu from '../../components/UI/TopMenu/TopMenu';
import GroupInfo from '../../components/MyGroups/GroupInfo';
import { ITopMenu } from '../../models/ITopMenu';
import { useParams } from 'react-router-dom';
import ModalChat from '../Lessons/ModalChat/ModalChat';
import GroupService from '../../services/GroupService';
import { AxiosError } from 'axios';
const Group: FC = () => {
    const { groupId } = useParams();
    const [chat, openChat] = useState(false);
    const [menu] = useState<ITopMenu[]>([
        {id: 0, name: 'Программа', path: `/group/${groupId}/program`, scope: ['DIRECTOR', 'ZDIRECTROR', 'TRANER', groupId === '653bb23a7575d7142fe229e7' ? 'ADMIN': '']}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 1, name: 'Онлайн урок', path: `/group/${groupId}/online-lesson`, scope: ['DIRECTOR', 'ZDIRECTROR', 'TRANER', groupId === '653bb23a7575d7142fe229e7' ? 'ADMIN': '']}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 2, name: 'Домашнее\nзадание', path: `/group/${groupId}/homework`, scope: ['DIRECTOR', 'ZDIRECTROR', 'TRANER', groupId === '653bb23a7575d7142fe229e7' ? 'ADMIN': '']}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 3, name: 'Ученики', scope: ['DIRECTROR', 'ZDIRECTROR', 'TRANER', groupId === '653bb23a7575d7142fe229e7' ? 'ADMIN': '']},
        {id: 4, name: 'Описание группы', path: `/group/${groupId}/description`}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 5, name: 'История', path: `/group/${groupId}/history`}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
    ]);
    // const clearProgram = async() => {
    //     if(groupId) {
    //         await GroupService.editGroup(groupId, {program: []} ).catch((e: AxiosError)=> {
    //             console.log(e);
    //         });
    //     }
    // }
    useEffect(() => {
        // void clearProgram();
    }, [groupId])
    
    return (
        <div className='w-full'>
            <TopMenu menu={menu}/>
            <GroupInfo openChat={openChat} chat={chat}/>
            {chat &&
                <div className="px-40 m-auto">
                    <ModalChat className='w-full'/>
                </div>
            }
        </div>
    )
}

export default Group;