import { FC, useState, useEffect } from 'react'
import { IMove } from '../../../models/MyGroups/IMove';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import {BsPlusLg} from '@react-icons/all-files/bs/BsPlusLg'
import {BsUiChecksGrid} from '@react-icons/all-files/bs/BsUiChecksGrid'
import { clearUserMoves, clearFullUserMoves, setMovesState } from '../../../store/reducers/HomeworkSlice';
import HomeworkService from '../../../services/HomeworkService';
import { useParams } from 'react-router-dom';

interface UserProps {
    move: IMove;
    position?: string;
    materialId?: string;
}

const User: FC<UserProps> = ({move, game, setGame, position, materialId}) => {
    let i = 0;
    const [turn, setTurn] = useState<string>('');
    const { user } = useAppSelector(state=> state.UserSlice);
    const homework = useAppSelector(state=> state.HomeworkSlice);
    const dispatch = useAppDispatch();
    const { groupId } = useParams();
    useEffect(() => {
        setTurn(game.turn());
    }, [position])

    function safeGameMutate(modify) {
        setGame((g) => {
            const update = { ...g };
            modify(update);
            return update;
        });
    }

    const removeMovesHandler = async () => {
        safeGameMutate((game) => { game.load(position);});
        if(groupId) {
            if(homework.game[0].moves.length > 0) {
                await HomeworkService.editHomework(groupId, {material: materialId, deleted: {user_id: user._id, moves: [homework.game[0].moves]}});
            }
        }
            dispatch(clearUserMoves(user._id));
    }

    const makeMainVariant = async (item) => {
        dispatch(clearFullUserMoves(user._id));
        const gameCopy = { ...game };
        gameCopy.load(position);
        item.map(move=> {
            gameCopy.move(move.move);
            dispatch(setMovesState({user_id: user._id, name: user.name, sname: user.sname, color: move.color, move: move.move}));
        })
        setGame(gameCopy);
        if(groupId) {
            await HomeworkService.editHomework(groupId, {material: materialId, deleted: {user_id: user._id, moves: [homework.game[0].moves]}, move: {user_id: user._id, name: user.name, sname: user.sname, moves: [...item]}, movesHistory: game.history()});
        }
        
    }

    return (
        <div key={move.id} className="mb-1">
            <p className='font-bold flex flex-wrap text-lg break-words text-[#353535] relative'>
                <span className='text-[#8A6E3E] mr-2'>{move.name} {move.sname}: </span> 
                {move.deleted &&
                    <>
                    {move.deleted.map((item)=>{
                        let i = 0;
                        return (
                            <>
                                <div className="flex flex-wrap "><p className='text-sm bg-apricot mt-1 rounded-lg py-[1px] mr-2 mb0'>Прошлый вариант:</p>
                                    {
                                        item.map(move=> {
                                            move.color === 'w' && i++;
                                            return (
                                                <p className={['mr-1 mt-1 text-sm rounded-lg px-1 py-[1px] bg-apricot line-through'].join(' ')}>{move.color === 'w' && i.toString() + '. '}{move.move}</p>
                                            )
                                        })
                                    }
                                </div> 
                                <button onClick={()=> makeMainVariant(item)} title='Сделать вариант основным' className="bg-green-400 cursor-pointer ml-2 w-6 h-6 p-[1px] text-base mt-1 rounded-md flex justify-center items-center text-white"><BsUiChecksGrid/></button>
                                <div className="basis-full"></div>
                            </>
                        )
                    })}
                    <div className="basis-full"></div>
                    </>
                }
                {[0].map(()=> {
                    if(turn === 'b') {
                        i++
                        return (
                            <p className={['mr-1 mt-1 rounded-lg px-2 py-[1px'].join(' ')}>{i.toString() + '. '}...</p>
                        )
                    }
                })}
                {move.moves.map((move)=> {
                    move.color === 'w' && i++;
                    return (
                        <p className={['mr-1 mt-1 rounded-lg px-2 py-[1px]', move.color === 'w' ? '' : 'bg-gradient-button shadow-md'].join(' ')}>{move.color === 'w' && i.toString() + '. '}{move.move}</p>
                    )
                })}
                <button onClick={()=> removeMovesHandler()} title='Добавить новый варинат' className="bg-orange-400 cursor-pointer ml-3 w-7 h-7 p-1 mt-1 rounded-md flex justify-center items-center text-white text-2xl"><BsPlusLg/></button>
            </p>
        </div>
    )
}

export default User;