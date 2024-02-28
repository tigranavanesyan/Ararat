import {FC} from 'react'
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import { IHomework } from '../../models/IHomwork';
import { useAppSelector } from '../../hooks/redux';

interface TableProps {
    table: IHomework[];
}

const Table: FC<TableProps> = ({table}) => {
    const {user} = useAppSelector(state=> state.UserSlice)
    return (
        <div className="p-5">
            <div className="overflow-auto max-h-[calc(100vh-180px)]">
                {table.map(item=>
                    <div key={item._id} className={["w-full rounded-xl p-3 flex justify-between mb-5", item.completed?.includes(user._id) ? 'bg-green-600' : 'bg-gradient-top-menu',  (item.results?.find(itm=> itm.user_id === user._id)?.results.filter(res=> res.result === 'passed').length !== item.program.length && item.results?.length > 0) ? '!bg-blue-500' : 'bg-green-600'].join(' ')}>
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
                                    <Link to={'/homework/'+item._id} className='bg-gradient-button rounded-full px-4 text-lg font-semibold'>Выполнить задание</Link>
                                </div>
                            </div>
                            <div className='flex min-w-[40px] h-[40px] mt-[1px] ml-5 justify-center font-semibold text-2xl text-black bg-apricot rounded-full items-center'>{item?.program?.length}</div>
                        </div>
                        <div className="flex justify-center items-center max-w-[300px] border-l-4 border-l-[#B7975A] pl-5">
                            
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Table;