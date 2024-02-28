import { FC, useState } from 'react'
import UserInfo from '../UserInfo';
import Menu from './Menu';
import Logo from '../../../assets/logo2.png'
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux';
import AuthErrorModal from '../../Modals/AuthError';

interface SidebarProps {
    closedmenu?: boolean;
}

const Sidebar: FC<SidebarProps> = ({closedmenu}) => {
    const { group } = useAppSelector(state=> state.GroupSlice)
    const { user } = useAppSelector(state=> state.UserSlice)
    const [modal, setModal] = useState<boolean>(false); 
    return (
        <>
            <aside className={['static flex w-full justify-center flex-col bg-[#2c2c2c] overflow-auto  pt-10 h-auto h-full shadow-lg border-r-[12px] border-r-[#818181]', closedmenu ? '' : 'min-w-[300px] w-[300px] xl:min-w-[250px] xl:w-[250px]'].join(' ')}>
                <Link to={(!group?.open || user.role === 'ADMIN') ? '/' : null} {...(group?.open && { onClick: ()=> void setModal(true) })}  className='flex justify-center'><img className={['self-center mb-10', closedmenu ? 'xl:w-20' : 'w-30 max-2xl:w-36'].join(' ')} src={Logo} alt="logo" /></Link>
                <div className="flex flex-col justify-between h-full">
                    <Menu setModal={setModal} closedmenu={closedmenu}/>
                    <UserInfo closedmenu={closedmenu}/>
                </div>
            </aside>
            {(modal && user.role !== 'ADMIN') &&
                <AuthErrorModal modal={modal} setModal={setModal} error={user.role !== 'STUDENT' ? 'Для того чтобы перейти в другие разделы закончите урок.': 'Для того чтобы перейти в другие разделы дождитесь окончания урока.'}/>
            }
        </>
    )
}

export default Sidebar;