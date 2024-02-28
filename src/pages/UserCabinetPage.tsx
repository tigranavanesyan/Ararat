import { FC, useState, useEffect } from 'react'
import TopMenu from '../components/UI/TopMenu/TopMenu';
import DatePicker, { registerLocale } from 'react-datepicker';
import enGB from 'date-fns/locale/en-GB';
registerLocale('enGB', enGB);
import Input from '../components/UI/Main/Input';
import { ISelect } from '../models/ISelect';
import Man from '../assets/icons/man.png'
import WoMan from '../assets/icons/woman.png'
import PermissionsService from '../services/PermissionsService';
import { useParams } from 'react-router-dom';
import { User } from '../models/User';
import { Disclosure } from '@headlessui/react'
import { IoIosArrowDown } from '@react-icons/all-files/io/IoIosArrowDown'
import { IoIosArrowUp } from '@react-icons/all-files/io/IoIosArrowUp'
import CheckBox from '../components/UI/Main/CheckBox';

const UserCabinetPage: FC = () => {
    const {userId} = useParams();
    const [user, setUser] = useState<User>();
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
    useEffect(() => {
        const fetchData = async() => {
            if(userId) {
                await PermissionsService.getUser(userId).then(resp=> setUser(resp.data));
            }
            
        }
        void fetchData();
    }, [])

    useEffect(() => {
        if(user) {
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
        }
    }, [user])
    

    const formatOptions = [
        {id: '1', name: 'Группа', slug: 'group'},
        {id: '2', name: 'Индивидуально', slug: 'ind'},
        {id: '3', name: 'Группа + Индивидуально', slug: 'groupind'},
    ] as ISelect[];

    return (
        <div className='w-full'>
            <TopMenu/>
            <div className="px-10 max-2xl:px-2 py-5 overflow-auto h-[calc(100vh-90px)]">
                <div className='w-full flex flex-col items-center px-5 py-5 bg-[#f0f0f0] rounded-xl'>
                    <div className="flex justify-between items-stretch w-full mb-16">
                        <div className="flex items-center border mr-0 border-[#B7975A] rounded-xl px-16 py-10 max-2xl:mr-5">
                            <div className="w-32 h-32 mr-10 overflow-hidden mb-5 border-[#B7975A] border rounded-full"><img className='w-full h-full' src={user?.avatar} alt="avatar" /></div>
                            <div className='flex flex-col'>
                                    <p className='font-bold text-xl flex items-center text-gray-600'><span className='text-black'>Имя: </span> {user?.name}</p>
                                    <p className='font-bold text-xl flex items-center text-gray-600'><span className='text-black'>Фамилия: </span> {user?.sname}</p>
                                    <p className='font-bold text-xl flex items-center text-gray-600'><span className='text-black'>Отчество: </span> {user?.tname}</p>
                            </div>
                            
                        </div>
                        {user?.groups &&
                            user.groups.length > 0 &&
                            <div className='flex flex-col basis-[70%] border rounded-xl p-2 border-[#B7975A]'>
                                <p className='mb-5 text-lg max-2xl:text-base font-bold text-center text-red-500'>Данную информацию редактирует администрация школы, если что-то не правильно пишите администратору.</p>
                                <div className="w-full">
                                    <div className="flex max-w-[1000px] w-full">
                                        <div className="flex flex-col w-full mr-5">
                                            <div className="w-full border border-[#B7975A] flex justify-between rounded-full py-3 px-5 font-bold max-2xl:font-semibold mb-3">
                                                <div>Готов к сеансу: {user.seance ?'Да':'Нет'}</div>
                                            </div>
                                            <div className="w-full border border-[#B7975A] flex justify-between rounded-full py-3 px-5 font-bold max-2xl:font-semibold mb-3">
                                                <div className="">Онлайн турниры: {user.online ?'Да':'Нет'}</div>
                                            </div>
                                            <div className="w-full border border-[#B7975A] flex justify-between rounded-full py-3 px-5 font-bold max-2xl:font-semibold mb-3">
                                                <div className="">Офлайн турниры: {user.offline ?'Да':'Нет'}</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <div className="w-full border border-[#B7975A] rounded-full py-3 px-5 font-bold max-2xl:font-semibold mb-3">
                                                <div className="">Педагог: {user.groups[0].users.find(user => user.role === 'DIRECTOR')?.name}</div>
                                            </div> 
                                            <div className="w-full border border-[#B7975A] rounded-full py-3 px-5 font-bold max-2xl:font-semibold mb-3">
                                                <div className="">Предмет: {user.groups[0].level}</div>
                                            </div>
                                            <div className="w-full border border-[#B7975A] rounded-3xl py-3 px-5 font-bold max-2xl:font-semibold mb-3">
                                                {user.groups.length > 3
                                                ?
                                                    <Disclosure>
                                                        {({ open }) => (
                                                            <>
                                                            <Disclosure.Button as='div' className='cursor-pointer flex items-center'>
                                                                Группы: {user.groups.map((group, index)=> {
                                                                    index++;
                                                                    if(index < 4) {
                                                                        return(
                                                                            group.name + ', '
                                                                        )
                                                                    }
                                                                })} <span className='text-lg'>{open ? <IoIosArrowUp/> : <IoIosArrowDown/>}</span>
                                                            </Disclosure.Button>
                                                            <Disclosure.Panel>
                                                                {user.groups.map((group, index)=> {
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
                                                        Группы: {user.groups.map(group=> group.name + ', ')}
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
                            <div className="flex justify-between items-center">
                                <div className='flex basis-1/3 mr-2'>
                                    {user?.born &&
                                        <DatePicker
                                            wrapperClassName='w-full'
                                            selected={new Date(user?.born)}
                                            dateFormat="dd.MM.yyyy"
                                            locale="enGB"
                                            readOnly
                                            placeholderText="Дата рождения"
                                            customInput={
                                                <Input type='text' className='text-center w-full' wrapperClass='w-full'/>
                                                
                                            }
                                        />
                                    }
                                    
                                </div>
                                {user?.country&&
                                    <Input type='text' className='basis-1/3 text-center' wrapperClass='mr-2 basis-1/3' read={true} value={`Страна: ${user?.country}`}/>
                                }
                                <Input read={true} wrapperClass='w-full basis-1/3 mr-2' type='text' placeholder='Email' value={user?.email} />
                                <div className="flex items-center">
                                    <div className='mr-5'>
                                        <input className='peer hidden' id='man' type="radio" value='man' checked={user?.sex === 'man' && true} />
                                        <label className={'cursor-pointer p-2 flex rounded-full overflow-hidden bg-gradient-button peer-checked:bg-gradient-appricot'} htmlFor="man"><img src={Man} alt="man" /></label>   
                                    </div>
                                    <div className='mr-5'>
                                        <input className='peer hidden' type="radio" id='woman' value='woman' checked={user?.sex === 'woman' && true}/>
                                        <label className={'cursor-pointer p-2 flex rounded-full overflow-hidden bg-gradient-button peer-checked:bg-gradient-appricot'} htmlFor="woman"><img src={WoMan} alt="woman" /></label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex my-5">
                                {user?.format&&
                                    <Input type='text' className='basis-1/3 text-center' wrapperClass='mr-2 basis-1/3' read={true} value={`Формат: ${formatOptions.find(option => option.slug === user?.format)?.name}`}/>
                                }
                                {user?.durency&&
                                    <Input type='text' className='basis-1/3 text-center' wrapperClass='mr-2 basis-1/3' read={true} value={`Длительность: ${user.durency}`}/>
                                }
                                {user?.comment&&
                                    <Input type='text' className='basis-1/3 text-center' wrapperClass='mr-2 basis-1/3' read={true} value={user.comment}/>
                                }
                            </div>
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
                                        <td className='p-3'><CheckBox checked={item.pn} wrapperClass='h-[28px]'/></td>
                                        <td className='p-3'><CheckBox checked={item.vt} wrapperClass='h-[28px]'/></td>
                                        <td className='p-3'><CheckBox checked={item.sr} wrapperClass='h-[28px]'/></td>
                                        <td className='p-3'><CheckBox checked={item.ct} wrapperClass='h-[28px]'/></td>
                                        <td className='p-3'><CheckBox checked={item.pt} wrapperClass='h-[28px]'/></td>
                                        <td className='p-3'><CheckBox checked={item.sb} wrapperClass='h-[28px]'/></td>
                                        <td className='p-3'><CheckBox checked={item.vs} wrapperClass='h-[28px]'/></td>
                                    </tr>
                                )}
                                
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserCabinetPage;