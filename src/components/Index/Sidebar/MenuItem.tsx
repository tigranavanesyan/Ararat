import { FC, PropsWithChildren } from 'react'
import { Link } from 'react-router-dom';
import { useLocation  } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux';

interface MenuItemProps {
    to: string,
    ico: string;
    closedmenu?: boolean;
    title?: string;
    setModal: (bool: boolean) => void;
    active: boolean;
}

const MenuItem: FC<PropsWithChildren<MenuItemProps>> = ({to, children, ico, closedmenu, title, setModal}) => {
    const { group } = useAppSelector(state=> state.GroupSlice);
    const { user } = useAppSelector(state=> state.UserSlice);
    const location = useLocation();
    

    return (
        <li translate="no" title={title} className={['border-b-white notranslate border-b-2', location.pathname === to ? 'relative before:bg-apricot before:absolute before:w-[5px] before:h-full before:block before:top-0 before:-left-5': null].join(' ')}><Link  to={(!group?.open || user.role === 'ADMIN') ? to : null} {...(group?.open && { onClick: ()=> void setModal(true) })} className={['text-white hover:text-apricot transition-all text-lg max-2xl:text-base font-medium flex items-center', location.pathname === to ? '!text-apricot' : null].join(' ')}><div className={["p-2 max-2xl:p-1", closedmenu ? '' : 'mr-2 border-r-white border-r-2'].join(' ')}><img className='w-10 max-2xl:w-8' src={ico}/></div> {!closedmenu && children}</Link></li>
    )
}

export default MenuItem;