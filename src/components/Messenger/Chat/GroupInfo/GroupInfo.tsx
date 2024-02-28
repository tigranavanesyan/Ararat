import { FC, useEffect, useState } from 'react'
import { useAppSelector } from '../../../../hooks/redux';
import Button from '../../../UI/Button';
import { AiOutlineClose } from '@react-icons/all-files/ai/AiOutlineClose'
import { CgMoveRight } from '@react-icons/all-files/cg/CgMoveRight'
import { AiOutlineUserAdd } from '@react-icons/all-files/ai/AiOutlineUserAdd'
import IcoButton from '../../../UI/IcoButton';
import { useParams } from 'react-router-dom';
import AddUserToGroupModal from '../../../Modals/AddUserToGroupModal';
import RemoveUserFromGroupModal from '../../../Modals/RemoveUserFromGroupModal';
import MoveUserToGroupModal from '../../../Modals/MoveUserToGroupModal';
import AddUserToAddGroupModal from '../../../Modals/AddUserToAddGroupModal';
import { AiFillEdit } from '@react-icons/all-files/ai/AiFillEdit';
import { AiOutlineArrowLeft } from '@react-icons/all-files/ai/AiOutlineArrowLeft';
import { AiOutlineArrowRight } from '@react-icons/all-files/ai/AiOutlineArrowRight';
import {BsCheckLg} from '@react-icons/all-files/bs/BsCheckLg'
import ContentEditable from 'react-contenteditable';
import { ContentEditableEvent } from 'react-contenteditable';
import DialogService from '../../../../services/DialogService';
import sanitize from 'sanitize-html';
import UploadFile from '../UploadFile';
import GroupMedia from './GroupMedia';
import { IoIosArrowDown } from '@react-icons/all-files/io/IoIosArrowDown'
import { Menu } from '@headlessui/react'
import CreateFullGroupModal from '../../../Modals/CreateFullGroupModal';

interface GroupInfoProps {
    active: boolean;
    setActive: (bool: boolean) => void;
}

interface IgroupInfoBool {
    name: boolean,
    description: boolean
}

interface IgroupInfo {
    name: string,
    description: string
}

const GroupInfo: FC<GroupInfoProps> = ({active, setActive}) => {
    const [groupMedia, setGroupMedia] = useState<boolean>(false);
    const {chat} = useAppSelector(state=> state.MessengerSlice);
    const {user} = useAppSelector(state=> state.UserSlice);
    const [modal, setModal] = useState<boolean>(false);
    const [modalAdd, setModalAdd] = useState<boolean>(false);
    const [modalRemove, setModalRemove] = useState<boolean>(false);
    const [modalMove, setModalMove] = useState<boolean>(false);
    const [modalAddGroup, setModalAddGroup] = useState<boolean>(false);
    const [modalRemoveInfo, setModalRemoveInfo] = useState<{_id: string, email: string}>({_id: '', email: ''});
    const [groupInfoBool, setGroupInfoBool] = useState<IgroupInfoBool>({
        name: false,
        description: false
    })
    const [groupInfo, setGroupInfo] = useState<IgroupInfo>({
        name: chat.user.name,
        description: chat.description
    })
    const [groupInfoHTML, setGroupInfoHTML] = useState<IgroupInfo>({
        name: chat.user.name,
        description: chat.description
    })
    const {userid} = useParams();
    useEffect(() => {
        setActive(false);
    }, [setActive, userid])
    const f =(str: string) => {
        // eslint-disable-next-line no-useless-escape
        const urlPattern = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\z`!()\[\]{};:'".,<>?«»“”‘’]))/ig; 
        const withlink = str.replace(
            // eslint-disable-next-line no-useless-escape
            urlPattern,
            '<a class="text-blue-400" target="_blank" href="$1">$1</a>'
        );
        return withlink;
    }

    useEffect(() => {
        setGroupInfo({name: chat.user.name, description: chat.description });
        if(chat.description) {
            setGroupInfoHTML({name: chat.user.name, description: f(chat.description) });
        } else {
            setGroupInfoHTML({name: chat.user.name, description: chat.description });
        }
    }, [chat])
    
    const handleChangeName = (e: ContentEditableEvent) => {
        const target = e.target as HTMLInputElement;
        const sanitizeConf = {
            allowedTags: ["br", "div", "p"],
        };
        setGroupInfo({ ...groupInfo, name: sanitize(target.value, sanitizeConf)});
        setGroupInfoHTML({ ...groupInfoHTML, name: sanitize(target.value, sanitizeConf)});
    };

    const handleChangeDesc = (e: ContentEditableEvent) => {
        const target = e.target as HTMLInputElement;
        const sanitizeConf = {
            allowedTags: ["br", "div", "a", "p"],
            allowedAttributes: { a: ["href"] }
        };
        setGroupInfo({ ...groupInfo, description: sanitize(target.value, sanitizeConf)});
        setGroupInfoHTML({ ...groupInfoHTML, description: sanitize(target.value, sanitizeConf)});
    };

    const handleEdit = (file: FileList | undefined) => {
        let avatar: File | undefined = undefined;
        if(file) {
            avatar = file[0];
        }
        if(userid) {
            const response = DialogService.editChat(groupInfo.name, groupInfo.description, userid, avatar);
        }
        setGroupInfoBool({name: false, description: false});
    }

    const removeHandler = (_id: string, email: string) => {
        setModalRemoveInfo({_id: _id, email: email});
        setModalRemove(true);
    }

    const moveHandler = (_id: string, email: string) => {
        setModalRemoveInfo({_id: _id, email: email});
        setModalMove(true);
    }

    const addHandler = (_id: string, email: string) => {
        setModalRemoveInfo({_id: _id, email: email});
        setModalAddGroup(true);
    }
    return (
        <>
        {active &&
            <>
                <div className='w-[700px] flex flex-col overflow-hidden'>
                    {groupMedia
                    ?
                    <>
                        <div className='bg-[#f0f2f5] border-l-2 flex border-gray-700 pl-5 py-5 h-16 text-white text-xl items-center'>
                            <IcoButton className='!text-gray-800 hover:!text-white' onClick={() => setGroupMedia(false)} icon={<AiOutlineArrowLeft/>}/>
                            <p className='text-gray-800'>Group Media</p>
                        </div>
                        <GroupMedia messages={chat.messages}/>
                    </>
                    :
                    <>
                        <div className='bg-[#f0f2f5] border-l-2 flex justify-between pl-10 py-5 h-16 text-white text-xl items-center'>
                            <p className='text-gray-800'>Group description</p>
                            <IcoButton className='!text-gray-800 hover:!text-white' onClick={() => setActive(false)} icon={<AiOutlineClose/>}/>
                        </div>
                        <div className="overflow-auto">
                            <div className="flex flex-col mt-4 px-4">
                                <div className="flex justify-center relative">
                                    <img className='w-52 h-52 bg-black rounded-full' src={chat.user.avatar} alt="avatar"/>
                                    {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR')  && 
                                        <div className="flex justify-center items-center">
                                            <UploadFile accept='.jpg,.jpeg,.png,.webp' setFilesHandler={handleEdit} id='avatar-upload' theme='dark' multiple={false}/>
                                        </div>
                                    }
                                </div>
                                <div className="relative w-full pr-10 mt-5">
                                    {groupInfoBool.name
                                    ?
                                    <>
                                        {((user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') && !chat.group_id) && 
                                            <>
                                                <ContentEditable className='text-2xl mb-3' tagName="h2" html={groupInfo.name} onChange={handleChangeName} disabled={false}/>
                                                <IcoButton onClick={()=> handleEdit(undefined)} className='absolute top-0 right-0 !text-gray-900 hover:!text-white !p-2' icon={<BsCheckLg/>}/>
                                            </>
                                        }
                                    </>
                                    :
                                    <>
                                        <p className='whitespace-pre-wrap break-words text-2xl mb-3' dangerouslySetInnerHTML={{__html: groupInfoHTML.name}}></p>
                                        {((user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') && !chat.group_id) &&
                                            <IcoButton onClick={()=> setGroupInfoBool({...groupInfoBool, name: true})} className='absolute top-0 right-0 !text-gray-900 hover:!text-white !p-2' icon={<AiFillEdit/>}/>
                                        }
                                        {(((user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') || user.role === 'ADMIN') && chat.group_id) &&
                                            <IcoButton onClick={()=> setModal(true)} className='absolute top-0 right-0 !text-gray-900 hover:!text-white !p-2' icon={<AiFillEdit/>}/>
                                        }
                                    </>
                                    }
                                </div>
                                <p className='text-lg mb-3'>Description:</p>
                                <div className="relative w-full pr-10">
                                    {groupInfoBool.description
                                    ?
                                    <>
                                        {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') && 
                                            <>
                                                <ContentEditable html={groupInfo.description} onChange={handleChangeDesc} disabled={false}/>
                                                <IcoButton onClick={()=> handleEdit(undefined)} className='absolute top-0 right-0 !text-gray-900 hover:!text-white !p-2' icon={<BsCheckLg/>}/>
                                            </>
                                        }
                                    </>
                                    :
                                    <>
                                        <p className='whitespace-pre-wrap break-words' dangerouslySetInnerHTML={{__html: groupInfoHTML.description}}></p>
                                        {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') && 
                                            <IcoButton onClick={()=> setGroupInfoBool({...groupInfoBool, description: true})} className='absolute top-0 right-0 !text-gray-900 hover:!text-white !p-2' icon={<AiFillEdit/>}/>
                                        }
                                    </>
                                    }
                                </div>
                                <button className='text-left font-medium text-lg text-gray-500 py-4 flex relative items-center' onClick={()=> setGroupMedia(true)}>Media, Files, Links <AiOutlineArrowRight className='ml-4'/></button>
                                {(!chat.anonim || user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') &&
                                    <p className='text-lg mb-3'>Users:</p>
                                }
                                <div className="flex flex-col max-h-[400px] overflow-auto relative">
                                    {(!chat.anonim || user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') &&
                                        chat?.users?.map((useritm, id)=>
                                            <div key={id} className='flex items-center justify-between mb-5'>
                                                <div className="flex items-center">
                                                    <div className='w-12 mr-3'><img className='w-full' src={useritm.avatar} alt="avatar"/></div>
                                                    <div className="flex flex-col ">
                                                        <p className='font-medium text-blue-500'>{useritm.name} {useritm.sname}</p>
                                                        {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') &&
                                                            <>
                                                                <p>{useritm.email}</p>
                                                                {useritm.lichess &&
                                                                    <a className='text-blue-400' href={useritm.lichess} target='_blank'>@{useritm.lichess.split('@/').pop()}</a>
                                                                }
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'ADMIN' ) && 
                                                    <div className="flex">
                                                        <Menu>
                                                            <Menu.Button><IoIosArrowDown/></Menu.Button>
                                                            <Menu.Items className='z-10 bg-gray-800 rounded-sm h-auto absolute right-0'>
                                                                <Menu.Item>
                                                                    <button onClick={()=> removeHandler(useritm._id, useritm.email)} className={['hover:bg-gray-700 py-3 px-5 rounded-sm transition-all flex items-center text-white text-sm'].join(' ')}><span className='text-xl mr-3'><AiOutlineClose/></span>Remove from group</button>
                                                                </Menu.Item>
                                                                <Menu.Item>
                                                                    <button onClick={()=> moveHandler(useritm._id, useritm.email)} className={['hover:bg-gray-700 py-3 px-5 rounded-sm transition-all flex items-center text-white text-sm'].join(' ')}><span className='text-xl mr-3'><CgMoveRight/></span>Move to other group</button>
                                                                </Menu.Item>
                                                                <Menu.Item>
                                                                    <button onClick={()=> addHandler(useritm._id, useritm.email)} className={['hover:bg-gray-700 py-3 px-5 rounded-sm transition-all flex items-center text-white text-sm'].join(' ')}><span className='text-xl mr-3'><AiOutlineUserAdd/></span>Add to group</button>
                                                                </Menu.Item>
                                                            </Menu.Items>
                                                        </Menu>
                                                    </div>
                                                } 
                                            </div>
                                        )
                                    } 
                                </div>
                                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'ADMIN') &&
                                    <Button onClick={()=> setModalAdd(true)}>Add user</Button>
                                }
                            </div>
                        </div>
                    </>
                    }
                </div>
                <AddUserToGroupModal modal={modalAdd} setModal={setModalAdd}/>
                <RemoveUserFromGroupModal _id={modalRemoveInfo._id} email={modalRemoveInfo.email} modal={modalRemove} setModal={setModalRemove}/>
                <MoveUserToGroupModal  _id={modalRemoveInfo._id} email={modalRemoveInfo.email} modal={modalMove} setModal={setModalMove}/>
                <AddUserToAddGroupModal email={modalRemoveInfo.email} modal={modalAddGroup} setModal={setModalAddGroup}/>
            </>
        }
        {modal && chat.group_id &&
            <CreateFullGroupModal group_id={chat.group_id} modal={modal} setModal={setModal} edit={true}/>
        }
        </>
    )
}

export default GroupInfo;