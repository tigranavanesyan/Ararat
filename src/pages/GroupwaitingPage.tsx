import { FC, useEffect, useState } from 'react'
import TopMenu from '../components/UI/TopMenu/TopMenu';
import Table from '../components/GroupWaiting/Table';
import PermissionsService from '../services/PermissionsService';
import { User } from '../models/User';
import { ITopMenu } from '../models/ITopMenu';

const GroupwaitingPage: FC = () => {
    const [users, setUsers] = useState<User[]>();
    const [menu] = useState<ITopMenu[]>([
        {id: 0, name: 'Список', path: `/groupwaiting`},
        {id: 1, name: 'Архив', path: `/groupwaiting/archive`}
    ]);
    const fetchData = async() => {
        const response = await PermissionsService.getUsers('STUDENT', undefined, undefined, undefined, true);
        setUsers(response.data.users);
    }
    useEffect(() => {
        void fetchData();
    }, [])
    return (
        <div className='w-full'>
            <TopMenu menu={menu}/>
            {users &&
                <Table table={users}/>
            }
        </div>
    )
}

export default GroupwaitingPage;