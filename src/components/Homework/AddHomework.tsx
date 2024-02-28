import { FC, useState, useEffect, Fragment } from 'react'
import { Chessboard } from 'react-chessboard';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getGroup } from '../../store/reducers/GroupSlice';
import { getHomework } from '../../store/reducers/HomeworkSlice';
import {MdOutlineDeleteOutline} from '@react-icons/all-files/md/MdOutlineDeleteOutline'
import SelectHomeWorkModal from '../Modals/SelectHomeWorkModal';
import MainButton from '../UI/MainButton';
import DatePicker, { registerLocale } from 'react-datepicker';
import enGB from 'date-fns/locale/en-GB';
registerLocale('enGB', enGB);
import 'react-datepicker/dist/react-datepicker.css';
import Input from '../UI/Main/Input';
import HomeworkService from '../../services/HomeworkService';
import SuccessModal from '../Modals/SuccessModal';
import { AxiosError } from 'axios';
import { ServerError } from '../../models/response/ServerError';
import AuthErrorModal from '../Modals/AuthError';
import InputMask from 'react-input-mask';
import Switch from '../UI/Switch';

const AddHomework: FC = () => {
    const { group } = useAppSelector(state => state.GroupSlice);
    const { homework } = useAppSelector(state => state.HomeworkSlice);
    const { groupId, homeworkId } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [position, setPosition] = useState<{_id: string, position: string}>({_id: '', position: ''});
    const [positions, setPositions] = useState<{_id: string, position: string, seq: number}[]>([]);
    const [modal, setModal] = useState<boolean>(false);
    const [modal2, setModal2] = useState<boolean>(false);
    const [emodal, setEModal] = useState<boolean>(false);
    const [modalError, setModalError] = useState<string>('');
    const [date, setDate] = useState<Date>(new Date());
    const [autoCheck, setAutoCheck] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async() => {
            if(groupId) {
                await dispatch(getGroup(groupId));
            }
            if(homeworkId) {
                await dispatch(getHomework(homeworkId));
            }
        }
        void fetchData();
    }, [dispatch])
    
    useEffect(() => {
        if(group) {
            const temp = [] as {_id: string, position: string, seq: number}[];
            if(homeworkId) {
                if(homework?.program) {
                    homework.program.map(material=>{
                        temp.push({_id: material._id, position: material.data.tags.FEN, seq: material.seq});
                    })
                    setPosition({_id: homework.program[0]._id, position: homework.program[0].data.tags.FEN})
                }
            } 
            else {
                if(group?.prevprogram) {
                    group.prevprogram.map(material=>{
                        temp.push({_id: material._id, position: material.data.tags.FEN, seq: material.seq});
                    })
                    if(group.program[0]) {
                        setPosition({_id: group.program[0]._id, position: group.program[0].data.tags.FEN});
                    }
                }
            }
            setPositions(temp);
        }
    }, [group, homework])
    
    const removeHandler = (item: {_id: string, position: string}) => {
        const tmp = positions;
        setPositions(tmp.filter(material=> material._id !== item._id));
    }

    const selectHomeWork = (data: {_id: string, position: string, seq: number}) => {
        const cond = positions.findIndex(pos=> pos._id === data._id);
        const tmp = positions;
        if(cond > -1) {
            tmp.splice(cond, 1);
        }
        else {
            tmp.push(data);
        }
        setPositions(tmp);
    }

    const sendHomework = async () => {
        if(groupId) {
            const programIds = [] as string[];
            positions.map(pos=>{
                programIds.push(pos._id);
            })
            if(homeworkId) {
                await HomeworkService.editHomework(homeworkId, {program: programIds}).then(()=> setModal2(true)).catch((e: AxiosError)=> {
                    const event = e.response?.data as ServerError;
                    setModalError(event.error)
                    setEModal(true);
                });
            } else {
                await HomeworkService.createHomework(groupId, date, programIds, autoCheck).then(()=> setModal2(true)).catch((e: AxiosError)=> {
                    const event = e.response?.data as ServerError;
                    setModalError(event.error)
                    setEModal(true);
                });
            }

        }
        
    }

    return (
        <div className="p-20">
            <div className='w-full py-5 px-20 bg-[#f0f0f0] rounded-xl overflow-hidden justify-between border-collapse flex'>
                <div className="w-[500px] mr-20">
                    {console.log("------------ position ---------------", position)}
                    <Chessboard position={position.position}/>
                </div>
                <div className="flex flex-col mb-3 w-[650px]">
                    <p className='font-semibold text-2xl mb-5'>Позиции урока:</p>
                    <div className="flex flex-wrap">
                        {(group || homework) &&
                            positions &&
                            positions.map((item)=> 
                                <Fragment key={item._id}>
                                    <div className="flex items-center mr-3 mb-2">
                                        <p onClick={()=> setPosition({_id: item._id, position: item.position})} className={['hover:bg-gradient-appricot cursor-pointer hover:text-white py-1 font-semibold px-5 rounded-lg shadow-xl', position._id === item._id ? 'bg-gradient-appricot text-white' : 'bg-gradient-button'].join(' ')}>{item.seq}</p>
                                        <button onClick={()=> removeHandler(item)}><MdOutlineDeleteOutline /></button>
                                    </div>
                                </Fragment>
                            )
                            
                        }
                    </div>
                    <div className="mt-5 flex items-end">
                        <div>
                            <p className='font-semibold text-lg mb-2' >Срок дз:</p>
                            <DatePicker
                                selected={date}
                                dateFormat="dd.MM.yyyy"
                                locale="enGB"
                                onChange={(date: Date) => setDate(date)}
                                customInput={
                                    <InputMask mask="99.99.9999">
                                        {(inputProps) => <Input {...inputProps} type='text' className='border-[#ccc] !py-2 text-center' wrapperClass='w-full'/>}
                                    </InputMask>
                                    
                                }
                            />
                        </div>
                        <Switch label='Автопроверка' value={autoCheck} onChange={setAutoCheck} className='border-none font-bold text-lg mb-3 ml-5'/>
                    </div>
                    <div className="flex mt-10">
                        {homeworkId
                        ?
                            group.lasthomework === homeworkId &&
                            <MainButton className='mr-5' onClick={()=>setModal(true)}>Редактировать дз</MainButton>
                        :
                        <MainButton className='mr-5' onClick={()=>setModal(true)}>Добавить дз из программы</MainButton>
                        }
                        {homeworkId
                        ?
                            group.lasthomework === homeworkId &&
                            <MainButton className='!bg-gradient-button-green' onClick={()=> void sendHomework()}>Отправить ДЗ</MainButton>
                        :
                        <MainButton className='!bg-gradient-button-green' onClick={()=> void sendHomework()}>Отправить ДЗ</MainButton>
                        }
                        
                    </div>
                </div>
                <SelectHomeWorkModal modal={modal} setModal={setModal} selectHomeWork={selectHomeWork}/>
                <SuccessModal noclosable={true} modal={modal2} setModal={setModal2} message='Дз отправлено'>
                    <MainButton className='mt-5' onClick={()=> groupId && navigate('/group/'+groupId)}>Вернутся в группу</MainButton>
                </SuccessModal>
                <AuthErrorModal modal={emodal} setModal={setEModal} error={modalError} />
            </div>
        </div>
    )
}

export default AddHomework;