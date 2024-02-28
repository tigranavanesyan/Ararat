import { FC, useState } from 'react'
import { IGroup } from '../../../models/response/IGroup';
import Groups from '../../../assets/menu-icons/groups-black.png'
import { Link } from 'react-router-dom';
import HomeworkService from '../../../services/HomeworkService';
import { useAppSelector } from '../../../hooks/redux';
import { useParams } from 'react-router-dom';
import SuccessModal from '../../Modals/SuccessModal';
import MainButton from '../../UI/MainButton';
import { useNavigate } from 'react-router-dom';

interface TableProps {
    table: IGroup;
    homework: string
}

const Table: FC<TableProps> = ({table, homework}) => {
    const {homeworks} = useAppSelector(state=> state.HomeworkSlice)
    const {groupId, homeworkId} = useParams();
    const navigate = useNavigate();
    const [modal, setModal] = useState<boolean>(false);
    const toOnlineHandler = async () => {
        if(homework) {
            await HomeworkService.toLessonHomework(homework).then(()=> setModal(true));
        }
        else if(homeworkId) {
            await HomeworkService.toLessonHomework(homeworkId).then(()=> setModal(true));
        }
    }
    return (
        <div className="p-5 w-full">
            <button className='bg-gradient-button text-lg px-3 py-3 rounded-full w-full mb-5' onClick={()=> void toOnlineHandler()}>Перенести все в онлайн урок</button>
            <div className={'overflow-auto ' + homework ? 'max-h-[calc(100vh-400px)]' : 'h-[calc(100vh-300px)]'}>
                <table className='w-full bg-[#f0f0f0] rounded-xl border-collapse '>
                    <tbody>
                        {table.users &&
                            table.users.map(item=>
                                ( item.role === 'STUDENT') &&
                                <tr key={item._id} className='border-b-2 border-b-[#C4C4C4]'>
                                    <td className='w-14 py-5 pl-2'><div className="w-11"><img className='w-full' src={Groups} alt="ico" /></div></td>
                                    <td className='w-[500px]'>{item.name} {item.sname}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            <SuccessModal modal={modal} setModal={setModal} message='Дз успешно добавленно в онлайн урок' noclosable={true}>
                {homework
                ?
                    <MainButton className='mt-5' onClick={()=> setModal(false)}>Ок</MainButton>
                :
                    <MainButton className='mt-5' onClick={()=> groupId && navigate('/group/'+groupId+'/online-lesson')}>Перейти к уроку</MainButton> 
                }
            </SuccessModal>
        </div>
    )
}

export default Table;