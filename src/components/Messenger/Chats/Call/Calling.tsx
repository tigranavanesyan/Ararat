import { FC } from 'react'
import { User } from '../../../../models/User';
import { BsTelephoneFill } from '@react-icons/all-files/bs/BsTelephoneFill'
import { ImPhoneHangUp } from '@react-icons/all-files/im/ImPhoneHangUp'
interface CallingProps {
    active: boolean;
    setActive: (bool: boolean) => void;
    setCallActive: (bool: boolean) => void;
    user: User;
}

const Calling: FC<CallingProps> = ({active, setActive, user, setCallActive}) => {
    const callHandler = () => {
        setActive(false);
        setCallActive(true);
    }
    return (
        <>
            {active &&
                <div className="w-full h-full fixed flex justify-center items-center bg-gray-800 bg-opacity-80">
                    <div className="max-w-[500px] bg-white py-10 px-20 flex flex-col items-center">
                        <div className="w-16 mb-5"><img className='w-full' src="/avatar.svg" alt="avatar" /></div>
                        <p className='text-lg mb-5'>{user.name} {user.sname}</p>
                        <div className="text-white flex">
                            <button onClick={callHandler} className='w-12 h-12 text-lg hover:bg-green-700 transition-all mr-5 rounded-full flex justify-center items-center bg-green-500'><BsTelephoneFill /></button>
                            <button onClick={()=> setActive(false)} className='w-12 h-12 text-lg hover:bg-red-700 transition-all rounded-full flex justify-center items-center bg-red-500'><ImPhoneHangUp /></button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Calling;