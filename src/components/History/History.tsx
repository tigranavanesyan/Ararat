import { FC, Fragment } from 'react'
import { Tab } from '@headlessui/react'
import MainButton from '../UI/MainButton'
import { IGroup } from '../../models/response/IGroup'
import { Chessboard } from 'react-chessboard'

interface HistoryProps {
    group: IGroup;
}

const History: FC<HistoryProps> = ({group}) => {
    return (
        <div className='bg-[#f0f0f0] mx-5 -my-2 rounded-xl overflow-hidden'>
            <Tab.Group>
                <Tab.List as='div' className='bg-[#dadada] p-4'>
                    <div className="flex justify-between w-[1300px] mx-auto">
                        <Tab><MainButton>Посещаемые ученики</MainButton></Tab>
                        <Tab><MainButton>Таблица лидеров</MainButton></Tab>
                        <Tab><MainButton>Классные материалы</MainButton></Tab>
                        <Tab><MainButton>Примечания</MainButton></Tab>
                    </div>
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel as='div' className='flex flex-wrap w-[1300px] mx-auto  py-5'>
                        {group.users.map(user=>
                            <div className="basis-1/2"><p className='border-2 mx-5 my-3 rounded-full py-5 px-10 text-xl font-bold text-green-500 border-green-500'>{user.name} {user.sname}</p></div>    
                        )}
                    </Tab.Panel>
                    <Tab.Panel>Content 2</Tab.Panel>
                    <Tab.Panel as='div' className='overflow-auto h-[calc(100vh-510px)] w-[1300px] mx-auto py-5'>
                        <div className="flex flex-wrap w-full">
                            {group.program.map(item=>
                                <div className="basis-[calc(25%-10px)] mb-3">
                                    <div className="mx-2"><Chessboard position={item.data.tags.FEN}/></div>
                                </div>
                            )}
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>Content 4</Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    )
}

export default History;