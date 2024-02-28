import { FC } from 'react'
import { useAppSelector } from '../../hooks/redux';
import { Link } from 'react-router-dom';
import { FiLogOut } from '@react-icons/all-files/fi/FiLogOut' 
import { useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/reducers/UserSlice';

interface UserInfoProps {
    closedmenu?: boolean; 
}

const UserInfo: FC<UserInfoProps> = ({closedmenu}) => {
    const {user} = useAppSelector(state => state.UserSlice);
    const dispatch = useAppDispatch();

    const logOutHandler = async () => {
        await dispatch(logout());
    }

    return (
        <div className="flex items-center border-t-2 border-t-gray-500">
            <Link  to='/profile' className='flex items-center mb-5 pl-3  pt-5'>
                <div className="mr-4 w-8 h-8 max-2xl:w-8 max-2xl:h-8"><img src={user.avatar} className='w-[inherit] h-[inherit]' alt="avatar"/></div>
                {!closedmenu &&
                    <p className='text-white text-lg max-2xl:text-base font-medium'>{user.name + ' ' + user.sname}</p>
                }
            </Link>
            <button onClick={()=> void logOutHandler()} title='Выйти' className='ml-2 text-white text-xl'><FiLogOut /></button>
        </div>
    )
}

export default UserInfo;