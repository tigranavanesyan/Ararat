import { FC, useState } from 'react'
import { ITopMenuOnlineLesson } from '../../../models/ITopMenu';
import MenuItem from './MenuItem';
import { RxHamburgerMenu } from '@react-icons/all-files/rx/RxHamburgerMenu'
import { Menu } from '@headlessui/react'
import GroupService from '../../../services/GroupService';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux';
import SuccessModal from '../../Modals/SuccessModal';
import MainButton from '../MainButton';
import ProgramModal from '../../Modals/ProgramModal';
import DescriptionModal from '../../Modals/DescriptionModal';
import HomeworksModal from '../../Modals/HomeworksModal';
import HistoryModal from '../../Modals/HistoryModal';
import { useAppDispatch } from '../../../hooks/redux';
import { editGroup } from '../../../store/reducers/GroupSlice';
import { GroupEndLessonSocket } from '../../../sockets/GroupSockets';
import { AxiosError } from 'axios';
import { endLessonReducer } from '../../../store/reducers/GroupSlice';

interface TopMenuOnlineLessonProps {
    menu?: ITopMenuOnlineLesson[];
    className?: string;
}

const TopMenuOnlineLesson: FC<TopMenuOnlineLessonProps> = ({menu, className, api}) => {
    const [modal, setModal] = useState<boolean>(false);
    const [modal2, setModal2] = useState<boolean>(false);
    const [modal3, setModal3] = useState<boolean>(false);
    const [modal4, setModal4] = useState<boolean>(false);
    const [modal5, setModal5] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [close, setClose] = useState<boolean>(false);
    const {groupId} = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { group } = useAppSelector(state=> state.GroupSlice)
    const startLessonHandler = async () => {
        if(groupId) {
            await dispatch(editGroup({groupId: groupId, payload: {open: true}}))
            .then(()=>{
                GroupEndLessonSocket({room: groupId});
                setModal3(true);
                setMessage('Онлайн урок успешно начат!')
                setClose(false);
                console.log('ddd');
                console.log(api);
                function sRecording() {
                    if(api) {
                        api.executeCommand('startRecording', { mode: 'local'})
                    } else {
                        sRecording();
                    }
                    
                }
                sRecording();
            })
        }
    }
    const endLessonHandler = async () => {
        if(groupId) {
            await dispatch(editGroup({groupId: groupId, payload: {open: false}}))
            .then(async () => {
                GroupEndLessonSocket({room: groupId});
                setModal3(true);
                setMessage('Онлайн урок успешно окончен!');
                setClose(true);
                dispatch(endLessonReducer());
                const prevmaterials = [] as string[];
                group.program.map(item=> {prevmaterials.push(item._id)});
                await GroupService.editGroup(groupId, {program: [], prevprogram: prevmaterials } ).catch((e: AxiosError)=> {
                    console.log(e);
                });
                api.executeCommand('stopRecording', 'local');
            })
        }
    }
    return (
        <>
            <div className={['h-[90px] max-2xl:h-[50px] w-full flex py-5 px-10 relative justify-between', className].join(' ')}>
                {menu &&
                    <>
                        <div className="flex flex-col bg-white absolute left-5 top-0 p-2 max-2xl:p-0 rounded-xl">
                            {menu.map(item=>
                                !item.dropdown &&
                                <MenuItem {...(item.openProgram && { onClick: ()=> void setModal(true) })}  {...(item.openHistory && { onClick: ()=> void setModal5(true) })} className='cursor-pointer mb-2 h-[61px] max-2xl:text-base max-2xl:!py-0 max-2xl:h-[43px]' key={item.id} item={item}/>
                            )}
                        </div>
                        <div className="flex flex-col bg-white absolute right-5 top-0 p-2 max-2xl:p-0 rounded-xl">
                            {menu.map(item=>
                                item.dropdown &&
                                <MenuItem {...(item.openHomework && { onClick: ()=> void setModal4(true) })} {...(item.openDescription && { onClick: ()=> void setModal2(true) })} className='cursor-pointer mb-2 h-[61px] max-2xl:text-base max-2xl:!py-0 max-2xl:h-[43px]' key={item.id} item={item}/>
                            )}
                            <MenuItem onClick={() => group?.open ? void endLessonHandler() : void startLessonHandler()} className='cursor-pointer mb-2 h-[61px] max-2xl:text-base max-2xl:!py-0 max-2xl:h-[43px]' item={{name: group?.open ? 'Закончить урок' : 'Начать урок', id: 5}}/>
                        </div>
                    </>
                }     
            </div>
            <SuccessModal modal={modal3} setModal={setModal3} message={message}>
                {close &&
                    <MainButton className='mt-5' onClick={()=> groupId && navigate('/group/'+groupId+'/homework/add')}>Отправить дз</MainButton>
                }
            </SuccessModal>
            <ProgramModal modal={modal} setModal={setModal}/>
            <DescriptionModal modal={modal2} setModal={setModal2}/>
            {modal4 &&
                <HomeworksModal modal={modal4} setModal={setModal4}/>
            }
            {modal5 &&
                <HistoryModal modal={modal5} setModal={setModal5}/>
            }
        </>
        
    )
}

export default TopMenuOnlineLesson;