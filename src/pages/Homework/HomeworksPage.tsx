import { FC, useEffect } from 'react'
import TopMenu from '../../components/UI/TopMenu/TopMenu';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getHomeworks } from '../../store/reducers/HomeworkSlice';
import Table from '../../components/Homework/Table';

const Homeworks: FC = () => {
    const dispatch = useAppDispatch();
    const { homeworks } = useAppSelector(state=> state.HomeworkSlice)
    useEffect(() => {
        const fetchData = async() => {
            await dispatch(getHomeworks({}))
        }
        void fetchData();
    }, [dispatch])
    return (
        <div className='w-full'>
            <TopMenu/>
            {homeworks.length > 0 &&
                <Table table={homeworks}/>
            }
        </div>
    )
}

export default Homeworks;