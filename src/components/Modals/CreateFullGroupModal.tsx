import { FC, useState, useEffect, useRef } from 'react'
import Modal from '../UI/Modal';
import Input from '../UI/Main/Input';
import Select from '../UI/Main/Select';
import Textarea from '../UI/Textarea';
import MainButton from '../UI/MainButton';
import { useForm, SubmitHandler, Controller, useFieldArray } from "react-hook-form";
import { createChat } from '../../store/reducers/MessengerSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { ServerError } from '../../models/response/ServerError';
import AuthErrorModal from './AuthError';
import parse from 'date-fns/parse';
import formatISO from 'date-fns/formatISO';
import InputMask from 'react-input-mask';
import { ISelect } from '../../models/ISelect';
import PermissionsService from '../../services/PermissionsService';
import GroupService from '../../services/GroupService';
import { createGroup, editGroup } from '../../store/reducers/GroupSlice';
import DatePicker, { registerLocale } from 'react-datepicker';
import enGB from 'date-fns/locale/en-GB';
import { useParams } from 'react-router-dom';
import { useHookFormMask } from 'use-mask-input';
import ComboSelect from '../UI/Main/ComboSelect';
registerLocale('enGB', enGB);

import 'react-datepicker/dist/react-datepicker.css';
import { User } from '../../models/User';

interface CreateFullGroupModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
    edit?: boolean,
    group_id?: string,
    callback: (d: string) => void;
}

type Form = {
    name: string,
    graphics: [{graphic: ISelect[], starttime: string, endtime: string, time: number}],
    traners: ISelect[],
    level: ISelect,
    pupils: ISelect,
    time: number,
    starts: Date,
    startpos: string,
};

const CreateFullGroupModal: FC<CreateFullGroupModalProps> = ({ modal, setModal, edit, group_id, callback }) => {
    const [modalError, setModalError] = useState<string>('');
    const [eModal, setEModal] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [tranersOptions, setTranersOptions] = useState<ISelect[]>([]);
    const [name, setName] = useState<string>('');
    const [editState, setEditState] = useState<boolean>(edit ? true : false);
    const [startDate, setStartDate] = useState(new Date());
    const { user } = useAppSelector(state=> state.UserSlice)
    const { groupId } = useParams();
    const [timePoints, setTimePoints] = useState<{starttime: string, endtime: string}>({
        starttime: '',
        endtime: ''
    })
    const graphicOptions = [
        {id: '1', name: 'Понедельник', slug: 'Пн'},
        {id: '2', name: 'Вторник', slug: 'Вт'},
        {id: '3', name: 'Среда', slug: 'Ср'},
        {id: '4', name: 'Четверг', slug: 'Чт'},
        {id: '5', name: 'Пятница', slug: 'Пт'},
        {id: '6', name: 'Суббота', slug: 'Сб'},
        {id: '7', name: 'Воскресение', slug: 'Вс'},
    ] as ISelect[];
    const levelsOptions = [
        {id: '1', name: '1 уровень', slug: '1 уровень'},
        {id: '2', name: '2 уровень', slug: '2 уровень'},
        {id: '3', name: '3 уровень', slug: '3 уровень'},
        {id: '4', name: '4 уровень', slug: '4 уровень'},
        {id: '5', name: '5 уровень', slug: '5 уровень'},
        {id: '6', name: '6 уровень', slug: '6 уровень'},
        {id: '7', name: '7 уровень', slug: '7 уровень'},
        {id: '8', name: '8 уровень', slug: '8 уровень'},
        {id: '9', name: '9 уровень', slug: '9 уровень'},
        {id: '10', name: '10 уровень', slug: '10 уровень'},
    ] as ISelect[];
    const pupilsOptions = [
        {id: '1', name: '1', slug: '1'},
        {id: '2', name: '2', slug: '2'},
        {id: '3', name: '3', slug: '3'},
        {id: '4', name: '4', slug: '4'},
        {id: '5', name: '5', slug: '5'},
        {id: '6', name: '6', slug: '6'},
        {id: '7', name: '7', slug: '7'},
        {id: '8', name: '8', slug: '8'},
        {id: '9', name: '9', slug: '9'},
        {id: '10', name: '10', slug: '10'},
        {id: '11', name: '11', slug: '11'},
        {id: '12', name: '12', slug: '12'},
    ] as ISelect[];
    useEffect(() => {
        const fetchData = async () => {
            await PermissionsService.getUsers('TRANER', undefined, undefined, 'name').then(users=> {
                const tmp = [] as ISelect[];
                users.data.users.map(user => {
                    tmp.push({id: user._id, name: `${user.name} ${user.sname} ${user?.tname}`, slug: user._id})
                })
                setTranersOptions(tmp);
                setValue('traners', []);
            });
        }
        void fetchData();
    }, [])
    const { control, watch, register, getValues, setValue, handleSubmit, formState: {errors} } = useForm<Form>({defaultValues: {graphics: edit ? [] : [{graphic: []}], level: levelsOptions[0], pupils: pupilsOptions[0], starts: new Date() }});
    const registerWithMask = useHookFormMask(register);
    const {fields, append, remove } = useFieldArray({control, name: "graphics", rules: { minLength: 1 } });
    useEffect(() => {
        const subscription = watch((value, { name, type }) =>{
            if(!editState) {
                if(name !== 'name') {
                    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                    const dates = [];
                    value.graphics?.map(graphic=>{
                        const date = graphic?.graphic.map(item=> item.slug).join('-').toLowerCase() + ' ' + graphic?.starttime + ' ' + graphic?.time + ' мин.'
                        dates.push(date);
                    })
    
                    setValue('name', dates.join(', ') + ' ' + getValues('traners').map(traner=> traner.name.split(' ')[0] + '. ' + traner.name.split(' ')[2]));
                }
    
                if(name?.includes('time') && !name?.includes('endtime')) {
                    const split = name.split('.');
                    if(value.graphics[split[1]]?.starttime) {
                        if(value.graphics[split[1]].time) {
                            const time = new Date('01.01.2023 '+ value.graphics[split[1]]?.starttime);
                            time.setMinutes(time.getMinutes() + +value.graphics[split[1]].time)
                            setValue(`graphics.${split[1]}.endtime`, time.getHours().toString()+":"+ (time.getMinutes()<10?'0':'') + time.getMinutes().toString());
                        }
                    }
                }
    
                if(name?.includes('endtime')) {
                    const split = name.split('.');
                    if(value.graphics[split[1]]?.starttime && value.graphics[split[1]]?.endtime) {
                        const time = ((new Date('01.01.2023 '+ value.graphics[split[1]]?.endtime)).getTime() - (new Date('01.01.2023 '+ value.graphics[split[1]]?.starttime)).getTime())/60000;
                        if(time) {
                            setValue(`graphics.${split[1]}.time`, time);
                        }
                        
                    }
                }
            }
        })

        return () => subscription.unsubscribe()
    }, [watch, editState])
    
    const onSubmit: SubmitHandler<Form> = async (data, e) => {
        e?.preventDefault();
        try {
            const startsParse = parse(data.graphics[0].starttime, 'H:mm', new Date(data.starts));
            const startsISO = formatISO(new Date(startsParse));
            const tranersData = [] as Array<string>;
            data.traners.map(tran=> tranersData.push(tran.id));
            const dates = [];
            data.graphics.map(graphic =>{
                const days = [] as Array<number>;
                graphic.graphic.map(day=>{
                    switch (day.slug) {
                        case 'Пн':
                            days.push(1);
                            break;
                        case 'Вт':
                            days.push(2);
                            break;
                        case 'Ср':
                            days.push(3);
                            break;
                        case 'Чт':
                            days.push(4);
                            break;
                        case 'Пт':
                            days.push(5);
                            break;
                        case 'Сб':
                            days.push(6);
                            break;
                        case 'Вс':
                            days.push(7);
                            break;
                        default:
                            break;
                    }
                })
                dates.push({days: days, time: graphic.starttime, current: graphic.time, endtime: graphic.endtime})
            })
            
            if(edit && (groupId || group_id)) {
                let group = '';
                if(groupId) {
                    group = groupId
                } else if(group_id) {
                    group = group_id;
                }
                const response = await dispatch(editGroup({groupId: group, payload: {name: getValues('name'), traners: tranersData, level: data.level.name, start: startsISO, dates: dates}}));
                const res = response.payload as ServerError;
                if(res?.error) {
                    setEModal(true);
                    setModalError(res.error)
                } else {
                    setModal(false);
                }
            } else {
                const response = await dispatch(createGroup({name: getValues('name'), traners: tranersData, level: data.level.name, starts: startsISO, dates: dates}));
                const res = response.payload as ServerError;
                if(res?.error) {
                    setEModal(true);
                    setModalError(res.error)
                } else {
                    setModal(false);
                }
                if(callback) {
                    callback(getValues('name'));
                }
            }
            
        } catch (error) {
            console.log(error);
            setEModal(true);
            setModalError('Ошибка при заполнении дат или времени')
        }
    }
    const setTimePointsHandler = (value: {starttime: string, endtime: string}) => {
        setTimePoints(value);
        setValue('startpos', value.starttime)
        if(value.starttime && value.endtime) {
            const time = ((new Date('01.01.2023 '+ value.endtime)).getTime() - (new Date('01.01.2023 '+ value.starttime)).getTime())/60000;
            if(time) {
                setValue('time', time);
            }
            
        }
    }

    useEffect(() => {
        if(edit && (groupId || group_id)) {
            let group = '';
            if(groupId) {
                group = groupId
            } else if(group_id) {
                group = group_id;
            }
            const fetchData = async () => {
                await GroupService.getGroup(group)
                .then((res)=>{
                    const dates = [];
                    if(res.data.group.dates) {
                        res.data.group.dates.map(item=> {
                            const graphic = [];
                            item.days.map(day=> {
                                switch (day) {
                                    case 1:
                                        graphic.push({id: '1', name:"Понедельник",slug:"Пн"})
                                        break;
                                    case 2:
                                        graphic.push({id: '2', name:"Вторник",slug:"Вт"});
                                        break;
                                    case 3:
                                        graphic.push({id: '3', name:"Среда",slug:"Ср"});
                                        break;
                                    case 4:
                                        graphic.push({id: '4', name:"Четверг",slug:"Чт"});
                                        break;
                                    case 5:
                                        graphic.push({id: '5', name:"Пятница",slug:"Пт"});
                                        break;
                                    case 6:
                                        graphic.push({id: '6', name:"Суббота",slug:"Сб"});
                                        break;
                                    case 7:
                                        graphic.push({id: '7', name:"Воскресение",slug:"Вс"});
                                        break;
                                    default:
                                        break;
                                }
                            })
                            dates.push({graphic: graphic, starttime: item.time, endtime: item.endtime, time: item.current});
                        })
                    }
                    setValue('graphics', dates)
                    
                    const tmpTraners = [] as ISelect[];
                    res.data.group.users.map(user=>{
                        if(user.role === 'TRANER') {
                            tmpTraners.push({id: user._id, name: `${user.name} ${user.sname}`, slug: user._id});
                        }
                    })
                    setValue('traners', tmpTraners);
                    const nameSplit = res.data.group.name.split(' ');
                    const days = nameSplit[0].split(/\,|-/);
                    const tmpDays = [] as string[];
                    days.map(day=> {
                        tmpDays.push(day.charAt(0).toUpperCase() + day.slice(1));
                    })
                    const tmpDays2 = [] as ISelect[];
                    tmpDays.map(day=>{
                        const cond = graphicOptions.find(itm=> itm.slug === day);
                        if(cond) {
                            tmpDays2.push(cond);
                        }
                    })
                    //setValue('graphic', tmpDays2);
                    setValue('startpos', nameSplit[1]);
                    setTimePoints({...timePoints, starttime: nameSplit[1]});
                    setValue('time', +nameSplit[2]);
                    const level = levelsOptions.find(itm=> itm.slug === res.data.group.level);
                    if(level) {
                        setValue('level', level);
                    }
                    setValue('starts', new Date(res.data.group.start));
                    setValue('name', res.data.group.name);
                    setEditState(false);
                });
            }
            void fetchData();
        }
    }, [tranersOptions])

    return (
        <>
            <Modal active={modal} setActive={setModal} className='items-center !rounded-3xl max-w-[900px] border-2 border-[#8A6E3E]'>
                <h1 className='text-2xl font-bold tracking-wider text-gray-800 capitalize '>{edit ? 'Edit group' : 'Create group'}</h1>
                <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className='bg-white container mx-auto flex flex-col px-10 py-5'>
                    <Input read={(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') ? false : true} wrapperClass='mb-5' type="text" placeholder='Название  (Имя будет записано автоматически согласно примечаниям в разделе «График», «Длительность» и «Педагог».)' error={errors.name?.message} register={register('name', { required: "The field must be filled" })}/>
                    {fields.map((item, index)=>
                        <div className="flex mb-5">
                            <div className={`relative w-full mr-5`} style={{zIndex: 999-index}}>
                                <Controller
                                    name={`graphics.${index}.graphic`}
                                    control={control}
                                    rules={{required: "The field must be filled"}}
                                    render={({ field: { onChange } }) =>
                                        <Select className='absolute w-full' multiple={true} showMultipleValues={true} placeholder='День недели' options={graphicOptions} value={getValues(`graphics.${index}.graphic`)} 
                                        onChange={(e) => {
                                            onChange(e);
                                        }}/>
                                    }
                                />
                            </div>
                            <div className="flex border border-[#B7975A] rounded-full py-1 px-5">
                                {edit
                                ?
                                <Input className='border-[#ccc] !py-2' register={register(`graphics.${index}.starttime`, { required: "The field must be filled" })}  wrapperClass='mr-2' type="text" placeholder=' мин'/>
                                :
                                <InputMask mask="99:99" {...register(`graphics.${index}.starttime`, { required: "The field must be filled" })}>
                                    {(inputProps) => <Input {...inputProps} children={'>>'} className='border-[#ccc] !py-2 !pl-6' error={errors.graphics?.[index]?.starttime?.message} wrapperClass='mr-2' type="text" placeholder='Нач. время'/>}
                                </InputMask>
                                }

                                
                                
                                <Input className='border-[#ccc] !py-2' register={register(`graphics.${index}.time`, { required: "The field must be filled" })}  wrapperClass='mr-2' type="text" placeholder=' мин'/>
                                
                                <Input className='border-[#ccc] !py-2' register={register(`graphics.${index}.endtime`, { required: "The field must be filled" })}  wrapperClass='mr-2' type="text" placeholder=' мин'/>
                                
                              
                                
                                
                                  
                                {/* <InputMask mask="99:99" {...register(`graphics.${index}.endtime`, { required: "The field must be filled" })}>
                                    
                                </InputMask> */}
                                
                            </div>
                        </div>
                    )}
                    <div className="flex w-full mb-5">
                        <MainButton className='mr-5 w-full' type="button" onClick={() => {append({ graphic: [] });}}>Добавить</MainButton>
                        <MainButton className='w-full' type="button" onClick={() => remove(fields.length - 1)}>Удалить</MainButton>
                    </div>
                    {(tranersOptions && getValues('traners')) &&
                        <Controller
                            name="traners"
                            control={control}
                            rules={{required: "The field must be filled"}}
                            render={({ field: { onChange } }) =>
                                <ComboSelect name='Тренера' multiple={true} options={tranersOptions} value={getValues('traners')} 
                                onChange={(e) => {
                                    onChange(e);
                                }}/>
                            }
                        />
                    }
                    <div className="flex w-full justify-between">
                        <Controller
                            name="level"
                            control={control}
                            rules={{required: "The field must be filled"}}
                            render={({ field: { onChange } }) =>
                                <Select className='w-full mr-5' options={levelsOptions} value={getValues('level')} 
                                onChange={(e) => {
                                    onChange(e);
                                }}/>
                            }
                        />
                        <Controller
                            name="pupils"
                            control={control}
                            rules={{required: "The field must be filled"}}
                            render={({ field: { onChange } }) =>
                                <Select className='w-full' name='Кол-во учеников:' options={pupilsOptions} value={getValues('pupils')} 
                                onChange={(e) => {
                                    onChange(e);
                                }}/>
                            }
                        />
                    </div>
                    <div className="flex border items-center border-[#B7975A] rounded-full py-1 px-5 mb-5">
                        <p className='font-bold text-base w-full'>Начало обучения</p>
                        <Controller
                            name="starts"
                            control={control}
                            rules={{required: "The field must be filled"}}
                            render={() =>
                                <DatePicker
                                    selected={getValues('starts')}
                                    dateFormat="dd.MM.yyyy"
                                    locale="enGB"
                                    onChange={(date: Date) => setValue('starts', date)} 
                                    placeholderText="Weeks start on Monday"
                                    customInput={
                                        <InputMask mask="99.99.9999">
                                            {(inputProps) => <Input {...inputProps} type='text' className='border-[#ccc] !py-2 text-center' wrapperClass='w-full' error={errors.starts?.message}/>}
                                        </InputMask>
                                        
                                    }
                                />
                            }
                        />
                    </div>
                    
                    
                    <div className="flex justify-end">
                        <MainButton type='button' onClick={()=>setModal(false)} className='mr-3 !px-10'>Close</MainButton>
                        <MainButton className='!px-10 bg-gradient-button-green'>Save</MainButton>
                    </div>
                </form>
            </Modal>
            <AuthErrorModal modal={eModal} setModal={setEModal} error={modalError}/>
        </>
    )
}

export default CreateFullGroupModal;