import { FC, useEffect } from 'react'
import MenuItem from './MenuItem';
import { logout } from "../../../store/reducers/UserSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux"
import Lessons from '../../../assets/menu-icons/lessons.png'
import Groups from '../../../assets/menu-icons/groups.png'
import Program from '../../../assets/menu-icons/program.png'
import Homework from '../../../assets/menu-icons/homework.png'
import Requizits from '../../../assets/menu-icons/requizits.png'
import Video from '../../../assets/menu-icons/video.png'
import Messenger from '../../../assets/menu-icons/messenger.png'
import Faq from '../../../assets/menu-icons/faq.png'
import Access from '../../../assets/menu-icons/access.png'
import TestLesson from '../../../assets/menu-icons/testlesson.png'
import { getUnreaded } from '../../../store/reducers/MessengerSlice';

interface MenuProps {
    closedmenu?: boolean;
    setModal: (bool: boolean) => void;
}

const Menu: FC<MenuProps> = ({closedmenu, setModal}) => {

    const { user } = useAppSelector(state=>state.UserSlice)
    const { unreaded } = useAppSelector(state=>state.MessengerSlice)
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        const fetchUnreaded = async () => {
            await dispatch(getUnreaded());
        }
        void fetchUnreaded();
    }, [])

    const logoutHandler = async () => {
        await dispatch(logout());
    }

    return (
        <nav>
            <ul className='pb-3 border-t-2 border-t-white'>
                
                {user.role !== 'NEWUSER' &&
                    <MenuItem setModal={setModal} title='Мессенджер' closedmenu={closedmenu} to='/messenger' ico={Messenger}>Мессенджер <div className='ml-3 bg-apricot px-1 min-w-[28px] flex justify-center text-lg rounded-full text-black'>{unreaded}</div></MenuItem>
                }
                {user.role === 'NEWUSER' &&
                    <MenuItem setModal={setModal} title='Группы' closedmenu={closedmenu} to='/messenger' ico={Groups}>Группы</MenuItem>
                }
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANER' || user.role === 'ADMIN') &&
                    <MenuItem setModal={setModal} title='Мои группы' closedmenu={closedmenu} to='/mygroups' ico={Groups}>Группы</MenuItem>
                }
                {(user.role === 'STUDENT' || user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANERMETODIST') &&
                    <MenuItem setModal={setModal} title='Уроки' closedmenu={closedmenu} to='/lessons' ico={Lessons}>Уроки</MenuItem>
                }

                {(user.role === 'STUDENT' || user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANERMETODIST') &&
                    <MenuItem setModal={setModal} title='Домашнее задание' closedmenu={closedmenu} to='/homework' ico={Homework}>Домашнее задание</MenuItem>
                }
                {(user.role === 'STUDENT' || user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANER' || user.role === 'TRANERMETODIST') &&
                    <MenuItem setModal={setModal} title='Видеоуроки' closedmenu={closedmenu} to='/video' ico={Video}>Видеоуроки</MenuItem>
                }
                {(user.role === 'STUDENT' || user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANERMETODIST') &&
                    <MenuItem setModal={setModal} title='Доступ' closedmenu={closedmenu} to='/balance' ico={Requizits}>Баланс-реквизиты</MenuItem>
                }
                {(user.role === 'STUDENT' || user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANERMETODIST') &&
                    <MenuItem setModal={setModal} title='Советы родителям' closedmenu={closedmenu} to='/faq' ico={Faq}>Советы родителям</MenuItem>
                }
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANER') &&
                    <MenuItem setModal={setModal} title='Советы родителям' closedmenu={closedmenu} to='/faqtrainers' ico={Faq}>Советы тренерам</MenuItem>
                }
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') &&
                    <MenuItem setModal={setModal} title='Программа школы' closedmenu={closedmenu} to='/program' ico={Program}>Программа школы</MenuItem>
                }
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANERMETODIST') &&
                    <MenuItem setModal={setModal} title='Пробный урок' closedmenu={closedmenu} to='/testlesson' ico={TestLesson}>Пробный урок</MenuItem>
                }
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'ADMIN') &&
                    <MenuItem setModal={setModal} title='Ждут группу' closedmenu={closedmenu} to='/groupwaiting' ico={Groups}>Ждут группу</MenuItem>
                }
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'ADMIN') &&
                    <MenuItem setModal={setModal} title='Доступ' closedmenu={closedmenu} to='/permissions' ico={Access}>Доступ</MenuItem>
                }
            </ul>
        </nav>
    )
}

export default Menu;