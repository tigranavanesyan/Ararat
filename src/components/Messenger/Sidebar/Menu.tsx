import { FC } from 'react';
import MenuItem from './MenuItem';
import { BsChatText } from '@react-icons/all-files/bs/BsChatText';
import { BsTelephone } from '@react-icons/all-files/bs/BsTelephone'
import { BsGear } from '@react-icons/all-files/bs/BsGear'
import { useAppSelector } from '../../../hooks/redux';
import { Link } from 'react-router-dom';

const Menu: FC = () => {

    const { user } = useAppSelector(state=> state.UserSlice);

    return (
        <nav className='flex flex-col h-full items-center'>
            <ul className='hidden border-b border-b-gray-600 pb-8 xl:flex flex-col items-center'>
                <MenuItem activeOption='/messenger/chat' to='/messenger'><BsChatText/></MenuItem>
                {/* <MenuItem className='mb-0' to='/messenger/1'><BsTelephone/></MenuItem> */}
            </ul>
            <ul className='hidden pt-8 xl:flex flex-col flex-grow items-center'>
                {/* <MenuItem to='/messenger/2'><BsGear/></MenuItem> */}
            </ul>
            <Link to='/profile' className="w-9 h-9 rounded-full">
                <img src={user.avatar} className='w-[inherit] h-[inherit]' alt="avatar" />
            </Link>
        </nav>
    )
}

export default Menu;