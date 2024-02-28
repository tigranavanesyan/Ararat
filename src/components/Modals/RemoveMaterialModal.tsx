import { FC, useState } from 'react'
import Modal from '../UI/Modal';
import MainButton from '../UI/MainButton';
import { ServerError } from '../../models/response/ServerError';
import AuthErrorModal from './AuthError';
import DialogService from '../../services/DialogService';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import ProgramService from '../../services/ProgramService';
import SuccessModal from './SuccessModal';
import { useAppDispatch } from '../../hooks/redux';
import { deleteMaterial } from '../../store/reducers/ProgramSlice';

interface RemoveMaterialModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
    material_id: string,
}

const RemoveMaterialModal: FC<RemoveMaterialModalProps> = ({ modal, setModal, material_id }) => {
    const [modalError, setModalError] = useState<string>('');
    const [eModal, setEModal] = useState<boolean>(false);
    const [sModal, setSModal] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const Submit = async () => {
        await dispatch(deleteMaterial({materialId: material_id})).then(()=> setModal(false)).catch((e: AxiosError)=> {
            const event = e.response?.data as ServerError;
            setModalError(event.error)
            setEModal(true);
        });
    }

    return (
        <>
            <Modal active={modal} setActive={setModal} className='items-center !rounded-3xl border-2 border-[#8A6E3E]'>
                <h1 className='text-2xl mb-5 font-semibold tracking-wider text-gray-800 capitalize '>Remove Material</h1>
                <p className='mb-5 text-center'>Are you sure you want to remove Material ?</p>
                <div className="flex items-center">
                    <MainButton className='mr-5 !px-10' onClick={()=> void Submit()}>Yes</MainButton>
                    <MainButton className='!px-10' onClick={()=>setModal(false)}>No</MainButton>
                </div>
            </Modal>
            <AuthErrorModal modal={eModal} setModal={setEModal} error={modalError}/>
            <SuccessModal modal={sModal} setModal={setSModal} message='Material removed successfully!'/>
        </>
    )
}

export default RemoveMaterialModal;