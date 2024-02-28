import { FC, useState } from 'react'
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { ServerError } from '../../models/response/ServerError';
import AuthErrorModal from './AuthError';
import DialogService from '../../services/DialogService';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import PermissionsService from '../../services/PermissionsService';
import SuccessModal from './SuccessModal';

interface RemoveUserModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
    email: string,
    _id: string,
    archive: boolean
}

const RemoveUserModal: FC<RemoveUserModalProps> = ({ modal, setModal, email, _id, archive }) => {
    const [modalError, setModalError] = useState<string>('');
    const [eModal, setEModal] = useState<boolean>(false);
    const [sModal, setSModal] = useState<boolean>(false);

    const Submit = async () => {
        await PermissionsService.setRole(_id, undefined, undefined, undefined, undefined, archive ? false : true).then(()=> {setSModal(true); setModal(false);});
    }

    return (
        <>
            <Modal active={modal} setActive={setModal} className='items-center'>
                <h1 className='text-2xl mb-5 font-semibold tracking-wider text-gray-800 capitalize '>{archive? 'Unarchive user' : 'Archive user'}</h1>
                <p className='mb-5 text-center'>Are you sure you want to {archive ? 'unarchive' : 'archive'} the user {email} ?</p>
                <div className="flex items-center">
                    <Button className='mr-5' onClick={()=> void Submit()}>Yes</Button>
                    <Button onClick={()=>setModal(false)}>No</Button>
                </div>
            </Modal>
            <AuthErrorModal modal={eModal} setModal={setEModal} error={modalError}/>
            <SuccessModal modal={sModal} setModal={setSModal} message='User archiver successfully!'/>
        </>
    )
}

export default RemoveUserModal;