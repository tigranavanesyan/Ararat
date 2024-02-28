import { FC } from 'react'
import { ITopMenu } from '../../../models/ITopMenu';
import { Link } from 'react-router-dom';

interface MenuItemProps {
    item: ITopMenu,
    className?: string,
    onClick?: () => void,
}

const MenuItem: FC<MenuItemProps> = ({item, className, onClick}) => {
    return (
        <>
            {item.path
            ?
            <Link to={item.path} className={['bg-gradient-top-menu-item text-[#353535] flex items-center justify-center text-xl py-5 px-8 rounded-full font-bold whitespace-pre-wrap text-center', className].join(' ')}>
                {item.name}
            </Link>
            :
            <div onClick={onClick} className={['bg-gradient-top-menu-item text-[#353535] flex items-center justify-center text-xl py-5 px-8 rounded-full font-bold whitespace-pre-wrap text-center', className].join(' ')}>
                {item.name}
            </div>
            }
        </>
    )
}

export default MenuItem;