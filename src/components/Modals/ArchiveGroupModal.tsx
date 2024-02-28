import { FC, useState } from 'react'
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { ServerError } from '../../models/response/ServerError';
import AuthErrorModal from './AuthError';
import DialogService from '../../services/DialogService';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useAppDispatch } from '../../hooks/redux';
import { deleteChat, editChat } from '../../store/reducers/MessengerSlice';

interface ArchiveGroupModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
    _id: string,
    archive: boolean;
}

const ArchiveGroupModal: FC<ArchiveGroupModalProps> = ({ modal, setModal, _id, archive }) => {
    const dispatch = useAppDispatch();
    const [modalError, setModalError] = useState<string>('');
    const [eModal, setEModal] = useState<boolean>(false);

    const Submit = async () => {
        if(_id) {
            const response = await dispatch(editChat({dialog_id: _id, archive: archive}));
            const res = response.payload as ServerError;
            if(res?.error) {
                setEModal(true);
                setModalError(res.error)
            } else {
                setModal(false);
            }
        }
    }

    return (
        <>
            <Modal active={modal} setActive={setModal} className='items-center'>
                <h1 className='text-2xl mb-5 font-semibold tracking-wider text-gray-800 capitalize '>{archive ? 'Archive' : 'Unarchive'} group</h1>
                <p className='mb-5 text-center'>Are you sure you want to {archive ? 'archive': 'unarchive'} this group ?</p>
                <div className="flex items-center">
                    <Button className='mr-5' onClick={()=> void Submit()}>Yes</Button>
                    <Button onClick={()=>setModal(false)}>No</Button>
                </div>
            </Modal>
            <AuthErrorModal modal={eModal} setModal={setEModal} error={modalError}/>
        </>
    )
}

export default ArchiveGroupModal;