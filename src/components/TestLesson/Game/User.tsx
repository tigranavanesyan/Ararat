import { FC, useState, useEffect, useLayoutEffect } from 'react'
import { IMove } from '../../../models/MyGroups/IMove';
import Switch from '../../UI/Switch'
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { GroupGlobalModeSocket } from '../../../sockets/GroupSockets';
import { useParams } from 'react-router-dom';
import { clearUserMoves, editUserName } from '../../../store/reducers/GroupSlice';
import {MdOutlineDeleteOutline} from '@react-icons/all-files/md/MdOutlineDeleteOutline'
import {AiOutlineEdit} from '@react-icons/all-files/ai/AiOutlineEdit'
import {BsChevronUp} from '@react-icons/all-files/bs/BsChevronUp'
import {BsChevronDown} from '@react-icons/all-files/bs/BsChevronDown'
import { GroupUserCleanSocket, GroupUserEditSocket } from '../../../sockets/GroupSockets';
import Modal from '../../UI/Modal';
import { Disclosure } from '@headlessui/react'
import Input from '../../UI/Main/Input';
import MainButton from '../../UI/MainButton';

interface UserProps {
    move: IMove;
    i: number;
    moveMode: boolean;
    position?: string;
}

const User: FC<UserProps> = ({move, moveMode, game, setGame, position}) => {
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const { groupId } = useParams();
    const { user } = useAppSelector(state=> state.UserSlice)
    const setValueHandler = (bool: boolean) => {
        setValue(bool);
        if(groupId) {
            GroupGlobalModeSocket({room: groupId, user_id: move.user_id, bool: bool});
        }
    }
    function safeGameMutate(modify) {
        setGame((g) => {
            const update = { ...g };
            modify(update);
            return update;
        });
    }
    const removeMovesHandler = (user_id: string) => {
        if(groupId) {
            if(user_id === user._id) {
                safeGameMutate((game) => { game.load(position);});
            }
            dispatch(clearUserMoves(user_id));
            GroupUserCleanSocket({room: groupId, user_id: user_id});
        }
    }

    const editUserHandler = () => {
        if(groupId) {
            dispatch(editUserName({user_id: userId, name: name}));
            setEditModal(false);
            GroupUserEditSocket({room: groupId, user_id: userId, name: name});
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
                    <Switch value={value} onChange={setValueHandler} className='border-none absolute left-0 top-1'/>
                }
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') &&
                    <button onClick={()=> {setName(move.name); setUserId(move.user_id); setEditModal(true)}} title='Редактировать имя пользователя' className="bg-blue-500 cursor-pointer mr-3 w-6 h-6 p-1 mt-1 rounded-md flex justify-center items-center text-white"><AiOutlineEdit/></button>
                }
                <span className='text-[#8A6E3E] mr-2'>{move.name} {move.sname}: </span> 
                {move.deleted &&
                    <>
                    <Disclosure defaultOpen={true}>
                        {({ open }) => (
                            /* Use the `open` state to conditionally change the direction of an icon. */
                            <>
                                <Disclosure.Button>
                                    <p className='flex text-base items-center'>Удаленные ходы {open ? <BsChevronUp className='ml-1'/> : <BsChevronDown className='ml-1'/>}</p>
                                </Disclosure.Button>
                                <div className="basis-full"></div>
                                <Disclosure.Panel>
                                    {move.deleted.map((item)=>{
                                        let i = 0;
                                        return (
                                            <>
                                                <div className="flex flex-wrap "><p className='text-sm bg-apricot mt-1 rounded-lg py-[1px] mr-2'>Удалено:</p>
                                                    {
                                                        item.map(move=> {
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
                        )}
                    </Disclosure>
                    
                    <div className="basis-full"></div>
                    </>
                }


                {[0].map(()=> {
                    if(turn === 'b' && move.moves[0]?.color !== 'w') {
                        i++
                        return (
                            <p className={['mr-1 mt-1 text-sm rounded-lg px-1 py-[1px]'].join(' ')}>{i.toString() + '. '}...</p>
                        )
                    }
                })}

                {move.moves.map((move)=> {
                    
                    move.color === 'w' && i++;
                    
                    return (
                        <p className={['mr-1 mt-1 text-sm rounded-lg px-1 py-[1px]', move.color === 'w' ? '' : 'bg-gradient-button shadow-md', move.deleted && '!bg-gray-500'].join(' ')}>{move.color === 'w' && i.toString() + '. '}{move.move}</p>
                    )
                })}
                {(user.role !== 'STUDENT' || moveMode) &&
                    <button onClick={()=> removeMovesHandler(move.user_id)} title='Удалить ходы пользователя' className="bg-red-500 cursor-pointer ml-3 w-6 h-6 p-1 mt-1 rounded-md flex justify-center items-center text-white"><MdOutlineDeleteOutline/></button>
                }
            </p>
            <Modal active={editModal} setActive={setEditModal}>
                <h1 className='text-2xl font-bold text-center mb-4'>Изменить имя пользователя</h1>
                <Input wrapperClass='mb-5' type='text' value={name} onChange={e=> setName(e.target.value)}/>
                <div className="flex w-full">
                    <MainButton onClick={()=> editUserHandler()} className='mr-4 w-full !bg-gradient-button-green'>Сохранить</MainButton>
                    <MainButton onClick={()=> void setEditModal(false)} className='w-full'>Отмена</MainButton>
                </div>
            </Modal>
        </div>
    )
}

export default User;