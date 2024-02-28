import { FC, useEffect } from 'react'
import TopMenu from '../../components/UI/TopMenu/TopMenu';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getGroups } from '../../store/reducers/GroupSlice';
import Table from '../../components/Lessons/Table';

const Lessons: FC = () => {
    const dispatch = useAppDispatch();
    const { groups } = useAppSelector(state=> state.GroupSlice)
    useEffect(() => {
        const fetchData = async() => {
            await dispatch(getGroups({}))
        }
        void fetchData();
    }, [dispatch])
    return (
        <div className='w-full'>
            <TopMenu/>
            {groups.length > 0 &&
                <Table table={groups}/>
            }
        </div>
    )
}

export default Lessons;