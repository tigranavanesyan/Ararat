import {FC, useState} from 'react'
import { ILog } from '../../models/response/Ilog';
import { useAppSelector } from '../../hooks/redux';
import format from 'date-fns/format';

interface TableArchiveProps {
    table: ILog[];
}

const TableArchive: FC<TableArchiveProps> = ({table}) => {    
    const {user} = useAppSelector(state=> state.UserSlice);

    return (
        <>
            <div className="p-5 h-[calc(100vh-110px)] overflow-auto">
                <div className="w-full bg-gradient-top-menu rounded-xl p-3 flex justify-between mb-5">
                    <div className="flex items-center w-full text-center font-bold">
                        <div className="flex flex-col basis-[30%]">
                            <p className='text-xl text-white'>Исполнитель</p>
                        </div>
                        <div className="flex flex-col basis-[40%]">
                            <p className='text-xl text-white'>Цель</p>
                        </div>
                        <div className="flex flex-col basis-[30%]">
                            <p className='text-xl text-white'>Действие</p>
                        </div>
                        <div className="flex flex-col basis-[30%]">
                            <p className='text-xl text-white'>Дата</p>
                        </div>
                    </div>
                </div>
                {table.map(item=>
                    <div className="w-full bg-gradient-top-menu rounded-xl p-3 flex justify-between mb-5">
                        <div className="flex items-center w-full text-center">
                            <div className="flex flex-col basis-[30%]">
                                <p className='text-xl text-white'>{item.executer.name} {item.executer.sname}</p>
                            </div>
                            <div className="flex flex-col basis-[40%]">
                                <p className='text-xl text-white'>{item.to.name} {item.to.sname}</p>
                            </div>
                            <div className="flex flex-col basis-[30%]">
                                <p className='text-xl text-white'>{item.type === 'adduser' && 'Добавление пользователя'}</p>
                            </div>
                            <div className="flex flex-col basis-[30%]">
                                <p className='text-xl text-white'>{format(new Date(item.date), 'dd.MM.Y')}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default TableArchive;