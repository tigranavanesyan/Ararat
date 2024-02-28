import { FC, useState, useEffect } from 'react'
import TopMenu from '../../components/UI/TopMenu/TopMenu';
import { ITopMenu } from '../../models/ITopMenu';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getHomeworks } from '../../store/reducers/HomeworkSlice';
import { useParams } from 'react-router-dom';
import { getGroup } from '../../store/reducers/GroupSlice';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import SelectHomeWorkModal from '../../components/Modals/SelectHomeWorkModal';

const HomeworksCheckPage: FC = () => {
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
    const { homeworks } = useAppSelector(state=> state.HomeworkSlice);
    const { group } = useAppSelector(state=> state.GroupSlice)
    useEffect(() => {
        const fetchData = async() => {
            await dispatch(getHomeworks({group_id: groupId}))
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
                <div className="flex flex-col w-full overflow-auto max-h-[calc(100vh-180px)]">
                    {homeworks &&
                        homeworks.map(item=>
                            <div key={item._id} className={['w-full rounded-xl p-3 flex justify-between mb-5', new Date() >= new Date(item.end) ? 'bg-green-600' : 'bg-gradient-top-menu'].join(' ')}>
                                <div className="flex">
                                    {item.lesson &&
                                        <div className="flex text-xl font-bold flex-col items-center justify-center bg-gradient-button rounded-xl px-3 mr-10">
                                            <p className='text-[#8A6E3E]'>Дата урока: {format(new Date(item.lesson), 'd MMM')}</p>
                                        </div>
                                    }
                                    <div className="flex text-xl font-bold flex-col items-center justify-center bg-gradient-button rounded-xl px-3 mr-10">
                                        <p className='text-[#8A6E3E]'>Срок до: {format(new Date(item.end), 'd MMM')}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className='text-2xl text-white mb-3'>Домашнее задание</p>
                                        <div className="flex">
                                            {groupId &&
                                                <>
                                                    <Link to={'/group/'+groupId+'/homework/'+item._id} className='bg-gradient-button mr-5 rounded-full px-4 text-lg font-semibold'>Посмотреть ответы учеников</Link>
                                                    <Link to={'/group/'+groupId+'/homework/edit/'+item._id} className='bg-gradient-button rounded-full px-4 text-lg font-semibold'>Посмотреть дз</Link>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center max-w-[300px] border-l-4 border-l-[#B7975A] pl-5">
                                    
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default HomeworksCheckPage;