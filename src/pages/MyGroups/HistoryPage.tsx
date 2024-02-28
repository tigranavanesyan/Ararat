import { FC, useState, useEffect } from 'react'
import TopMenu from '../../components/UI/TopMenu/TopMenu';
import GroupInfo from '../../components/MyGroups/GroupInfo';
import { ITopMenu } from '../../models/ITopMenu';
import { useParams } from 'react-router-dom';
import History from '../../components/History/History';
import GroupService from '../../services/GroupService';
import { IGroup } from '../../models/response/IGroup';

const HistoryPage: FC = () => {
    const { groupId } = useParams();
    const [menu] = useState<ITopMenu[]>([
        {id: 0, name: 'Программа', path: `/group/${groupId}/program`}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 1, name: 'Онлайн урок', path: `/group/${groupId}/online-lesson`}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 2, name: 'Домашнее\nзадание', path: `/group/${groupId}/homework`}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 3, name: 'Ученики'},
        {id: 4, name: 'Описание группы', path: `/group/${groupId}/description`}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 5, name: 'История', path: `/group/${groupId}/history`}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
    ])
    const [group, setGroup] = useState<IGroup>();
    useEffect(() => {
        const fetchData = async() => {
            if(groupId) {
                await GroupService.getGroup(groupId).then(response=>{
                    setGroup(response.data.group);
                });
                
            }
        }
        void fetchData();
    }, [groupId])
    return (
        <div className='w-full'>
            <TopMenu menu={menu}/>
            <GroupInfo />
            {group &&
                <History group={group}/>
            }
        </div>
    )
}

export default HistoryPage;