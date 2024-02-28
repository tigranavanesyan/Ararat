import {FC} from 'react'
import { IoChatbubblesOutline } from '@react-icons/all-files/io5/IoChatbubblesOutline'

const EmptyChat: FC = () => {
    return (
        <div className='flex flex-col items-center justify-center w-full text-gray-800'>
            <div className="text-9xl mb-5"><IoChatbubblesOutline/></div>
            <p className='text-xl font-medium'>Dialog is Empty</p>
        </div>
    )
}

export default EmptyChat;