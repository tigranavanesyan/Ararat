import { FC, PropsWithChildren } from 'react'

interface MainButtonProps {
    className?: string;
    onClick?: () => void;
    type?: string
}

const MainButton: FC<PropsWithChildren<MainButtonProps>> = ({ children, className, onClick, type }) => {
    return (
        <button type={type ? 'button' : 'submit'} onClick={onClick} className={['bg-gradient-menu text-white text-xl font-semibold py-3 px-4 rounded-full', className].join(' ')}>{children}</button>
    )
}

export default MainButton;