import { FC, useEffect } from 'react'
import MenuItemMobile from './MenuItemMobile';
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

const MenuMobile: FC<MenuProps> = ({closedmenu, setModal}) => {

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
        <nav className='xl:hidden'>
            <ul className=' flex justify-center align-middle mx-4   bg-gradient-menu h-full'>
                
                {user.role !== 'NEWUSER' &&
                    <MenuItemMobile setModal={setModal} title='Мессенджер' closedmenu={closedmenu} to='/messenger' ico={Messenger}><div className='absolute top-1 right-1 ml-3 bg-apricot px-1 min-w-[28px] flex justify-center text-lg rounded-full text-black'>{unreaded}</div></MenuItemMobile>
                }
                {user.role === 'NEWUSER' &&
                    <MenuItemMobile setModal={setModal} title='Группы' closedmenu={closedmenu} to='/messenger' ico={Groups}></MenuItemMobile>
                }
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANER' || user.role === 'ADMIN') &&
                    <MenuItemMobile setModal={setModal} title='Мои группы' closedmenu={closedmenu} to='/mygroups' ico={Groups}></MenuItemMobile>
                }
                {(user.role === 'STUDENT' || user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANERMETODIST') &&
                    <MenuItemMobile setModal={setModal} title='Уроки' closedmenu={closedmenu} to='/lessons' ico={Lessons}></MenuItemMobile>
                }

                {(user.role === 'STUDENT' || user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANERMETODIST') &&
                    <MenuItemMobile setModal={setModal} title='Домашнее задание' closedmenu={closedmenu} to='/homework' ico={Homework}></MenuItemMobile>
                }
                {(user.role === 'STUDENT' || user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANER' || user.role === 'TRANERMETODIST') &&
                    <MenuItemMobile setModal={setModal} title='Видеоуроки' closedmenu={closedmenu} to='/video' ico={Video}></MenuItemMobile>
                }
                {(user.role === 'STUDENT' || user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANERMETODIST') &&
                    <MenuItemMobile setModal={setModal} title='Доступ' closedmenu={closedmenu} to='/balance' ico={Requizits}></MenuItemMobile>
                }
                {(user.role === 'STUDENT' || user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANERMETODIST') &&
                    <MenuItemMobile setModal={setModal} title='Советы родителям' closedmenu={closedmenu} to='/faq' ico={Faq}></MenuItemMobile>
                }
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANER') &&
                    <MenuItemMobile setModal={setModal} title='Советы родителям' closedmenu={closedmenu} to='/faqtrainers' ico={Faq}></MenuItemMobile>
                }
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') &&
                    <MenuItemMobile setModal={setModal} title='Программа школы' closedmenu={closedmenu} to='/program' ico={Program}></MenuItemMobile>
                }
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANERMETODIST') &&
                    <MenuItemMobile setModal={setModal} title='Пробный урок' closedmenu={closedmenu} to='/testlesson' ico={TestLesson}></MenuItemMobile>
                }
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'ADMIN') &&
                    <MenuItemMobile setModal={setModal} title='Ждут группу' closedmenu={closedmenu} to='/groupwaiting' ico={Groups}></MenuItemMobile>
                }
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'ADMIN') &&
                    <MenuItemMobile setModal={setModal} title='Доступ' closedmenu={closedmenu} to='/permissions' ico={Access}></MenuItemMobile>
                }
            </ul>
        </nav>
    )
}

export default MenuMobile;