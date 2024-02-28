import {FC} from 'react'
import { IGroup } from '../../models/response/IGroup';
import Groups from '../../assets/menu-icons/groups-black.png'
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import { shortestDate } from '../../utils/shortestDate';

interface TableProps {
    table: IGroup[];
}

const Table: FC<TableProps> = ({table}) => {    
    
    return (
        <div className="p-5">
            {table.map((item, index)=> {
                index++;
                return (
                    <div className={["w-full rounded-xl p-3 flex justify-between mb-5", index === 1 ? 'bg-green-600': 'bg-gradient-top-menu'].join(' ')}>
                        <div className="flex">
                            <div className="flex text-xl font-bold flex-col items-center justify-center bg-gradient-button rounded-xl px-3 mr-10">
                                {item.date &&
                                    <>
                                        <p className='text-[#8A6E3E]'>{format(shortestDate(item.date), 'd MMM')}</p>
                                        <p className='text-[#624e2c]'>{item.time}</p>
                                    </>
                                }
                            </div>
                            <div className="flex flex-col">
                                <p className='text-2xl text-white mb-3'>{item.name}</p>
                                <div className="flex">
                                    <p className='text-xl text-white mr-5'>Участники: {item.users.length}</p>
                                    <Link to={'/lesson/'+item._id} className='bg-gradient-button rounded-full px-4 text-lg font-semibold'>Перейти к уроку</Link>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center max-w-[300px] border-l-4 border-l-[#B7975A] pl-5">
                            <p className='text-white text-2xl font-bold'>{item.name} {item.level}</p>
                        </div>
                    </div>
                )
                
            })}
        </div>
    )
}

export default Table;