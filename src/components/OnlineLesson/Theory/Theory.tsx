import { FC, useState } from 'react'
import Title from '../../UI/Title';
import { IMaterial } from '../../../models/Program/IMaterial';
import {AiOutlineArrowDown} from '@react-icons/all-files/ai/AiOutlineArrowDown'
import {AiOutlineArrowUp} from '@react-icons/all-files/ai/AiOutlineArrowUp'
interface TheoryProps {
    theory: IMaterial;
    rightPanelMode: string,
    setRightPanelMode: (value: string) => void;
    position: string;
}

const Theory: FC<TheoryProps> = ({theory, rightPanelMode, setRightPanelMode, game, setGame, position}) => {
    function safeGameMutate(modify) {
        setGame((g) => {
            const update = { ...g };
            modify(update);
            return update;
        });
    }
    const i = [] as Array<number>;
    const allMoves = [];
    const [current, setCurrent] = useState(0);
    const [currentMove, setCurrentMove] = useState(0);
    const moveHandler = (move) => {
        const indx = allMoves.findIndex(mv=> mv === move);
        if(indx !== -1) {
            const gameCopy = { ...game };
            if(current > indx) {
                
                safeGameMutate((game) => { game.load(position); });
            }

            if(indx === 0) {
                gameCopy.move(allMoves[0]);
            } else {
                const narray = allMoves.slice(0, indx+1);
                narray.map(item=> {
                    gameCopy.move(item);
                })
            }
            setCurrent(indx);
            setCurrentMove(move);
            setGame(gameCopy);
            
        }
    }
    console.log(theory.data.moves);
    return (
        <div className='flex flex-col'>
            <Title name='Теория'/>
            {(rightPanelMode === 'theory' || rightPanelMode === 'none') &&
                <div className="border-2 border-[#CCC] -mt-6 p-5 pt-8 rounded-b-2xl border-t-0 relative">
                    <div className={["overflow-auto", rightPanelMode !== 'theory' ? 'h-[200px] max-2xl:h-[150px]': 'h-[calc(100vh-500px)] max-2xl:h-[calc(100vh-350px)]'].join(' ')}>
                        {theory.data?.gameComment?.comment}
                        {theory.data.moves&&
                            theory.data.moves.length > 0 &&
                            <div className='flex flex-wrap'>
                                {theory.data.moves.map(move=>{
                                    if(move.moveNumber) {
                                        i.push(move.moveNumber);
                                    }
                                    const length = i.filter(mv => mv === move.moveNumber).length;
                                    if(move?.notation?.notation) {
                                        allMoves.push(move?.notation?.notation);
                                    }
                                    return (
                                        <>
                                            {/* {move.turn !== 'b' && move.commentAfter &&
                                                <div className="basis-full bg-gray-200 border-b-2 border-t-2 border-gray-400">{move.commentAfter}</div>
                                            } */}
                                            {(move.moveNumber && length === 1) &&
                                                <div className='basis-[50px] flex'><p className='bg-gray-200 border-r-2 border-r-gray-400 min-w-[50px] p-1 text-center'>{move.moveNumber}</p></div>
                                            }
                                            <div className='basis-[calc(50%-25px)]'>
                                                <button className={['hover:bg-gray-300 w-full p-1', currentMove === move?.notation?.notation && 'bg-blue-400'].join(' ')} onClick={()=> moveHandler(move?.notation?.notation)}>{move?.notation?.notation}</button>
                                            </div>
                                            {move.turn === 'w' && move.commentAfter &&
                                                <div className='basis-[calc(50%-25px)]'>
                                                    <button className={['hover:bg-gray-300 w-full p-1', currentMove === move?.notation?.notation && 'bg-blue-400'].join(' ')} onClick={()=> moveHandler(move?.notation?.notation)}>...</button>
                                                </div>
                                            }
                                            {move.commentAfter &&
                                                <div className="basis-full bg-gray-200 border-b-2 border-t-2 border-gray-400">{move.commentAfter}</div>
                                            }
                                            {(move.turn === 'w' && move.commentAfter && length === 1) &&
                                                <div className='basis-[50px] flex'><p className='bg-gray-200 border-r-2 border-r-gray-400 min-w-[50px] p-1 text-center'>{move.moveNumber}</p></div>
                                            }
                                            {move.turn === 'w' && move.commentAfter &&
                                                <div className='basis-[calc(50%-25px)]'>
                                                    <button className={['hover:bg-gray-300 w-full p-1', currentMove === move?.notation?.notation && 'bg-blue-400'].join(' ')} onClick={()=> moveHandler(move?.notation?.notation)}>...</button>
                                                </div>
                                            }
                                        </>
                                    )
                                    
                                })}
                            </div>
                        }
                        
                    </div>
                    <button onClick={() => setRightPanelMode(rightPanelMode === 'theory' ? 'none' : 'theory')} className="text-green-500 text-5xl absolute bottom-5 right-10">{rightPanelMode === 'theory' ? <AiOutlineArrowUp/> : <AiOutlineArrowDown/>}</button>
                </div>
            }
            
        </div>
    )
}

export default Theory;