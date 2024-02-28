import {FC, useState} from 'react'
import { User } from '../../models/User';
import PermissionsModal from '../Modals/PermissionsModal';
import { useAppSelector } from '../../hooks/redux';
import RemoveUserModal from '../Modals/RemoveUserModal';
import { Link } from 'react-router-dom';

interface TableProps {
    table: User[];
    reqCouner: {sber1: number, tink1: number, sber2: number, arm1: number, arm2: number};
}

const Table: FC<TableProps> = ({table, reqCouner}) => {    
    const [modal, setModal] = useState<boolean>(false);
    const [modal2, setModal2] = useState<boolean>(false);
    const {user} = useAppSelector(state=> state.UserSlice);
    const [userdata, setUserdata] = useState<{_id: string, name: string, sname:string, role: string, email: string, archive: boolean}>({
        _id: '',
        name: '',
        sname: '',
        tname: '',
        role: '',
        email: '',
        archive: false,
    });
    const editHandler = (user) => {
        setUserdata({_id: user._id, name: user.name, sname: user.sname, tname: user.tname, role: user.role, requizits: user.requizits, seance: user.seance, online: user.online, offline: user.offline, allgroups: user.allgroups});
        setModal(true);
    }
    const removeHandler = (user) => {
        setUserdata({_id: user._id, name: user.name, sname: user.sname, role: user.role, requizits: user.requizits, email: user.email, archive: user.archive});
        setModal2(true);
    }
    return (
        <>
            <div className="p-5 h-[calc(100vh-110px)] overflow-auto">
                {table.map(item=>
                    ((item.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || item.role === 'ADMIN' || item.role === 'TRANER') && user.role === 'ADMIN') ?
                    <>
                    </>
                    :
                    <div className="w-full bg-gradient-top-menu rounded-xl p-3 flex justify-between mb-5">
                        <div className="flex items-center w-full">
                            <div className="w-12 mr-5"><img className='w-full' src={item.avatar} alt="avatar" /></div>
                            <div className="flex flex-col basis-[350px]">
                                <p className='text-xl text-white'>{item.name} {item.sname} {item.tname} <span className='ml-1 text-base bg-white px-2 shadow-lg rounded-full text-red-500'>{item.role}</span></p>
                                <p className='text-xl text-white'>{item.email}</p>
                            </div>
                            <div className='text-white ml-5'>
                                <p className='font-medium text-lg'>Группы:</p>
                                {item.groups?.map((group, index)=>{
                                    index++;
                                    if(index <= 3) {
                                        return(
                                            <p className="text-lg">{group.name}</p>
                                        )
                                    }
                                })}
                                {item.groups?.length > 3 &&
                                    <p>Полный список груп в профиле ...</p>
                                }
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button className='bg-gradient-button text-lg font-semibold rounded-full py-2 px-5 mr-4' onClick={()=> editHandler(item)}>Редактировать</button>
                            <Link className='bg-gradient-button text-lg font-semibold rounded-full py-2 px-5 mr-4' to={'/profile/'+item._id}>Профиль</Link>
                            <button className='bg-gradient-button text-lg font-semibold rounded-full py-2 px-5' onClick={()=> removeHandler(item)}>{item.archive ? 'Разархивировать': 'Архивировать'}</button>
                        </div>
                    </div>
                    
                )}
            </div>
            <PermissionsModal modal={modal} setModal={setModal} reqCouner={reqCouner} userdata={userdata}/>
            <RemoveUserModal modal={modal2} setModal={setModal2} email={userdata.email} _id={userdata._id} archive={userdata.archive}/>
        </>
    )
}

export default Table;