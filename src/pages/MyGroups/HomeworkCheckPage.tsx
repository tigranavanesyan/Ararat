import { FC, useState, useEffect } from 'react'
import TopMenu from '../../components/UI/TopMenu/TopMenu';
import { ITopMenu } from '../../models/ITopMenu';
import Table from '../../components/Homework/CheckPacge/Table';
import { IMyGropsTable } from '../../models/MyGroups/IMyGropsTable';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getHomeworks } from '../../store/reducers/HomeworkSlice';
import { useParams } from 'react-router-dom';
import { getGroup } from '../../store/reducers/GroupSlice';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';

const HomeworkCheckPage: FC = () => {
    const {groupId} = useParams();
    const [menu] = useState<ITopMenu[]>([
        {id: 0, name: 'Программа', path: `/group/${groupId}/program`}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 1, name: 'Онлайн урок', path: `/group/${groupId}/online-lesson`}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 2, name: 'Домашнее\nзадание', path: `/group/${groupId}/homework`}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 3, name: 'Ученики'},
        {id: 4, name: 'Описание группы', path: `/group/${groupId}/description`}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 5, name: 'История', path: `/group/${groupId}/history`}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
    ]);
    const dispatch = useAppDispatch();
    const { group } = useAppSelector(state=> state.GroupSlice)
    useEffect(() => {
        const fetchData = async() => {
            if(groupId) {
                await dispatch(getGroup(groupId));
            }
        }
        void fetchData();
    }, [dispatch])
    
    return (
        <div className='w-full'>
            <TopMenu menu={menu}/>
            <div className='m-5 p-5 bg-[#f0f0f0] rounded-xl flex justify-between'>
                <div className="flex flex-col w-full">
                    {group &&
                        <Table table={group}/>
                    }
                </div>
            </div>
        </div>
    )
}

export default HomeworkCheckPage;