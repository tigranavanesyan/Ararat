import { FC, forwardRef, ForwardedRef } from 'react'

interface IcoButton {
    icon: React.JSX.Element;
    className?: string;
    onClick?: () => void;
    ref?: ForwardedRef<HTMLButtonElement>
}

const IcoButton: FC<IcoButton> = forwardRef(({icon, className, onClick}, ref) => {
    return (
        <button ref={ref} className={['hover:bg-gray-700 py-3 px-5 rounded-sm transition-all mr-2 text-white text-xl', className].join(' ')} onClick={onClick}>{icon}</button>
    )
})

export default IcoButton;