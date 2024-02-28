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

const Sidebar555: FC<SidebarProps> = ({closedmenu}) => {
    const { group } = useAppSelector(state=> state.GroupSlice)
    const { user } = useAppSelector(state=> state.UserSlice)
    const [modal, setModal] = useState<boolean>(false); 
    return (
        <>
            <aside className={['w-full flex xl:flex-col bg-[#2c2c2c] overflow-auto xl:max-h-[100vh] pt-10 xl:h-full shadow-lg xl:border-r-[12px] xl:border-r-[#818181]', closedmenu ? '' : 'xl:min-w-[300px] xl:w-[300px] 2xl:min-w-[250px] 2xl:w-[250px]'].join(' ')}>
                <Link to={(!group?.open || user.role === 'ADMIN') ? '/' : null} {...(group?.open && { onClick: ()=> void setModal(true) })}  className='mx-auto flex justify-center'><img className={['self-center mb-10', closedmenu ? 'w-20' : 'w-44 max-2xl:w-36'].join(' ')} src={Logo} alt="logo" /></Link>
                <div className="hidden xl:flex flex-col justify-between xl:h-full">
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

export default Sidebar555;