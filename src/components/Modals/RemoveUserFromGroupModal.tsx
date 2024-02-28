import { FC, useState } from 'react'
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { ServerError } from '../../models/response/ServerError';
import AuthErrorModal from './AuthError';
import DialogService from '../../services/DialogService';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';

interface RemoveUserFromGroupModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
    email: string,
    _id: string,
}

const RemoveUserFromGroupModal: FC<RemoveUserFromGroupModalProps> = ({ modal, setModal, email, _id }) => {
    const [modalError, setModalError] = useState<string>('');
    const [eModal, setEModal] = useState<boolean>(false);
    const {userid} = useParams();

    const Submit = async () => {
        if(userid) {
            await DialogService.removeUserFromChat(_id, userid).then(()=> setModal(false)).catch((e: AxiosError)=> {
                const event = e.response?.data as ServerError;
                setModalError(event.error)
                setEModal(true);
            });
        }
    }

    return (
        <>
            <Modal active={modal} setActive={setModal} className='items-center'>
                <h1 className='text-2xl mb-5 font-semibold tracking-wider text-gray-800 capitalize '>Remove user from group</h1>
                <p className='mb-5 text-center'>Are you sure you want to delete the user {email} from this group ?</p>
                <div className="flex items-center">
                    <Button className='mr-5' onClick={()=> void Submit()}>Yes</Button>
                    <Button onClick={()=>setModal(false)}>No</Button>
                </div>
            </Modal>
            <AuthErrorModal modal={eModal} setModal={setEModal} error={modalError}/>
        </>
    )
}

export default RemoveUserFromGroupModal;