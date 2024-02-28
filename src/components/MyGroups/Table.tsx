/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { FC, useState } from 'react'
import { IGroup } from '../../models/response/IGroup';
import Groups from '../../assets/menu-icons/groups-black.png'
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { AiOutlinePlus } from '@react-icons/all-files/ai/AiOutlinePlus'
import CreateFullGroupModal from '../Modals/CreateFullGroupModal';
import { BiArchiveIn } from '@react-icons/all-files/bi/BiArchiveIn'
import { BiArchiveOut } from '@react-icons/all-files/bi/BiArchiveOut'
import { BsTrash } from '@react-icons/all-files/bs/BsTrash'
import ArchiveRemoveGroupModal from '../Modals/ArchiveRemoveGroupModal';
import { searchGroups } from '../../store/reducers/GroupSlice';
import debounce from "lodash.debounce";
import Input from '../UI/Input';

interface TableProps {
    table: IGroup[];
    fetchData: (archive: boolean) => void;
}

const Table: FC<TableProps> = ({table, fetchData}) => {
    const [ modal, setModal ] = useState<boolean>(false);
    const [ modal2, setModal2 ] = useState<boolean>(false);
    const [groupInfo, setGroupInfo] = useState<{_id: string, name: string}>({_id: '', name: ''})
    const [action, setAction] = useState<string>('');
    const {user} = useAppSelector(state=> state.UserSlice);
    const [during, setDuring] = useState<boolean>(true);
    const dispatch = useAppDispatch();
    const searchHandler = async(e) => {
         dispatch(searchGroups(e.target.value));
    }
    return (
        <div className="p-5 overflow-auto max-h-[calc(100vh-100px)]">
            <table className='w-full bg-[#f0f0f0] rounded-xl overflow-hidden border-collapse'>
                <tbody>
                    {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'ADMIN') &&
                        <tr className='border-b-2 border-b-[#C4C4C4] relative'>
                            <td className="py-5 relative"><button onClick={()=> setModal(true)} className='p-3 absolute -bottom-2 flex items-center text-lg whitespace-nowrap'><span className='mr-2 bg-gradient-button w-8 h-8 flex justify-center items-center rounded-full shadow-lg text-xl'><AiOutlinePlus/></span>Добавить группу</button></td>
                            <td>
                                <div className="flex items-center absolute bottom-[2px] right-5">
                                    <Input type="text" className='!py-1' wrapperClasses='mr-4' w placeholder='Поиск...' onChange={debounce(e=>searchHandler(e), 500)}/>
                                    <button onClick={() => {fetchData(false), setDuring(true)}} className={['mr-10 text-xl font-medium hover:text-[rgb(240,195,177)]', during && 'text-[rgb(240,195,177)]'].join(' ')} >Текущие</button>
                                    <button onClick={() => {fetchData(true), setDuring(false)}} className={['text-xl font-medium hover:text-[rgb(240,195,177)]', !during && 'text-[rgb(240,195,177)]'].join(' ')}>Архивированные</button>
                                </div>
                            </td>
                        </tr>
                    }
                    {table.length > 0 &&
                        table.map(item=>
                            <tr key={item._id} className='border-b-2 border-b-[#C4C4C4]'>
                                <td className='w-14 py-5 pl-2'><div className="w-11"><img className='w-full' src={Groups} alt="ico" /></div></td>
                                <td className='w-[500px]'><Link to={'/group/'+item._id} className='font-bold'>{item.name}</Link></td>
                                <td className='w-[410px]'><p>{item.level}</p></td>
                                <td className=''><p className='text-bold'>{item.users.filter(user => user.role === 'STUDENT').length} / 6</p></td>
                                <td className='text-center'><p className='text-bold'>{format(new Date(item.start), 'd MMM H:mm')}</p></td>
                                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'ADMIN') &&
                                    <td className='text-center'>
                                        <button title={item.archive ? 'Unarchive' : 'Archive'} onClick={()=> {setAction(item.archive ? 'unarchive' : 'archive'); setModal2(true); setGroupInfo({_id: item._id, name: item.name})}} className='text-red-600 text-xl'>{item.archive ? <BiArchiveOut/> : <BiArchiveIn/>}</button>
                                        {((user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') && item.archive) &&
                                            <button onClick={()=> {setAction('remove'); setModal2(true); setGroupInfo({_id: item._id, name: item.name})}} title='Remove' className='ml-5 text-red-600 text-xl'><BsTrash/></button>
                                        }
                                    </td>
                                }
                            </tr>
                        )
                    }
                </tbody>
            </table>
            <CreateFullGroupModal modal={modal} setModal={setModal}/>
            {modal2 &&
                <ArchiveRemoveGroupModal modal={modal2} setModal={setModal2} groupInfo={groupInfo} action={action}/>
            }
        </div>
    )
}

export default Table;