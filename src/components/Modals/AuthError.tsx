import { FC } from 'react'
import Modal from '../UI/Modal';
import { BiErrorCircle } from "@react-icons/all-files/bi/BiErrorCircle";

interface AuthErrorModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
    error: string
}

const AuthErrorModal: FC<AuthErrorModalProps> = ({ modal, setModal, error }) => {
    return (
        <Modal active={modal} setActive={setModal} className='items-center'>
            <BiErrorCircle className='text-red-500 text-8xl mb-3'/>
            <h2 className='text-4xl dark:text-white font-medium mb-3'>Error!</h2>
            <p className='text-lg dark:text-[#c7c7c7] text-center'>{error}</p>
        </Modal>
    )
}

export default AuthErrorModal;