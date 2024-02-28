import { FC, PropsWithChildren } from 'react'

interface MessageMenuItemProps {
    icon?: React.JSX.Element;
    className?: string;
    onClick?: () => React.MouseEventHandler<HTMLButtonElement> | void | boolean | Promise<void>;
}

const MessageMenuItem: FC<PropsWithChildren<MessageMenuItemProps>> = ({children, icon, className, onClick}) => {
    return (
        <button onClick={onClick} className={['hover:bg-gray-700 py-3 px-5 rounded-sm transition-all flex items-center text-white text-sm', className].join(' ')}><span className='text-xl mr-3'>{icon}</span>{children}</button>
    )
}

export default MessageMenuItem;