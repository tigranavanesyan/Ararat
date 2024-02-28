import { FC, useEffect, useState } from 'react'
import TopMenuPermissions from '../components/UI/TopMenu/TopMenuPermissions';
import Table from '../components/Permissions/Table';
import PermissionsService from '../services/PermissionsService';
import { User } from '../models/User';
import { ITopMenu } from '../models/ITopMenu';

const PermissionsPage: FC = () => {
    const [users, setUsers] = useState<User[]>();
    const [reqCouner, setReqCouner] = useState<{sber1: number, tink1: number, sber2: number, arm1: number, arm2: number}>({ sber1: 0, tink1: 0, sber2: 0, arm1: 0, arm2: 0 });
    const [menu, setMenu] = useState<ITopMenu[]>([
        {id: 0, name: 'All', path: '', counter: 0}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 1, name: 'New users', path: 'NEWUSER', counter: 0}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 2, name: 'Students', path: 'STUDENT', counter: 0},
        {id: 3, name: 'Trainers', path: 'TRANER', scope: ['DIRECTOR', 'ZDIRECTOR'], counter: 0}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 4, name: 'Admins', path: 'ADMIN', scope: ['DIRECTOR', 'ZDIRECTOR'], counter: 0}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 5, name: 'Archive', path: '', counter: 0}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
    ])
    const fetchData = async(role = 'NEWUSER', search?: string, archive?: boolean) => {
        const response = await PermissionsService.getUsers(role, search, archive);
        setUsers(response.data.users);
        const response2 = await PermissionsService.getCounter();
        setMenu([
            {id: 0, name: 'All', path: '', counter: response2.data.counters.all}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
            {id: 1, name: 'New users', path: 'NEWUSER', counter: response2.data.counters.newUsers}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
            {id: 2, name: 'Students', path: 'STUDENT', counter: response2.data.counters.students},
            {id: 3, name: 'Trainers', path: 'TRANER', scope: ['DIRECTOR', 'ZDIRECTOR'], counter: response2.data.counters.trainers}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
            {id: 4, name: 'Admins', path: 'ADMIN', scope: ['DIRECTOR', 'ZDIRECTOR'], counter: response2.data.counters.admins}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
            {id: 5, name: 'Archive', path: '', counter: response2.data.counters.archive}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        ])
    }
    const countData = async() => {
        const response = await PermissionsService.getUsers();
        if(response.data) {
            let sber1 = 0;
            let tink1 = 0;
            let sber2 = 0;
            let arm1 = 0;
            let arm2 = 0;
            response.data.users.map(user=>{
                switch (user.requizits) {
                    case 1:
                        sber1++;
                        break;
                    case 2:
                        tink1++;
                        break;
                    case 3:
                        sber2++;
                        break;
                    case 4:
                        arm1++;
                        break;
                    case 5:
                        
                        break;
                    case 6:
                        arm2++;
                        break;
                }
            })
            setReqCouner({sber1: sber1, tink1: tink1, sber2: sber2, arm1: arm1, arm2: arm2});
        }
    }
    useEffect(() => {
        void fetchData();
        void countData();
    }, [])
    return (
        <div className='w-full'>
            <TopMenuPermissions menu={menu} fetchData={fetchData}/>
            {users &&
                <Table reqCouner={reqCouner} table={users}/>
            }
        </div>
    )
}

export default PermissionsPage;