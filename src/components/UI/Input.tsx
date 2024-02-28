import { FC } from 'react'
import uniqid from 'uniqid';
import { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps {
    className?: string,
    wrapperClasses?: string
    labelClasses?: string,
    label?: string,
    name?: string,
    error?: string,
    placeholder?: string,
    type: string,
    value?: string,
    register?: UseFormRegisterReturn,
    icon?: React.JSX.Element,
    onChange?: () => void;
    onInput?: React.ChangeEventHandler<HTMLInputElement>
}

const Input: FC<InputProps> = ({className, wrapperClasses, labelClasses, label, name, error, register, type, value, icon, onChange, onInput, ...props}) => {
    const uid: string = uniqid();
    return (
        <div className={['flex flex-col relative', wrapperClasses].join(' ')}>
            {label &&
                <label className={['block text-sm text-gray-600 mb-2', labelClasses].join(' ')} htmlFor={uid}>{label}</label>
            }
            {icon &&
                <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-900">{icon}</div>
            }
            <input type={type} value={value} id={uid} name={name} onChange={onChange} onInput={onInput} {...register} className={['block w-full px-5 py-3 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-apricot focus:ring-apricot focus:outline-none focus:ring focus:ring-opacity-40', icon ? 'pl-9' : null, className].join(' ')} {...props} />
            {error &&
                <p className="text-red-600 text-sm absolute -bottom-0.5 translate-y-full">{error}</p>
            }
        </div>
    )
}

export default Input;