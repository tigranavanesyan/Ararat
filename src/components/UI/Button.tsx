import { FC, PropsWithChildren } from 'react'

interface ButtonProps {
    className?: string;
    onClick?: () => void;
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({children, className, onClick, ...props}) => {
    return (
        <button onClick={onClick} className={['flex items-center justify-center w-full px-6 py-3 text-sm tracking-wide text-white hover:text-apricot capitalize transition-colors duration-300 transform bg-gray-800 rounded-md focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50', className].join(' ')} {...props}>{children}</button>
    )
}

export default Button;