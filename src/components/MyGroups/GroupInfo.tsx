import { FC, useState, useEffect } from 'react'
import { useBasePath } from '../../hooks/useBasePath';
import { useAppSelector } from '../../hooks/redux';
import { AiOutlineEdit } from '@react-icons/all-files/ai/AiOutlineEdit'
import EditGroupDescriptionModal from '../Modals/EditGroupDescriptionModal';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { getGroup } from '../../store/reducers/GroupSlice';
import EditGroupTitleModal from '../Modals/EditGroupTitleModal';
import GroupService from '../../services/GroupService';
import SuccessModal from '../Modals/SuccessModal';
import MainButton from '../UI/MainButton';
import OpenGroupModal from '../Modals/OpenGroupModal';
import CreateFullGroupModal from '../Modals/CreateFullGroupModal';

const GroupInfo:FC<{openChat: (bool: boolean) => void; chat?: boolean}> = ({openChat, chat}) => {
    const path = useBasePath();
    const navigate = useNavigate();
    const { user } = useAppSelector(state=> state.UserSlice);
    const { group } = useAppSelector(state=> state.GroupSlice);
    const [modal, setModal] = useState<boolean>(false);
    const [modal2, setModal2] = useState<boolean>(false);
    const [modal3, setModal3] = useState<boolean>(false);
    const [modal4, setModal4] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [close, setClose] = useState<boolean>(false);
    const { groupId } = useParams();
    const dispatch = useAppDispatch();
    useEffect(() => {
        const fetchData = async() => {
            if(groupId) {
                await dispatch(getGroup(groupId));
            }
        }
        void fetchData();
    }, [dispatch])  // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className='m-5 p-5 bg-[#f0f0f0] rounded-xl flex justify-between'>
            <div className="">
                <ul className='flex flex-wrap w-[730px]'>
                {group.users &&
                    group.users.map(user=>
                        (user.role !== 'TRANER' && user.role !== 'ADMIN' && user.role !== 'DIRECTOR' && user.role !== 'ZDIRECTOR') &&
                        <li key={user._id} className='mb-3 mr-3 border-2 border-[#C4C4C4] rounded-full flex justify-center items-center text-2xl font-semibold py-2 basis-[calc(50%-15px)]'>{user.name} {user.sname}</li>
                    )
                }
                </ul>
            </div>
            <div className="flex flex-col items-end">
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'ADMIN')
                ?
                    <button onClick={()=> setModal2(true)} className='bg-gradient-button p-3 text-2xl font-semibold rounded-full py-4 px-12 mb-5 flex items-center'>{group.name}<AiOutlineEdit className='ml-3'/></button>
                :
                    <div className='bg-gradient-button text-2xl font-semibold rounded-full py-4 px-12 mb-5'>{group.name}</div>
                }
                
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'ADMIN' || user.role === 'TRANER') &&
                    <button onClick={()=> setModal(true)} className='bg-gradient-button text-2xl font-semibold rounded-full py-4 px-12 mb-5 flex items-center'>Описание группы<AiOutlineEdit className='ml-3'/></button>
                }
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'ADMIN') &&
                    <button className='bg-gradient-button text-2xl font-semibold rounded-full py-4 px-12' onClick={() => void setModal4(true)}>Добавить ученика</button>
                }
                {path === '/group' &&
                    !chat &&
                    <button className='mt-5 bg-gradient-button text-2xl font-semibold rounded-full py-4 px-12' onClick={() => void openChat(true)}>Открыть чат группы</button>
                }
            </div>
            {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'ADMIN' || user.role === 'TRANER') &&
                <EditGroupDescriptionModal modal={modal} setModal={setModal}/>
            }
            {((user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'ADMIN') && modal2) &&
                <CreateFullGroupModal modal={modal2} setModal={setModal2} edit={true}/>
            }
            <SuccessModal modal={modal3} setModal={setModal3} message={message}>
                {close &&
                    <MainButton className='mt-5' onClick={()=> groupId && navigate('/group/'+groupId+'/homework/add')}>Отправить дз</MainButton>
                }
            </SuccessModal>
            <OpenGroupModal modal={modal4} setModal={setModal4}/>
        </div>
    )
}

export default GroupInfo;