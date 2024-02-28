import { FC, useState, useEffect } from 'react'
import TopMenu from '../../components/UI/TopMenu/TopMenu';
import { ITopMenu } from '../../models/ITopMenu';
import { useAppDispatch } from '../../hooks/redux';
import { getGroups } from '../../store/reducers/GroupSlice';
import AddHomework from '../../components/Homework/AddHomework';
import { useParams } from 'react-router-dom';

const AddHomeworkPage: FC = () => {
    const { groupId } = useParams();
    const [menu] = useState<ITopMenu[]>([
        {id: 0, name: 'Программа', path: `/group/${groupId}/program`}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 1, name: 'Ученики'},
        {id: 2, name: 'Онлайн урок', path: `/group/${groupId}/online-lesson`}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 3, name: 'Домашнее\nзадание'},
        {id: 4, name: 'Описание группы', path: `/group/${groupId}/description`}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 5, name: 'История', path: `/group/${groupId}/history`}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
    ]);
    const dispatch = useAppDispatch();
    useEffect(() => {
        const fetchData = async() => {
            await dispatch(getGroups({}))
        }
        void fetchData();
    }, [dispatch])
    
    return (
        <div className='w-full'>
            <TopMenu menu={menu}/>
            <AddHomework />
        </div>
    )
}

export default AddHomeworkPage;