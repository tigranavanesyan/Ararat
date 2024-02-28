import { FC } from 'react'
import uniqid from 'uniqid';
import { UseFormRegisterReturn } from 'react-hook-form';

interface TextareaProps {
    className?: string,
    wrapperClasses?: string
    name?: string,
    error?: string,
    placeholder?: string,
    value?: string,
    register?: UseFormRegisterReturn,
    onChange?: () => void;
}

const Textarea: FC<TextareaProps> = ({className, wrapperClasses, name, error, register, value, onChange, ...props}) => {
    const uid: string = uniqid();
    return (
        <div className={['flex flex-col relative', wrapperClasses].join(' ')}>
            <textarea value={value} id={uid} name={name} onChange={onChange} {...register} className={['block resize-none w-full border border-[#B7975A] rounded-3xl py-3 px-5', className].join(' ')} {...props} />
            {error &&
                <p className="text-red-600 text-sm absolute -bottom-0.5 translate-y-full">{error}</p>
            }
        </div>
    )
}

export default Textarea;