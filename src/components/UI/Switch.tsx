import { FC } from 'react'
import { Switch as HeadlessSwitch } from '@headlessui/react'

interface SwitchProps {
    label?: string,
    value: boolean,
    className?: string,
    onChange: (checked: boolean) => void;
}

const Switch: FC<SwitchProps> = ({label, className, value, onChange}) => {
    return (
        <div className={['flex items-center border-2 border-[#B7975A] rounded-full px-2', className].join(' ')}>
            <HeadlessSwitch checked={value} onChange={onChange} className='bg-[#353535] relative inline-flex h-6 w-11 items-center rounded-full'>
                <span className="sr-only">Автовыбор задач при выборе темы</span>
                <span className={`${value ? 'translate-x-6 bg-gradient-appricot' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}/>
            </HeadlessSwitch>
            {label &&
                <p className='text-base ml-3 max-2xl:text-sm'>{label}</p>
            }
        </div>
    )
}

export default Switch;