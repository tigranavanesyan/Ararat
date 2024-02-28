import { FC } from 'react'
import { Listbox } from '@headlessui/react'
import { ISelect } from '../../../models/ISelect';

interface SelectProps {
    options: ISelect[];
    value: ISelect;
    onChange (value: never | ISelect[]): void;
    multiple?: boolean;
    name?: string;
    className?: string;
    wrapperClass?: string;
    error?: string;
    showMultipleValues?: boolean;
    placeholder?: string;
}

const Select: FC<SelectProps> = ({options, value, onChange, multiple, name, showMultipleValues, error, className, wrapperClass, placeholder}) => {

    console.log(error);

    const selectHandler = (e: never) => {
        if(multiple) {
            const val = e as ISelect[];
            if(isSelected(val[val.length-1])) {
                const tmp = value.filter(item=> item.id !== val[val.length-1].id);
                onChange(tmp);
            } else { 
                onChange(e);
            }
            
        } else {
            onChange(e);
        } 
    }

    const isSelected = (val: ISelect) => {
        if(multiple) {
            return value.find(item=> item.id === val.id) ? true : false;
        }
    }

    return (
        <div className={['relative w-full', wrapperClass].join(' ')}>
            <Listbox multiple={multiple} id='selectFilter' className={['mb-5 text-gray-700 placeholder-gray-400  rounded-md focus:border-apricot focus:ring-apricot focus:outline-none focus:ring focus:ring-opacity-40', className].join(' ')} as="div" value={value} 
                onChange={(e: never) => {
                    selectHandler(e);
                }}
            >
                <Listbox.Button className='border border-[#B7975A] bg-white rounded-full py-2 px-5 w-full'><p className='border rounded-full py-1 font-semibold'>{name} {multiple ? (showMultipleValues ? value.length > 0 ? value.map(v=> v.slug) + ' ' : placeholder : value.length) : value.name }</p></Listbox.Button>
                <Listbox.Options className='z-10 bg-white w-full border border-t-0 pt-7 -mt-6 overflow-hidden border-[#B7975A] rounded-b-3xl'>
                    <div className="max-h-[200px] overflow-auto">
                        {options.map((option) => {
                            const selected = isSelected(option);
                            return (
                                <Listbox.Option
                                    className={[selected && 'bg-gradient-select', 'text-center cursor-pointer px-3 py-2 hover:bg-gradient-select border-b last:border-b-0 font-semibold'].join(' ')}
                                    key={option.id}
                                    value={option}
                                >
                                    {option.name}
                                </Listbox.Option>
                            )
                        })}
                    </div>
                </Listbox.Options>
            </Listbox>
            {error &&
                <p className="text-red-600 text-sm absolute bottom-4 translate-y-full">{error}</p>
            }
        </div>
        
        
    )
}

export default Select;