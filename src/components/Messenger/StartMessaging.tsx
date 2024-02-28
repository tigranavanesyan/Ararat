import { FC } from 'react'
import { IoChatbubblesOutline } from '@react-icons/all-files/io5/IoChatbubblesOutline'

const StartMessaging: FC = () => {
    return (
        <div className='hidden xl:flex flex-col items-center justify-center w-full text-gray-800'>
            <div className="text-9xl mb-5"><IoChatbubblesOutline/></div>
            <p className='text-xl font-medium'>Select chat to start messaging</p>
        </div>
    )
}

export default StartMessaging;