import { FC, useRef, useEffect, useState } from 'react'
import MenuItem from './MenuItem';
import { IContextChat } from '../../../../../models/IContext'
import { clickOuter } from '../../../../../utils/clickOuter'
import { useAppDispatch } from '../../../../../hooks/redux'
import { editChatTag } from '../../../../../store/reducers/UserSlice';
import CreateNewTagModal from '../../../../Modals/CreateNewTagModal';
import RemoveGroupModal from '../../../../Modals/RemoveGroupModal';
import ArchiveGroupModal from '../../../../Modals/ArchiveGroupModal';
import { useAppSelector } from '../../../../../hooks/redux';

interface ChatMenuProps {
    context: IContextChat;
    setContext: (obj: IContextChat) => void;
}

const ChatMenu: FC<ChatMenuProps> = ({ context, setContext }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const [modal, setModal] = useState<boolean>(false);
    const [modal2, setModal2] = useState<boolean>(false);
    const [archive, setArchive] = useState<boolean>(false);
    const [modal3, setModal3] = useState<boolean>(false);
    const { user } = useAppSelector(state=> state.UserSlice);
    useEffect(() => {
        if(menuRef.current) {
            return clickOuter(menuRef.current, ()=>setContext({...context, active: false}));
        }
    }, [context, setContext]);
    
    const menuHandler = async(name: string) => {
        await dispatch(editChatTag({dialog_id: context.chat_id, name: name}));
        setContext({...context, active: false})
    }

    const ArchiveHandler = (archive: boolean) => {
        setModal2(true);
        setArchive(archive)
    }

    return (
        <>
        {context.active &&
            <div ref={menuRef} style={{left: context.x-100, top: context.y+200}} className={['z-10 bg-gray-800 rounded-sm h-auto absolute', context.y < 280 ? '' : '-translate-y-full'].join(' ')}>
                <ul className='flex flex-col'>
                    
                    
                    {user.role !== 'STUDENT' &&
                        <>
                            {context.type !== 'archive' &&
                                <MenuItem onClick={()=> menuHandler('archive')}>Add to Groups</MenuItem>
                            }
                            {context.tags.length > 0 &&
                                context.tags.map(tag=>
                                    tag !== 'archive' &&
                                    <MenuItem onClick={()=> menuHandler(tag)}>Add to {tag}</MenuItem>
                                )
                            }
                            <MenuItem onClick={()=> setModal(true)}>Create new category</MenuItem>
                            <MenuItem onClick={()=> menuHandler('other')}>{context.type === 'group' ? 'Remove from groups' : 'Remove from category'}</MenuItem>
                        </>
                    }
                    
                    {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'ADMIN') &&
                        <MenuItem onClick={()=> ArchiveHandler(context.type !== 'archive' ? true : false)}>{context.type !== 'archive' ? 'Архивировать' : 'Разархивировать'}</MenuItem>
                    }
                    {((user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') && context.type === 'archive') &&
                        <MenuItem onClick={()=> setModal3(true)}>Удалить</MenuItem>
                    }
                </ul>
            </div>
        }
        <CreateNewTagModal modal={modal} setModal={setModal} context={context}/>
        <ArchiveGroupModal modal={modal2} setModal={setModal2} _id={context.chat_id} archive={archive}/>
        <RemoveGroupModal modal={modal3} setModal={setModal3} _id={context.chat_id}/>
        </>
    )
}

export default ChatMenu;