import { FC } from 'react'
import { ITopMenu } from '../../../models/ITopMenu';

interface MenuItemPermissionsProps {
    item: ITopMenu,
    className?: string,
    onClick?: () => void,
}

const MenuItemPermissions: FC<MenuItemPermissionsProps> = ({item, className, onClick}) => {
    return (
        <>
            <div onClick={onClick} className={['cursor-pointer bg-gradient-top-menu-item text-[#353535] flex items-center justify-center text-xl py-5 px-8 rounded-full font-bold whitespace-pre-wrap text-center', className].join(' ')}>
                {item.name} <span className='text-blue-600'>{item.counter}</span>
            </div>
        </>
    )
}

export default MenuItemPermissions;