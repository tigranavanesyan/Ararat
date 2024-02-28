import { FC, useState, useRef, useEffect, Fragment } from 'react'
import Input from '../../UI/Input';
import { BsSearch } from '@react-icons/all-files/bs/BsSearch'
import Chat from './Chat';
import debounce from "lodash.debounce";
import { searchDialogs } from '../../../store/reducers/MessengerSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { AiOutlinePlus } from '@react-icons/all-files/ai/AiOutlinePlus'
import { BiArchiveIn } from '@react-icons/all-files/bi/BiArchiveIn';
import IcoButton from '../../UI/IcoButton';
import BtnContextMenuMobile from '../../UI/BtnContextMenuMobile.tsx';
import CreateGroupModal from '../../Modals/CreateGroupModal';
import { Disclosure } from '@headlessui/react'
import { IContextChat } from '../../../models/IContext';
import ChatMenu from '../Chat/Menus/MessageMenu/ChatMenu';
import { IChat } from '../../../models/IChat';
import ChatMenuMobile from "../Chat/Menus/MessageMenu/ChatMenuMobile.tsx";

const Chats: FC = () => {
    const [value, setValue] = useState<string>('');
    const [tags, setTags] = useState<Array<string>>([]);
    const [allChats, setAllChats] = useState<IChat[]>([]);
    const [modal, setModal] = useState<boolean>(false)
    const { chats, archived, unreaded } = useAppSelector(state => state.MessengerSlice);
    const { user } = useAppSelector(state => state.UserSlice)
    const dispatch = useAppDispatch();
    const archive = useRef<number>(0);
    const archiveAll = useRef<number>(0);
    const count = useRef<number>(0);
    const countAll = useRef<number>(0);
    const [context, setContext] = useState<IContextChat>({
        active: false,
        x: 0,
        y: 0,
        chat_id: '',
        tags: []
    });

    useEffect(() => {
        archive.current = 0;
        archiveAll.current = 0;
        count.current = 0;
        countAll.current = 0;
        const allTagsTemp = [] as Array<string>;
        const allArchiveTemp = [] as Array<string>;
        const allChatsTemp = [] as IChat[];
        if(user.dialog_types) {
            user.dialog_types.map(type=>{
                if(!allTagsTemp.includes(type.name)) {
                    allTagsTemp.push(type.name);
                }
                chats.map(chat=>{
                    if(type.dialog === chat._id) {
                        if(type.name === 'archive') {
                            if(!allArchiveTemp.includes(chat._id)) {
                                allArchiveTemp.push(chat._id);
                                if(chat.unreaded >= 1) {
                                    archive.current ++;
                                }
                                archiveAll.current += chat.unreaded;
                            }
                        }
                    }
                })
            })
        }
        chats.map(chat=>{
            if(!allArchiveTemp.includes(chat._id)) {
                if(!allChatsTemp.includes(chat)) {
                    allChatsTemp.push(chat);
                    if(chat.unreaded >= 1) {
                        count.current ++;
                    }
                    countAll.current += chat.unreaded;
                }
            }
        })
        setTags(allTagsTemp);
        setAllChats(allChatsTemp);
    }, [user.dialog_types, chats])
    
    useEffect(() => {
        setContext({...context, tags: tags})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags])

    const searchHandler = async(e) => {
        dispatch(searchDialogs(e.target.value));
    }

    return (
        <>
            <div
                className={['w-full h-[calc(100%-210px)] xl:h-full xl:min-w-[370px] xl:max-w-[370px] bg-white p-3 xl:bg-gray-800 pb-5 flex flex-col', user.role !== 'STUDENT' ? 'pt-2 xl:pt-10' : 'pt-0'].join(' ')}>
                {user.role !== 'STUDENT' &&
                    <div
                        className={["px-5 bg-gradient-silver rounded-t-[50px] xl:bg-none xl:border-b-gray-700 pb-5 mb-2", user.role !== 'STUDENT' && 'border-b-[1px]'].join(' ')}>
                        <div className="flex justify-between items-center mb-4 xl:mb-8">
                            <h1 className='hidden xl:inline text-white font-semibold text-2xl'>Chats</h1>
                            {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') &&
                                <IcoButton onClick={() => void setModal(true)} icon={<AiOutlinePlus/>}/>
                            }
                        </div>
                        <Input value={value} icon={<BsSearch/>} type='text'
                               className='!py-2 rounded-[50px] xl:rounded-[5px]' onInput={e => setValue(e.target.value)}
                               placeholder='Search...' onChange={debounce(e => searchHandler(e), 500)}/>
                        <div className='flex justify-between gap-2 mt-4 xl:hidden'>
                            <button className='bg-gradient-appricot w-full rounded-[50px] py-3 relative'>
                                Чаты
                                <span className='absolute right-3 top-3 bg-black rounded-full w-9  text-yellow-500'>
                                3
                            </span>
                            </button>
                            <button className='bg-gradient-menu w-full text-white rounded-[50px] relative'>
                                Звонки
                                <span className='absolute right-3 top-3 bg-white rounded-full w-9  text-black'>
                                2
                            </span>
                            </button>
                            <BtnContextMenuMobile btnType={"group"}/>
                        </div>
                    </div>
                }
                <div className="flex  flex-col overflow-y-auto custom-scroll bg-gray-200 xl:bg-inherit ">
                    {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') &&
                        <Disclosure>
                            <Disclosure.Button
                                className="bg-gray-200 flex items-center hover:bg-gray-700 py-5 px-5 rounded-sm transition-all text-white text-xl ">
                                <span className='mr-4'><BiArchiveIn/></span>
                                <p className='text-lg flex items-center justify-between w-full'>Архивированные <span
                                    className="bg-apricot text-base text-black rounded-full px-1">{archived.length}</span>
                                </p>
                            </Disclosure.Button>
                            <Disclosure.Panel className="text-gray-500">
                                {archived.map(chat =>
                                    <Chat type='archive' context={context} setContext={setContext} key={chat._id}
                                          data={chat}/>
                                )}
                            </Disclosure.Panel>
                        </Disclosure>
                    }
                    {user.role !== 'STUDENT' &&
                        <Disclosure>
                            <Disclosure.Button
                                className="flex items-center hover:bg-gray-700 py-5 px-5 rounded-sm transition-all text-white text-xl">
                                <span className='mr-4'><BiArchiveIn/></span>
                                <p className='text-lg flex items-center justify-between w-full'>Groups <span
                                    className="bg-apricot text-base text-black rounded-full px-1">{archive.current}/{archiveAll.current}</span>
                                </p>
                            </Disclosure.Button>
                            <Disclosure.Panel className="text-gray-500">
                                {chats.map(chat =>
                                    <Fragment key={chat._id}>
                                        {user.dialog_types?.map(type =>
                                            <>
                                                {(type.dialog === chat._id && type.name === 'archive') &&
                                                    <Chat type='group' context={context} setContext={setContext}
                                                          key={chat._id} data={chat}/>
                                                }
                                            </>
                                        )}
                                    </Fragment>
                                )}
                            </Disclosure.Panel>
                        </Disclosure>
                    }
                    {tags.length > 0 &&
                        <>
                            {tags.map(tag => {
                                let i = 0;
                                let all = 0;
                                if (tag !== 'archive') {
                                    chats.map(chat => {
                                        user.dialog_types?.map(type => {
                                            if (type.dialog === chat._id && type.name === tag) {
                                                all += chat.unreaded;
                                                if (chat.unreaded >= 1) i++;
                                            }
                                        })
                                    })
                                }
                                return (
                                    tag !== 'archive' &&
                                    <div className="flex flex-col">
                                        <Disclosure>
                                            <Disclosure.Button
                                                className="hover:bg-gray-700 py-3 px-10 rounded-sm transition-all text-white text-base text-left flex items-center justify-between">
                                                {tag}: <span
                                                className="bg-apricot text-black rounded-full px-1">{i}/{all}</span>
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="text-gray-500">
                                                {chats.map(chat =>
                                                    user.dialog_types?.map(type =>
                                                        <Fragment key={chat._id}>
                                                            {(type.dialog === chat._id && type.name === tag) &&
                                                                <Chat context={context} setContext={setContext}
                                                                      data={chat}/>
                                                            }
                                                        </Fragment>
                                                    )
                                                )}
                                            </Disclosure.Panel>
                                        </Disclosure>
                                    </div>
                                )
                            })}
                        </>
                    }
                    <div className="flex flex-col">
                        <Disclosure defaultOpen>
                            <Disclosure.Button
                                className={["hover:bg-gray-700 py-3 px-10 rounded-sm transition-all text-white text-left flex items-center justify-between", user.role !== 'STUDENT' ? 'text-base' : 'text-xl mt-2 mb-8'].join(' ')}>
                                {user.role !== 'STUDENT' ? 'All:' : 'All chats:'} <span
                                className="bg-apricot text-black rounded-full px-1">{count.current}/{countAll.current}</span>
                            </Disclosure.Button>
                            <Disclosure.Panel className="text-gray-500">
                                {user.dialog_types
                                    ?
                                    allChats.map(chat =>
                                        <Chat context={context} setContext={setContext} key={chat._id} data={chat}/>
                                    )
                                    :
                                    chats.map(chat =>
                                        <Chat context={context} setContext={setContext} key={chat._id} data={chat}/>
                                    )
                                }

                            </Disclosure.Panel>
                        </Disclosure>
                    </div>
                </div>
            </div>
            {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') &&
                <CreateGroupModal modal={modal} setModal={setModal}/>
            }
            <div className='hidden xl:block'>
                <ChatMenu context={context} setContext={setContext}/>
            </div>
            <div className='xl:hidden'>
                {/*<ChatMenuMobile context={context} setContext={setContext}/>*/}
            </div>

        </>
    )
}

export default Chats;