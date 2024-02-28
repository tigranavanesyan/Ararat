import { FC, useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'
import {AiOutlineArrowUp} from '@react-icons/all-files/ai/AiOutlineArrowUp'
import {AiOutlineArrowDown} from '@react-icons/all-files/ai/AiOutlineArrowDown'
import {MdDeleteSweep} from '@react-icons/all-files/md/MdDeleteSweep'

import { useAppSelector } from '../../../hooks/redux';
import User from './User'

interface GameProps {
    moves: Array<{ id: string; user_id: string, name: string; sname: string; moves: Array<{color: string, move: string}>;}>;
    rightPanelMode: string,
    setRightPanelMode: (value: string) => void;
    moveMode: boolean,
    position?: string;
    materialId: string;
}

const Game: FC<GameProps> = ({moves, rightPanelMode, setRightPanelMode, moveMode, cgame, setGame, position, materialId}) => {

    const { game } = useAppSelector(state=> state.GroupSlice);
    const { user } = useAppSelector(state=> state.UserSlice);
    const [allClose, setAllClose] = useState<boolean>(false);

    return (
        <div className='flex flex-col'>
            <Tab.Group>
                <Tab.List as='div' className='pl-16 bg-[#e8e1d3] px-3 py-2 rounded-full flex justify-between h-16 z-10'>
                    <Tab className='mr-4 rounded-full bg-gradient-button w-full px-4 py-3 text-base font-semibold flex justify-center items-center'>Ходы</Tab>
                    <Tab className='mr-4 rounded-full bg-gradient-button w-full px-4 py-2 text-base font-semibold flex justify-center items-center'>Таблица лидеров</Tab>
                    <Tab className='rounded-full bg-gradient-button w-full px-4 py-3 text-lg font-base flex justify-center items-center'>Участники</Tab>
                </Tab.List>
                {(rightPanelMode === 'game' || rightPanelMode === 'none') &&
                    <Tab.Panels as='div' className='relative border-2 border-[#CCC] -mt-8 pl-3 p-5 pt-14 rounded-b-2xl border-t-0'>
                    <div className={["flex flex-col overflow-auto", rightPanelMode !== 'game' ? 'h-[250px] max-2xl:h-[100px]': 'h-[calc(100vh-500px)] max-2xl:h-[calc(100vh-350px)]'].join(' ')}>
                        <Tab.Panel>
                            <button onClick={()=> {setAllClose(allClose ? false : true); setRightPanelMode('game')}} title='Закрыть удаленные ходы всех учеников' className='cursor-pointer absolute z-10 right-4 text-xl bg-gray-200 p-1 rounded-md text-green-600'><MdDeleteSweep/></button>
                            {game.map(move=> {
                                const i = 0;
                                return (
                                    <>
                                        {user.role !== 'STUDENT'
                                        ?
                                            <User materialId={materialId} allClose={allClose} setAllClose={setAllClose} game={cgame} setGame={setGame} position={position} moveMode={moveMode} key={move.id} move={move} i={i}/>
                                        :
                                            user._id === move.user_id &&
                                            <User materialId={materialId} allClose={allClose} setAllClose={setAllClose} game={cgame} setGame={setGame} position={position} moveMode={moveMode} key={move.id} move={move} i={i}/>
                                        }
                                    </>
                                )
                            })}
                        </Tab.Panel>
                        <Tab.Panel>Content 2</Tab.Panel>
                        <Tab.Panel>Content 3</Tab.Panel>
                        <button onClick={() => setRightPanelMode(rightPanelMode === 'game' ? 'none' : 'game')} className="text-green-500 text-5xl absolute -top-5 z-10 left-2">{rightPanelMode === 'game' ? <AiOutlineArrowDown/> : <AiOutlineArrowUp/>}</button>
                    </div>
                </Tab.Panels>
                }
            </Tab.Group>
        </div>
    )
}

export default Game;