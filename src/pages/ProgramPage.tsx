import { FC, useState, useEffect } from 'react'
import TopMenu from '../components/UI/TopMenu/TopMenu';
import { ITopMenu } from '../models/ITopMenu';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getGroups } from '../store/reducers/GroupSlice';
import Filter from '../components/Program/Filter';
import Themes from '../components/Program/Themes';
import Materials from '../components/Program/Materials';
import { getThemes } from '../store/reducers/ProgramSlice';
import { useParams } from 'react-router-dom';

const ProgramPage: FC = () => {
    const { groupId } = useParams();
    const [menu] = useState<ITopMenu[]>(
    groupId ?
    [ 
        {id: 0, name: 'Программа'},
        {id: 1, name: 'Онлайн урок', path: `/group/${groupId}/online-lesson`}, // eslint-disable-line @typescript-eslint/restrict-template-expressions,
        {id: 2, name: 'Домашнее\nзадание', path: `/group/${groupId}/homework`}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
        {id: 3, name: 'Ученики'},
        {id: 4, name: 'Описание группы'},
        {id: 5, name: 'История', path: `/group/${groupId}/history`}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
    ]
    :
    [])
    const dispatch = useAppDispatch();
    useEffect(() => {
        const fetchData = async() => {
            await dispatch(getThemes({}))
        }
        void fetchData();
    }, [dispatch])
    
    return (
        <div className='w-full flex flex-col'>
            <TopMenu menu={menu}/>
            <div className="flex  flex-col bg-[#F0F0F0] rounded-3xl mx-[90px] max-2xl:mx-[30px] my-[20px]">
                <Filter />
                <div className="flex justify-between px-5 py-3">
                    <Themes />
                    <Materials />
                </div>
            </div>
        </div>
    )
}

export default ProgramPage;