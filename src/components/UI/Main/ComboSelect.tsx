import { FC, useState } from 'react'
import { Listbox } from '@headlessui/react'
import { ISelect } from '../../../models/ISelect';
import { Combobox } from '@headlessui/react'
import { HiChevronUpDown } from '@react-icons/all-files/hi2/HiChevronUpDown'

interface ComboSelectProps {
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

const ComboSelect: FC<ComboSelectProps> = ({options, value, onChange, multiple, name, showMultipleValues, error, className, wrapperClass, placeholder}) => {
    const [query, setQuery] = useState('')
    const filteredPeople =
    query === ''
        ? options
        : options.filter((option) =>
        option.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )


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
            <Combobox multiple={multiple} id='selectFilter' className={['mb-5 text-gray-700 placeholder-gray-400  rounded-md focus:border-apricot focus:ring-apricot focus:outline-none focus:ring focus:ring-opacity-40', className].join(' ')} as="div" value={value} 
                onChange={(e: never) => {
                    selectHandler(e);
                }}
            >
                <Combobox.Input onInput={(event) => setQuery(event.target.value)} className='border border-[#B7975A] bg-white rounded-full py-2 px-5 w-full'/>
                <Combobox.Button className="absolute top-2 right-2 flex items-center pr-2 text-2xl">
                    <HiChevronUpDown/>
                </Combobox.Button>
                <Combobox.Options className='z-10 bg-white w-full border border-t-0 pt-7 -mt-6 overflow-hidden border-[#B7975A] rounded-b-3xl'>
                    <div className="max-h-[200px] overflow-auto">
                        {filteredPeople.map((option) => {
                            const selected = isSelected(option);
                            return (
                                <Combobox.Option
                                    className={[selected && 'bg-gradient-select', 'text-center cursor-pointer px-3 py-2 hover:bg-gradient-select border-b last:border-b-0 font-semibold'].join(' ')}
                                    key={option.id}
                                    value={option}
                                >
                                    {option.name}
                                </Combobox.Option>
                            )
                        })}
                    </div>
                </Combobox.Options>
            </Combobox>
            {error &&
                <p className="text-red-600 text-sm absolute bottom-4 translate-y-full">{error}</p>
            }
        </div>
        
        
    )
}

export default ComboSelect;