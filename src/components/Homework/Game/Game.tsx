import { FC, useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'
import {AiOutlineArrowUp} from '@react-icons/all-files/ai/AiOutlineArrowUp'
import {AiOutlineArrowDown} from '@react-icons/all-files/ai/AiOutlineArrowDown'
import { useAppSelector } from '../../../hooks/redux';
import User from './User'
import Title from '../../UI/Title';

interface GameProps {
    moves: Array<{ id: string; user_id: string, name: string; sname: string; moves: Array<{color: string, move: string}>;}>;
    rightPanelMode: string,
    setRightPanelMode: (value: string) => void;
    position?: string;
    materialId?: string;
}

const Game: FC<GameProps> = ({ rightPanelMode, cgame, setGame, position, materialId }) => {

    const { game } = useAppSelector(state=> state.HomeworkSlice);

    return (
        <div className='flex flex-col'>

                <Title name='Ходы'/>
                {(rightPanelMode === 'game' || rightPanelMode === 'none') &&
                    <div className='relative border-2 border-[#CCC] -mt-8 pl-5 p-5 pt-14 rounded-b-2xl border-t-0'>
                        <div className={["flex flex-col overflow-auto h-[calc(100vh-270px)]"].join(' ')}>
                            <div>
                                {game.map(move=> {
                                    return (
                                        <User materialId={materialId} game={cgame} setGame={setGame} position={position} move={move}/>
                                    )
                                    })}
                            </div>
                        </div>
                    </div>
                }

        </div>
    )
}

export default Game;