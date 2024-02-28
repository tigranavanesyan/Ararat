import { FC, PropsWithChildren } from 'react'

interface OutlineButtonProps {
    className?: string;
    dark?: boolean;
    onClick?: () => void;
}

const OutlineButton: FC<PropsWithChildren<OutlineButtonProps>> = ({children, dark, className, onClick, ...props}) => {
    return (
        <button onClick={onClick} className={['flex items-center justify-center w-full px-6 py-3 text-xl tracking-wide hover:border-apricot hover:text-apricot capitalize transition-colors duration-300 transform border-2 rounded-2xl focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50', dark ? 'bg-gradient-top-menu !border-none text-white' : 'bg-white border-[#C4C4C4] text-[#353535]', className].join(' ')} {...props}>{children}</button>
    )
}

export default OutlineButton;