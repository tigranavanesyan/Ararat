import { forwardRef, useId } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps {
    className?: string,
    wrapperClass?: string,
    checked?: boolean,
    label?: string,
    register?: UseFormRegisterReturn,
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    error?: string,
    children?: React.ReactNode
    onClick?: React.MouseEventHandler<HTMLInputElement>
}

const CheckBox = forwardRef<HTMLInputElement, InputProps>(({ className, wrapperClass, checked, register, onChange, onClick, error, label, ...props}, ref) => {
    const id = useId();
    return (
        <div className={['relative', wrapperClass].join(' ')}>
            <div className="flex">
                <input ref={ref} type="checkbox" id={id} className={['peer hidden', className].join(' ')} checked={checked} {...props} onClick={onClick} onChange={onChange} {...register}/>
                <label className='cursor-pointer text-[#353535] font-semibold peer-checked:after:content-["✓"] after:absolute after:left-[5px] after:text-white  peer-checked:before:bg-[#B7975A] relative before:absolute before:left-0 pl-8 before:border-2 before:border-[#353535] before:w-6 before:h-6' htmlFor={id}>{label}</label>
            </div>
            
            
            {error &&
                <p className="text-red-600 text-sm absolute -bottom-0.5 translate-y-full">{error}</p>
            }
        </div>
    )
})

export default CheckBox;