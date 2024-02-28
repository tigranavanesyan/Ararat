import { FC, useState, useEffect } from 'react'
import TopMenu from '../components/UI/TopMenu/TopMenu';
import { getGroups } from '../store/reducers/GroupSlice';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import DatePicker, { registerLocale } from 'react-datepicker';
import enGB from 'date-fns/locale/en-GB';
registerLocale('enGB', enGB);
import Input from '../components/UI/Main/Input';
import Select from '../components/UI/Main/Select';
import { ISelect } from '../models/ISelect';
import MainButton from '../components/UI/MainButton';
import { editUser } from '../store/reducers/UserSlice';
import { useQuery } from '../hooks/useQuery';
import AuthErrorModal from '../components/Modals/AuthError';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import SuccessModal from '../components/Modals/SuccessModal';
import { CiEdit } from '@react-icons/all-files/ci/CiEdit'
import Man from '../assets/icons/man.png'
import WoMan from '../assets/icons/woman.png'
import cryptoRandomString from 'crypto-random-string';
import CheckBox from '../components/UI/Main/CheckBox';
import copy from 'copy-to-clipboard';
import { EmailValidation } from '../utils/ValidationRules';
import { logout } from '../store/reducers/UserSlice';
import InputMask from 'react-input-mask';
import {AiFillQuestionCircle} from '@react-icons/all-files/ai/AiFillQuestionCircle'
import { IoIosArrowDown } from '@react-icons/all-files/io/IoIosArrowDown'
import { IoIosArrowUp } from '@react-icons/all-files/io/IoIosArrowUp'
import Modal from '../components/UI/Modal';
import { Disclosure } from '@headlessui/react'
import { da, it } from 'date-fns/locale';

type Form = {
    name: string,
    sname: string,
    tname: string,
    email: string,
    comments: string,
    date: Date | undefined,
    country: ISelect | string,
    format: ISelect | string,
    durency: ISelect | string,
    sex: string;
    password: string
};

const CabinetPage: FC = () => {
    const countryOptions = [
        {id: '1', name: 'Россия', slug: 'Россия'},
        {id: '2', name: 'Европа', slug: 'Europe'},
        {id: '3', name: 'Америка', slug: 'America'},
        {id: '3', name: 'Канада', slug: 'Canada'},
        {id: '4', name: 'Армения', slug: 'Armenia'},
    ] as ISelect[];

    const formatOptions = [
        {id: '1', name: 'Группа', slug: 'group'},
        {id: '2', name: 'Индивидуально', slug: 'ind'},
        {id: '3', name: 'Группа + Индивидуально', slug: 'groupind'},
    ] as ISelect[];

    const durencyOptions = [
        {id: '1', name: '20', slug: '20'},
        {id: '2', name: '40', slug: '40'},
        {id: '3', name: '60', slug: '60'},
        {id: '3', name: '90', slug: '90'},
    ] as ISelect[];

    const [modal, setModal] = useState<boolean>(false);
    const [calendar, setCalendrar] = useState(
        [
            {id: 0, time: '9:00', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 1, time: '9:30', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 2, time: '10:00', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 3, time: '10:30', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 4, time: '11:00', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 5, time: '11:30', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 6, time: '12:00', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 7, time: '12:30', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 8, time: '13:00', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 9, time: '13:30', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 10, time: '14:00', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 11, time: '14:30', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 12, time: '15:00', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 13, time: '15:30', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 14, time: '16:00', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 15, time: '16:30', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 16, time: '17:00', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 17, time: '17:30', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 18, time: '18:00', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 19, time: '18:30', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 20, time: '19:00', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 21, time: '19:30', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 22, time: '20:00', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 23, time: '20:30', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 24, time: '21:00', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 25, time: '21:30', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
            {id: 26, time: '22:00', pn: false, vt: false, sr: false, ct: false, pt: false, sb: false, vs: false},
        ]
    );
    const [calendarError, setCalendrarError] = useState<string>('');
    const [eMsg, setEMsg] = useState<string>('');
    const [modal2, setModal2] = useState<boolean>(false);
    const [modal3, setModal3] = useState<boolean>(false);
    const [infoText, setInfoText] = useState<string>('');
    const { user } = useAppSelector(state=> state.UserSlice);
    const { groups } = useAppSelector(state=> state.GroupSlice)
    const dispatch = useAppDispatch();
    const [edit, setEdit] = useState<boolean>(false);
    const [changePwd, setChangePwd] = useState<boolean>(false);
    const [copyText] = useState<string>('"Уважаемый администратор школы, откройте, пожалуйста, доступ к порталу Арарат.\nМы прошли регистрацию с именем - Иванов Иван Иванович." ');
    const [copyState, setCopyState] = useState<boolean>(false)
    

    const logOutHandler = async () => {
        await dispatch(logout());
    }

    const query = useQuery();
    
    const { control, watch, register, setError, getValues, setValue, handleSubmit, formState: {errors} } = useForm<Form>({defaultValues: {country: '', format: '', durency: ''}});

    const req = query.get('req');
    const role = query.get('role');
    useEffect(() => {
        if(req) {
            setModal(true);
            setEMsg('Перед использование платформы заполните свой профиль!')
        }
        if(role) {
            setModal2(true);
        }
    }, [req])
    
    useEffect(() => {
        const fetchData = async() => {
            await dispatch(getGroups({}));
        }
        void fetchData();
    }, [dispatch])

    useEffect(() => {
        if(user.born) {
            setValue('date', new Date(user.born))
        }
        
        if(user.country) {
            const c = countryOptions.find(c => c.slug === user.country) as ISelect;
            setValue('country', c);
        }

        if(user.format) {
            const c = formatOptions.find(c => c.slug === user.format) as ISelect;
            setValue('format', c);
        }

        if(user.durency) {
            const c = durencyOptions.find(c => c.slug === user.durency) as ISelect;
            setValue('durency', c);
        }

        setValue('email', user.email);
        setValue('name', user.name);
        setValue('sname', user.sname);
        setValue('tname', user.tname);
        if(user.comment) {
            setValue('comments', user.comment);
        }
        if(user.sex) {
            setValue('sex', user.sex);
        }
        if(user.shedule) {
            user.shedule.map(item=> {
                const indx = calendar.findIndex(citem=> citem.time === item.time);
                if(indx !== -1) {
                    {item.days.map(day=>{
                        switch (day) {
                            case 'pn':
                                setCalendrar(state => state.map(item=> item.id === indx ? {...item, pn: true} : item) );
                                break;
                            case 'vt':
                                setCalendrar(state => state.map(item=> item.id === indx ? {...item, vt: true} : item) );
                                break;
                            case 'sr':
                                setCalendrar(state => state.map(item=> item.id === indx ? {...item, sr: true} : item) );
                                break;
                            case 'ct':
                                setCalendrar(state => state.map(item=> item.id === indx ? {...item, ct: true} : item) );
                                break;
                            case 'pt':
                                setCalendrar(state => state.map(item=> item.id === indx ? {...item, pt: true} : item) );
                                break;
                            case 'sb':
                                setCalendrar(state => state.map(item=> item.id === indx ? {...item, sb: true} : item) );
                                break;
                            case 'vs':
                                setCalendrar(state => state.map(item=> item.id === indx ? {...item, vs: true} : item) );
                                break;
                        
                            default:
                                break;
                        }
                    })}
                }
            })
        }
    }, [user])

    const onSubmit: SubmitHandler<Form> = async (data, e) => {
        e?.preventDefault();
        const date = [];
        calendar.map(item=>{
            const itm = {time: item.time, days: [] as string[]};
            if(item.pn) {
                itm.days.push('pn');
            }
            if(item.vt) {
                itm.days.push('vt');
            }
            if(item.sr) {
                itm.days.push('sr');
            }
            if(item.ct) {
                itm.days.push('ct');
            }
            if(item.pt) {
                itm.days.push('pt');
            }
            if(item.sb) {
                itm.days.push('sb');
            }
            if(item.vs) {
                itm.days.push('vs');
            }

            if(itm.days.length > 0) {
                date.push(itm);
            }
        })
        if(date.length > 0) {
            setCalendrarError('');
            const payload = {} as {password: string};
            if(changePwd && data.password.length > 0) {
                payload.password = data.password;
            }
            await dispatch(editUser({name: data.name, sname: data.sname, tname: data.tname, email: data.email.toLowerCase(), born: data.date, country: data.country.slug, shedule:date, sex: data.sex, format: data.format.slug, durency: data.durency.slug, comment: data.comments, ...payload}));
            setModal2(true)
        } else {
            setCalendrarError('Календарь должен быть заполнен.');
        }

    }

    return (
        <div className='w-full'>
            <div className="px-10 max-2xl:px-2 py-5 overflow-auto h-[calc(100vh-20px)]">
                <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className='w-full flex flex-col items-center px-5 py-5 bg-[#f0f0f0] rounded-xl'>
                    <div className="flex justify-between items-stretch w-full mb-16">
                        <div className="flex items-center border mr-5 border-[#B7975A] rounded-xl px-4 py-10 max-2xl:mr-5">
                            <div className="w-32 h-32 mr-10 overflow-hidden mb-5 border-[#B7975A] border rounded-full"><img className='w-full h-full' src={user.avatar} alt="avatar" /></div>
                            {!edit &&
                                <div className='flex flex-col'>
                                    <p className='font-bold text-xl flex items-center text-gray-600'><span className='text-black'>Имя: </span> {user.name}</p>
                                    <p className='text-red-500'>{errors.name?.message && 'Имя: ' + errors.name?.message}</p>
                                    <p className='font-bold text-xl flex items-center text-gray-600'><span className='text-black'>Фамилия: </span> {user.sname}</p>
                                    <p className='text-red-500'>{errors.sname?.message && 'Фамилия: ' + errors.sname?.message}</p>
                                    <p className='font-bold text-xl flex items-center text-gray-600'><span className='text-black'>Отчество: </span> {user.tname}</p>
                                    <p className='text-red-500'>{errors.tname?.message && 'Отчество: ' + errors.tname?.message}</p>
                                    
                                    <button title='Редактировать' className='ml-3 text-2xl mt-2' onClick={()=> setEdit(true)}><CiEdit /></button>
                                </div>
                                
                            }
                            <div className={[edit ? 'flex flex-col': 'hidden'].join(' ')} >
                                <Input wrapperClass='mb-6' type='text' placeholder='Name:' error={errors.name?.message} register={register('name', { required: "The field must be filled", 
                                pattern: {value: /^((?!Пользователь).)*$/, message: "The field must be filled"},
                                validate: {
                                    spaceCheck: (value) => /^[^\s()-]*$/.test(value) || "The field must not contain spaces"
                                } })} />
                                <Input wrapperClass='mb-6' type='text' placeholder='Sname:' error={errors.sname?.message} register={register('sname', { required: "The field must be filled", validate: {
                                    spaceCheck: (value) => /^[^\s()-]*$/.test(value) || "The field must not contain spaces"
                                } })} />
                                <Input type='text' placeholder='Отчество:' error={errors.tname?.message} register={register('tname', {validate: {
                                    spaceCheck: (value) => /^[^\s()-]*$/.test(value) || "The field must not contain spaces"
                                } })} />
                            </div>
                        </div>
                        {groups.length > 0 &&
                            <div className='flex flex-col basis-[70%] border rounded-xl p-2 border-[#B7975A]'>
                                <p className='mb-5 text-lg max-2xl:text-base font-bold text-center text-red-500'>Данную информацию редактирует администрация школы, если что-то не правильно пишите администратору.</p>
                                <div className="w-full">
                                    <div className="flex max-w-[1000px] w-full">
                                        <div className="flex flex-col w-full mr-5">
                                            <div className="w-full border border-[#B7975A] flex justify-between rounded-full py-3 px-5 font-bold max-2xl:font-semibold mb-3">
                                                <div>Готов к сеансу: {user.seance ?'Да':'Нет'}</div>
                                                <button type='button' className="flex items-center text-sm text-blue-600" onClick={()=> {setModal3(true), setInfoText('Текст будет с 23.10.2023')}}>Подробнее <AiFillQuestionCircle className='ml-2 text-xl text-gray-600'/></button>
                                            </div>
                                            <div className="w-full border border-[#B7975A] flex justify-between rounded-full py-3 px-5 font-bold max-2xl:font-semibold mb-3">
                                                <div className="">Онлайн турниры: {user.online ?'Да':'Нет'}</div>
                                                <button type='button' className="flex items-center text-sm text-blue-600" onClick={()=> {setModal3(true), setInfoText('Текст будет с 23.10.2023')}}>Подробнее <AiFillQuestionCircle className='ml-2 text-xl text-gray-600'/></button>
                                            </div>
                                            <div className="w-full border border-[#B7975A] flex justify-between rounded-full py-3 px-5 font-bold max-2xl:font-semibold mb-3">
                                                <div className="">Офлайн турниры: {user.offline ?'Да':'Нет'}</div>
                                                <button type='button' className="flex items-center text-sm text-blue-600" onClick={()=> {setModal3(true), setInfoText('Текст будет с 23.10.2023')}}>Подробнее <AiFillQuestionCircle className='ml-2 text-xl text-gray-600'/></button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <div className="w-full border border-[#B7975A] rounded-full py-3 px-5 font-bold max-2xl:font-semibold mb-3">
                                                <div className="">Педагог: {groups[0].users.find(user => user.role === 'DIRECTOR')?.name}</div>
                                            </div> 
                                            <div className="w-full border flex justify-between border-[#B7975A] rounded-full py-3 px-5 font-bold max-2xl:font-semibold mb-3">
                                                <div className="">Предмет: {groups[0].level}</div>
                                                <button type='button' className="flex items-center text-sm text-blue-600" onClick={()=> {setModal3(true), setInfoText('Текст будет с 23.10.2023')}}>Подробнее <AiFillQuestionCircle className='ml-2 text-xl text-gray-600'/></button>
                                            </div>
                                            <div className="w-full border border-[#B7975A] rounded-3xl py-3 px-5 font-bold max-2xl:font-semibold mb-3">
                                                {groups.length > 3
                                                ?
                                                    <Disclosure>
                                                        {({ open }) => (
                                                            /* Use the `open` state to conditionally change the direction of an icon. */
                                                            <>
                                                            <Disclosure.Button as='div' className='cursor-pointer flex items-center'>
                                                                Группы: {groups.map((group, index)=> {
                                                                    index++;
                                                                    if(index < 4) {
                                                                        return(
                                                                            group.name + ', '
                                                                        )
                                                                    }
                                                                })} <span className='text-base text-blue-600 flex items-center'>еще {open ? <IoIosArrowUp className='ml-2 mt-1'/> : <IoIosArrowDown className='ml-2 mt-1'/>}</span>
                                                            </Disclosure.Button>
                                                            <Disclosure.Panel>
                                                                {groups.map((group, index)=> {
                                                                        index++;
                                                                        if(index > 3) {
                                                                            return(
                                                                                group.name + ', '
                                                                            )
                                                                        }
                                                                })}
                                                            </Disclosure.Panel>
                                                            </>
                                                        )}
                                                    </Disclosure>
                                                :
                                                    <>
                                                        Группы: {groups.map(group=> group.name + ', ')}
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="flex flex-col w-full">
                        <div className='flex flex-col w-full'>
                            <div className="flex justify-between">
                                <Controller
                                    name="date"
                                    control={control}
                                    rules={{required: "The field must be filled"}}
                                    render={() =>
                                        <div className='flex basis-1/3 mr-2'>
                                            <DatePicker
                                                wrapperClassName='w-full'
                                                selected={getValues('date')}
                                                dateFormat="dd.MM.yyyy"
                                                locale="enGB"
                                                onChange={(date: Date) => setValue('date', date)} 
                                                placeholderText="Дата рождения"
                                                customInput={
                                                    <InputMask mask="99.99.9999">
                                                        {(inputProps) => <Input {...inputProps} type='text' className='text-center w-full' wrapperClass='w-full' error={errors.date?.message}/>}
                                                    </InputMask>
                                                    
                                                }
                                            />
                                        </div>
                                    }
                                />
                                <Controller
                                    name="country"
                                    control={control}
                                    rules={{required: "The field must be filled"}}
                                    render={({ field: { onChange } }) =>
                                        <Select className='basis-1/3' wrapperClass='ml-2 basis-1/3 mr-5' error={errors.country?.message} name='Страна:' options={countryOptions} value={getValues('country')} 
                                        onChange={(e) => {
                                            onChange(e);
                                        }}/>
                                    }
                                />
                                <div className="basis-1/3">
                                    <Input read={user.lichess ? true : false} className={user.lichess && 'bg-gray-300'} wrapperClass='w-full' type='text' placeholder='Email' error={errors.email?.message} register={register('email', EmailValidation)} />
                                    {user.lichess &&
                                        <p className='mt-5'>Эта почта с которой вы прошли регистрацию на <a href="https://lichess.org" target='_blank' className='text-blue-500'>lichess.org</a>, далее прошли авторизацию с <a href="https://lichess.org" target='_blank' className='text-blue-500'>lichess.org</a> на нашем портале <a href="https://puzzle.araratchess.com" target='_blank' className='text-blue-500'>puzzle.araratchess.com</a>. Если вы забудете пароль от вашего lichess, можно восстановить по этой почте</p>
                                    }
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex items-center ">
                                    <div className='mr-5'>
                                        <input className='peer hidden' id='man' type="radio" {...register('sex', { required: "The field must be filled" })} value='man' />
                                        <label className={'cursor-pointer p-2 flex rounded-full overflow-hidden bg-gradient-button peer-checked:bg-gradient-appricot'} htmlFor="man"><img src={Man} alt="man" /></label>   
                                    </div>
                                    <div className='mr-5'>
                                        <input className='peer hidden' type="radio" id='woman' {...register('sex', { required: "The field must be filled" })} value='woman' />
                                        <label className={'cursor-pointer p-2 flex rounded-full overflow-hidden bg-gradient-button peer-checked:bg-gradient-appricot'} htmlFor="woman"><img src={WoMan} alt="woman" /></label>
                                    </div>
                                    <p className='text-red-500 font-bold text-lg'>{errors.sex?.message && 'Sex: ' + errors.sex?.message}</p>
                                </div>
                                {!user.lichess &&
                                    <div className="relative flex justify-between w-full items-center">
                                        <CheckBox checked={changePwd} onChange={()=> setChangePwd(changePwd ?false:true)} wrapperClass='w-[200px]'  label='Сменить пароль'/>
                                        <Input read={changePwd ? false : true} className={changePwd ? 'bg-white' : 'bg-gray-300'} wrapperClass='w-full mx-5' type='text' placeholder='Password:' register={register('password')} />
                                        <button type='button' className='absolute right-5 text-[#353535] font-semibold border border-[#B7975A] bg-white rounded-full h-full px-10' onClick={()=> changePwd && setValue('password', cryptoRandomString({length: 15, type: 'base64'}))}>Авто</button>
                                    </div>
                                }
                            </div>
                            
                        </div>
                    </div>
                    
                    <div className="flex w-full mt-5">
                        <Controller
                            name="format"
                            control={control}
                            rules={{required: "The field must be filled"}}
                            render={({ field: { onChange } }) =>
                                <Select className='basis-1/3' wrapperClass='basis-1/3' error={errors.format?.message} name='Формат:' options={formatOptions} value={getValues('format')} 
                                onChange={(e) => {
                                    onChange(e);
                                }}/>
                            }
                        />
                        <Controller
                            name="durency"
                            control={control}
                            rules={{required: "The field must be filled"}}
                            render={({ field: { onChange } }) =>
                                <Select className='basis-1/3' wrapperClass='ml-2 basis-1/3' error={errors.durency?.message} name='Длительность урока:' options={durencyOptions} value={getValues('durency')} 
                                onChange={(e) => {
                                    onChange(e);
                                }}/>
                            }
                        />
                        <Input wrapperClass='basis-1/3 ml-2' type='text' placeholder='Коментарии по графику:' error={errors.comments?.message} register={register('comments', {required: 'The field must be filled'})} />
                    </div>
                    <div className="flex flex-col">
                        <table>
                            <thead className='flex'>
                                <tr>
                                    <th className='p-3 min-w-[70px]'></th>  
                                    <th className='py-3 px-[18px]'>Пн</th>
                                    <th className='py-3 px-[18px]'>Вт</th>
                                    <th className='py-3 px-[18px]'>Ср</th>
                                    <th className='py-3 px-[18px]'>Чт</th>
                                    <th className='py-3 px-[18px]'>Пт</th>
                                    <th className='py-3 px-[18px]'>Сб</th>
                                    <th className='py-3 px-[18px]'>Вс</th>
                                </tr>
                                <tr className='mr-1'>
                                    <th className='p-3 min-w-[70px]'></th>  
                                    <th className='py-3 px-[18px]'>Пн</th>
                                    <th className='py-3 px-[18px]'>Вт</th>
                                    <th className='py-3 px-[18px]'>Ср</th>
                                    <th className='py-3 px-[18px]'>Чт</th>
                                    <th className='py-3 px-[18px]'>Пт</th>
                                    <th className='py-3 px-[18px]'>Сб</th>
                                    <th className='py-3 px-[18px]'>Вс</th>
                                </tr>
                                <tr>
                                    <th className='p-3 min-w-[70px]'></th>  
                                    <th className='py-3 px-[18px]'>Пн</th>
                                    <th className='py-3 px-[18px]'>Вт</th>
                                    <th className='py-3 px-[18px]'>Ср</th>
                                    <th className='py-3 px-[18px]'>Чт</th>
                                    <th className='py-3 px-[18px]'>Пт</th>
                                    <th className='py-3 px-[18px]'>Сб</th>
                                    <th className='py-3 px-[18px]'>Вс</th>
                                </tr>
                            </thead>
                            <tbody className='flex flex-col h-[500px] flex-wrap'>
                                {calendar.map((item, indx)=>
                                    <tr key={indx}>
                                        <td className='p-3 min-w-[70px]'>{item.time}</td>
                                        <td className='p-3'><CheckBox checked={item.pn} onChange={()=> setCalendrar(state => state.map(item=> item.id === indx ? {...item, pn: item.pn ? false : true} : item) )} wrapperClass='h-[28px]'/></td>
                                        <td className='p-3'><CheckBox checked={item.vt} onChange={()=> setCalendrar(state => state.map(item=> item.id === indx ? {...item, vt: item.vt ? false : true} : item) )} wrapperClass='h-[28px]'/></td>
                                        <td className='p-3'><CheckBox checked={item.sr} onChange={()=> setCalendrar(state => state.map(item=> item.id === indx ? {...item, sr: item.sr ? false : true} : item) )} wrapperClass='h-[28px]'/></td>
                                        <td className='p-3'><CheckBox checked={item.ct} onChange={()=> setCalendrar(state => state.map(item=> item.id === indx ? {...item, ct: item.ct ? false : true} : item) )} wrapperClass='h-[28px]'/></td>
                                        <td className='p-3'><CheckBox checked={item.pt} onChange={()=> setCalendrar(state => state.map(item=> item.id === indx ? {...item, pt: item.pt ? false : true} : item) )} wrapperClass='h-[28px]'/></td>
                                        <td className='p-3'><CheckBox checked={item.sb} onChange={()=> setCalendrar(state => state.map(item=> item.id === indx ? {...item, sb: item.sb ? false : true} : item) )} wrapperClass='h-[28px]'/></td>
                                        <td className='p-3'><CheckBox checked={item.vs} onChange={()=> setCalendrar(state => state.map(item=> item.id === indx ? {...item, vs: item.vs ? false : true} : item) )} wrapperClass='h-[28px]'/></td>
                                    </tr>
                                )}
                                
                            </tbody>
                        </table>
                        <p className='text-red-500 font-bold text-lg'>{calendarError && calendarError}</p>
                        <p>{}</p>
                    </div>
                    
                    <div className="mt-12 flex justify-between w-full">
                        <MainButton onClick={() => void logOutHandler()} type='button' className='flex self-end'>Выйти из акканута</MainButton>
                        <MainButton className='flex self-end !bg-gradient-button-green'>Сохранить</MainButton>
                    </div>
                </form>
            </div>
            <AuthErrorModal modal={modal} setModal={setModal} error={eMsg}/>
            <SuccessModal className={user.role === 'NEWUSER' && 'max-w-[600px]'} modal={modal2} setModal={setModal2} title={user.role === 'NEWUSER' && 'Ура!!! Вы прошли регистрацию!!! '} message={user.role !== 'NEWUSER' && 'Данные успешно сохранены!'}>
                {user.role === 'NEWUSER' &&
                    <div className="flex flex-col items-center mt-3">
                        <p className='mb-3'>Чтобы вам открыли соответствующий доступ к порталу:</p>
                        <ul>
                            <li>1. Скопируйте текст ниже </li>
                            <li>2. Пишите ваше ФИО</li>
                            <li>3. Отправьте смс <a className='text-blue-500 underline font-semibold' target='_blank' href="https://wa.me/+37499553191 ">администратору</a> школы</li>
                        </ul>
                        <p className="whitespace-pre-wrap mt-3 mb-2">{copyText}</p>
                        <span className='font-bold italic cursor-pointer' onClick={()=> {copy(copyText); setCopyState(true)}}>({copyState ? 'скопированно' : 'копировать'})</span>
                        <p className='mt-8'><b>Если вы тренер по шахматам или администратор</b> и прошли регистрацию, напишите вашему руководителю, чтобы открыли вам соответсвующий доступ.</p>
                    </div>
                }
            </SuccessModal>
            <Modal active={modal3} setActive={setModal3}>
                <p>{infoText}</p>
            </Modal>
        </div>
    )
}

export default CabinetPage;