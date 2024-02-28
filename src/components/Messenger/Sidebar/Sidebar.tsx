import { FC } from 'react';
import Logo from '../../../assets/logo_sm_white.png';
import Logo2 from '../../../assets/logo2.png';
import { Link } from 'react-router-dom';
import Menu from './Menu';

const Sidebar: FC = () => {
    
    return (
        <aside className='w-full justify-between xl:gap-0 items-center  xl:w-20 bg-gray-900 py-7 px-2 flex xl:flex-col'>
            <Link to='/'><img className='hidden xl:block xl:w-14 xl:mb-8' src={Logo} alt="logo"/></Link>
            <Link to='/'><img className='h-20 xl:hidden' src={Logo2} alt="logo"/></Link>
            <Menu/>
        </aside>
    )
}

export default Sidebar;