import { FC, useState, useEffect, useLayoutEffect } from 'react'
import { IMove } from '../../../models/MyGroups/IMove';
import Switch from '../../UI/Switch'
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { GroupGlobalModeSocket } from '../../../sockets/GroupSockets';
import { useParams } from 'react-router-dom';
import { clearUserMoves } from '../../../store/reducers/GroupSlice';
import { MdOutlineDeleteOutline } from '@react-icons/all-files/md/MdOutlineDeleteOutline'
import { BsChevronUp } from '@react-icons/all-files/bs/BsChevronUp'
import { BsChevronDown } from '@react-icons/all-files/bs/BsChevronDown'
import { GroupUserCleanSocket } from '../../../sockets/GroupSockets';
import { render } from 'react-dom';
import { Disclosure } from '@headlessui/react'
import GroupService from '../../../services/GroupService';
import Star from '../../../assets/pawns/Star.svg'
import Bb from '../../../assets/pawns/Bb.svg'
import Bk from '../../../assets/pawns/Bk.svg'
import Bn from '../../../assets/pawns/Bn.svg'
import Bp from '../../../assets/pawns/Bp.svg'
import Br from '../../../assets/pawns/Br.svg'
import Bq from '../../../assets/pawns/Bq.svg'
import Wb from '../../../assets/pawns/Wb.svg'
import Wk from '../../../assets/pawns/Wk.svg'
import Wn from '../../../assets/pawns/Wn.svg'
import Wp from '../../../assets/pawns/Wp.svg'
import Wq from '../../../assets/pawns/Wq.svg'
import Wr from '../../../assets/pawns/Wr.svg'

interface UserProps {
    move: IMove;
    i: number;
    moveMode: boolean;
    position?: string;
    allClose: boolean;
    setAllClose: (bool: boolean) => void;
    materialId: string;
}

const User: FC<UserProps> = ({ move, moveMode, game, setGame, position, allClose, setAllClose, materialId }) => {
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<boolean>(false);
    const { groupId } = useParams();
    const { user } = useAppSelector(state => state.UserSlice)
    const group = useAppSelector(state => state.GroupSlice)
    const setValueHandler = (bool: boolean) => {
        setValue(bool);
        if (groupId) {
            GroupGlobalModeSocket({ room: groupId, user_id: move.user_id, bool: bool });
        }
    }
    function safeGameMutate(modify) {
        setGame((g) => {
            const update = { ...g };
            modify(update);
            return update;
        });
    }
    const removeMovesHandler = async (user_id: string) => {
        if (groupId) {
            if (user_id === user._id) {
                safeGameMutate((game) => { game.load(position); });
            }
            dispatch(clearUserMoves(user_id));
            GroupUserCleanSocket({ room: groupId, user_id: user_id });

            const moves = group.game.find(item => item.user_id === user_id)?.moves;
            if (moves) {
                if (moves?.length > 0) {
                    await GroupService.editGroup(groupId, { open: true, material: materialId, deleted: { user_id: user_id, moves: [moves] } });
                }
            }
        }
    }

    const [turn, setTurn] = useState<string>('');

    let i = 0;
    useEffect(() => {
        setTurn(game.turn());
    }, [position])



    return (
        <div key={move.id} className="mb-1">
            <p className='font-bold flex flex-wrap text-lg break-words text-[#353535] relative pl-16'>
                {user.role !== 'STUDENT' &&
                    <Switch value={value} onChange={setValueHandler} className='border-none absolute left-0 top-1' />
                }
                <span className='text-[#8A6E3E] mr-2'>{move.name} {move.sname}: </span>
                {move.deleted &&
                    <>
                        <Disclosure defaultOpen={true}>
                            {({ open, close }) => {
                                useEffect(() => {
                                    if (allClose === true) {
                                        close()
                                        setAllClose(false);
                                    }
                                }, [allClose]);
                                return (
                                    /* Use the `open` state to conditionally change the direction of an icon. */
                                    <>
                                        <Disclosure.Button>
                                            <p className='flex text-base items-center'>Удаленные ходы {open ? <BsChevronUp className='ml-1' /> : <BsChevronDown className='ml-1' />}</p>
                                        </Disclosure.Button>
                                        <div className="basis-full"></div>
                                        <Disclosure.Panel>
                                            {move.deleted.map((item) => {
                                                let i = 0;
                                                return (
                                                    <>
                                                        <div className="flex flex-wrap "><p className='text-sm bg-apricot mt-1 rounded-lg py-[1px] mr-2'>Удалено:</p>
                                                            {
                                                                item.map(move => {
                                                                    move.color === 'w' && i++;
                                                                    return (
                                                                        <p className={['mr-1 mt-1 text-sm rounded-lg px-1 py-[1px] bg-apricot line-through'].join(' ')}>{move.color === 'w' && i.toString() + '. '}{move.move}</p>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                        <div className="basis-full"></div>
                                                    </>
                                                )
                                            })}
                                        </Disclosure.Panel>
                                    </>
                                )
                            }}
                        </Disclosure>

                        <div className="basis-full"></div>
                    </>
                }


                {[0].map(() => {
                    if (turn === 'b' && move.moves[0]?.color !== 'w') {
                        i++
                        return (
                            <p className={['mr-1 mt-1 text-sm rounded-lg px-1 py-[1px]'].join(' ')}>{i.toString() + '. '}...</p>
                        )
                    }
                })}

                {move.moves.map((move) => {

                    move.color === 'w' && i++;

                    return (
                        <p className={['flex mr-1 mt-1 text-sm rounded-lg px-1 py-[1px]', move.color === 'w' ? '' : 'bg-gradient-button shadow-md', move.deleted && '!bg-gray-500'].join(' ')}>
                            {move.color === 'w' && i.toString() + '. '}
                            {move.color === 'w' ? move.move.substring(0, 1) === 'B' && <img src={Wb} width={17} height={12} />
                                : move.move.substring(0, 1) === 'B' && <img src={Bb} width={17} height={12} />}
                            {move.color === 'w' ? move.move.substring(0, 1) === 'Q' && <img src={Wq} width={17} height={12} />
                                : move.move.substring(0, 1) === 'Q' && <img src={Bq} width={17} height={12} />}
                            {move.color === 'w' ? move.move.substring(0, 1) === 'N' && <img src={Wn} width={17} height={12} />
                                : move.move.substring(0, 1) === 'N' && <img src={Bn} width={17} height={12} />}
                            {move.color === 'w' ? move.move.substring(0, 1) === 'K' && <img src={Wk} width={17} height={12} />
                                : move.move.substring(0, 1) === 'K' && <img src={Bk} width={17} height={12} />}
                            {move.color === 'w' ? move.move.substring(0, 1) === 'R' && <img src={Wr} width={17} height={12} />
                                : move.move.substring(0, 1) === 'R' && <img src={Br} width={17} height={12} />}
                            {move.color === 'w' ? move.move.substring(0, 1) === 'a' && <img src={Wp} width={17} height={12} />
                                : move.move.substring(0, 1) === 'a' && <img src={Bp} width={17} height={12} />}
                            {move.color === 'w' ? move.move.substring(0, 1) === 'b' && <img src={Wp} width={17} height={12} />
                                : move.move.substring(0, 1) === 'b' && <img src={Bp} width={17} height={12} />}
                            {move.color === 'w' ? move.move.substring(0, 1) === 'd' && <img src={Wp} width={17} height={12} />
                                : move.move.substring(0, 1) === 'd' && <img src={Bp} width={17} height={12} />}
                            {move.color === 'w' ? move.move.substring(0, 1) === 'e' && <img src={Wp} width={17} height={12} />
                                : move.move.substring(0, 1) === 'e' && <img src={Bp} width={17} height={12} />}
                            {move.color === 'w' ? move.move.substring(0, 1) === 'f' && <img src={Wp} width={17} height={12} />
                                : move.move.substring(0, 1) === 'f' && <img src={Bp} width={17} height={12} />}
                                {move.color === 'w' ? move.move.substring(0, 1) === 'g' && <img src={Wp} width={17} height={12} />
                                : move.move.substring(0, 1) === 'g' && <img src={Bp} width={17} height={12} />}
                            {move.color === 'w' ? move.move.substring(0, 1) === 'h' && <img src={Wp} width={17} height={12} />
                                : move.move.substring(0, 1) === 'h' && <img src={Bp} width={17} height={12} />}

                            {move.move.substring(1, move.move.length)}
                        </p>
                    )
                })}
                {(user.role !== 'STUDENT' || moveMode) &&
                    <button onClick={() => removeMovesHandler(move.user_id)} title='Удалить ходы пользователя' className="bg-red-500 cursor-pointer ml-3 w-6 h-6 p-1 mt-1 rounded-md flex justify-center items-center text-white"><MdOutlineDeleteOutline /></button>
                }
            </p>
        </div>
    )
}

export default User;