import { FC, PropsWithChildren } from 'react'
import { Link } from 'react-router-dom';
import { useBasePath } from '../../../hooks/useBasePath';

interface MenuItemProps {
    to: string,
    className?: string
    activeOption?: string
}

const MenuItem: FC<PropsWithChildren<MenuItemProps>> = ({to, className, activeOption, children}) => {

    const path = useBasePath();
    console.log("the link of to -------> ", to)

    return (
        <li className={['mb-6', className].join(' ')}><Link to={to} className={['text-white hover:text-apricot transition-all text-xl font-medium', (path === to || path === activeOption) ? '!text-gray-800 block bg-apricot p-4 rounded-sm' : null].join(' ')}>{children}</Link></li>
    )
}

export default MenuItem;