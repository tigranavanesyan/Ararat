import { FC, useState, useEffect } from 'react'
import TopMenu from '../../components/UI/TopMenu/TopMenu';
import { ITopMenu } from '../../models/ITopMenu';
import Table from '../../components/MyGroups/Table';
import { IMyGropsTable } from '../../models/MyGroups/IMyGropsTable';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getGroups } from '../../store/reducers/GroupSlice';

const MyGroups: FC = () => {
    const [menu] = useState<ITopMenu[]>([
        {id: 0, name: 'Название'},
        {id: 1, name: 'Уровень знаний'},
        {id: 2, name: 'Кол.\nучеников'},
        {id: 3, name: 'Начало обучения'},
    ])
    const dispatch = useAppDispatch();
    const { groups } = useAppSelector(state=> state.GroupSlice)
    const fetchData = async(archive?: boolean) => {
        // const response = await PermissionsService.getUsers(role, search, archive);
        // setUsers(response.data.users);
        await dispatch(getGroups({archive}))
    }
    useEffect(() => {
        void fetchData();
    }, [dispatch])
    
    const [table] = useState<IMyGropsTable[]>([
        {id: 0, name: 'Вс 12:30 4-7 МГ З.ЭД', level: '7+ 1000-1300 ПРОДВИНУТЫЙ', count: '5/6', start: '21.06.2023', description: 'ТЕКСТ'},
        {id: 1, name: 'Вс 12:30 4-7 МГ З.ЭД', level: '7+ 1000-1300 ПРОДВИНУТЫЙ', count: '5/6', start: '21.06.2023', description: 'ТЕКСТ'},
        {id: 2, name: 'Вс 12:30 4-7 МГ З.ЭД', level: '7+ 1000-1300 ПРОДВИНУТЫЙ', count: '5/6', start: '21.06.2023', description: 'ТЕКСТ'},
    ])
    return (
        <div className='w-full'>
            <TopMenu menu={menu}/>
            <Table fetchData={fetchData} table={groups}/>
        </div>
    )
}

export default MyGroups;