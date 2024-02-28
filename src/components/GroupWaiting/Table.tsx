import {FC, useState} from 'react'
import { User } from '../../models/User';
import PermissionsModal from '../Modals/PermissionsModal';
import { useAppSelector } from '../../hooks/redux';
import RemoveUserModal from '../Modals/RemoveUserModal';
import { Link } from 'react-router-dom';
import AddUserToGroupModal2 from '../Modals/AddUserToGroupModal2';

interface TableProps {
    table: User[];
}

const Table: FC<TableProps> = ({table, reqCouner}) => {    
    const [modal, setModal] = useState<boolean>(false);
    const [modal2, setModal2] = useState<boolean>(false);
    const {user} = useAppSelector(state=> state.UserSlice);
    const [userdata, setUserdata] = useState<{user_id: string; email: string}>({user_id: '', email: ''});
    const editHandler = (user) => {
        setUserdata({user_id: user._id, email: user.email});
        setModal(true);
    }
    // const removeHandler = (user) => {
    //     setUserdata({_id: user._id, name: user.name, sname: user.sname, role: user.role, requizits: user.requizits, email: user.email, archive: user.archive});
    //     setModal2(true);
    // }
    return (
        <>
            <div className="p-5 h-[calc(100vh-110px)] overflow-auto">
                {table.map(item=>
                    ((item.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || item.role === 'ADMIN' || item.role === 'TRANER') && user.role === 'ADMIN') ?
                    <>
                    </>
                    :
                    <div className="w-full bg-gradient-top-menu rounded-xl p-3 flex justify-between mb-5">
                        <div className="flex items-center ">
                            <div className="w-12 min-w-[48px] mr-5"><img className='w-full' src={item.avatar} alt="avatar" /></div>
                            <div className="flex flex-col basis-[350px]">
                                <p className='text-xl text-white'>{item.name} {item.sname} <span className='ml-1 text-base bg-white px-2 shadow-lg rounded-full text-red-500'>{item.role}</span></p>
                                <p className='text-xl text-white'>{item.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button className='bg-gradient-button text-lg font-semibold rounded-full w-full py-2 px-5 mr-4' onClick={()=> editHandler(item)}>Назначить группу</button>
                        </div>
                    </div>
                    
                )}
            </div>
            <AddUserToGroupModal2 modal={modal} setModal={setModal} email={userdata.email} user_id={userdata.user_id}/>
        </>
    )
}

export default Table;