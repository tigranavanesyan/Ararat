import { FC } from 'react'
import { Disclosure } from '@headlessui/react'
import { IFAQ } from '../../models/IFAQ'
import { AiOutlinePlus } from '@react-icons/all-files/ai/AiOutlinePlus'
import { AiOutlineMinus } from '@react-icons/all-files/ai/AiOutlineMinus'

interface ItemProps {
    item: IFAQ;
}

const Item: FC<ItemProps> = ({item}) => {
    return (
        <Disclosure as='div' className='mb-2 w-full'>
            {({ open }) => (
                <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-300 px-4 py-3 text-left text-base font-medium text-gray-900 hover:bg-gray-400 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                    <span>{item.name}</span>
                    {open ? <AiOutlineMinus className='h-5 w-5 text-purple-500'/> : <AiOutlinePlus className='h-5 w-5 text-purple-500'/> }
                    
                    </Disclosure.Button>
                    <Disclosure.Panel className="border border-gray-300 px-4 pt-4 pb-2 text-base text-gray-900 whitespace-pre-wrap">
                        {item.description}
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}

export default Item;