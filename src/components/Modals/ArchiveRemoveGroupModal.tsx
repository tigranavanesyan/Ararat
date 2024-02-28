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
import { useAppDispatch } from '../../hooks/redux';
import { editGroup, deleteGroup } from '../../store/reducers/GroupSlice';
import MainButton from '../UI/MainButton';

interface ArchiveRemoveGroupModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
    action: string,
    groupInfo: {_id: string, name: string},
}

const ArchiveRemoveGroupModal: FC<ArchiveRemoveGroupModalProps> = ({ modal, setModal, action, groupInfo }) => {
    const [modalError, setModalError] = useState<string>('');
    const [eModal, setEModal] = useState<boolean>(false);
    const [sModal, setSModal] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const Submit = async () => {
        if(action === 'archive' || action === 'unarchive') {
            let tmp = false;
            if(action === 'archive') {
                tmp = true;
            }
            const response = await dispatch(editGroup({groupId: groupInfo._id, payload: {archive: tmp}}));
            const res = response.payload as ServerError;
            if(res?.error) {
                setEModal(true);
                setModalError(res.error)
            } else {
                setModal(false);
            }
        } else if(action === 'remove') {
            const response = await dispatch(deleteGroup({groupId: groupInfo._id}));
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
            <Modal active={modal} setActive={setModal} className='items-center !rounded-3xl border-2 border-[#8A6E3E]'>
                <h1 className='text-2xl mb-5 font-semibold tracking-wider text-gray-800 capitalize '>{action === 'archive' && 'Archive group'}{action === 'unarchive' && 'Unarchive group'}{action === 'remove' && 'Remove group'}</h1>
                <p className='mb-5 text-center'>Are you sure you want to {action === 'archive' && 'archive'}{action === 'unarchive' && 'unarchive'}{action === 'remove' && 'remove'} the group {groupInfo.name}?</p>
                <div className="flex items-center">
                    <MainButton className='mr-5' onClick={()=> void Submit()}>Yes</MainButton>
                    <MainButton onClick={()=>setModal(false)}>No</MainButton>
                </div>
            </Modal>
            <AuthErrorModal modal={eModal} setModal={setEModal} error={modalError}/>
            <SuccessModal modal={sModal} setModal={setSModal} message={'Group '+ (action==='archive' ? 'archived' : action === 'unarchive' ? 'unarchived' : 'removed') + ' successfully!'}/>
        </>
    )
}

export default ArchiveRemoveGroupModal;