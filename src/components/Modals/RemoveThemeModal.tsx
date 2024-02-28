import { FC, useState } from 'react'
import Modal from '../UI/Modal';
import MainButton from '../UI/MainButton';
import { ServerError } from '../../models/response/ServerError';
import AuthErrorModal from './AuthError';
import DialogService from '../../services/DialogService';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { ITheme } from '../../models/Program/ITheme';
import { deleteTheme } from '../../store/reducers/ProgramSlice';
import { useAppDispatch } from '../../hooks/redux';

interface RemoveThemeModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
    theme: ITheme,
}

const RemoveThemeModal: FC<RemoveThemeModalProps> = ({ modal, setModal, theme}) => {
    const dispatch = useAppDispatch();
    const [modalError, setModalError] = useState<string>('');
    const [eModal, setEModal] = useState<boolean>(false);
    const {userid} = useParams();

    const Submit = async () => {
        const response = await dispatch(deleteTheme({themeId: theme._id}));
        const res = response.payload as ServerError;
        if(res?.error) {
            setEModal(true);
            setModalError(res.error)
        } else {
            setModal(false);
        }
    }

    return (
        <>
            <Modal active={modal} setActive={setModal} className='items-center !rounded-3xl border-2 border-[#8A6E3E]'>
                <h1 className='text-2xl mb-5 font-semibold tracking-wider text-gray-800 capitalize '>Remove theme</h1>
                <p className='mb-5 text-center'>Are you sure you want to delete theme: {theme.name}?</p>
                <div className="flex items-center">
                    <MainButton className='mr-5 !px-10' onClick={()=> void Submit()}>Yes</MainButton>
                    <MainButton className='!px-10' onClick={()=>setModal(false)}>No</MainButton>
                </div>
            </Modal>
            <AuthErrorModal modal={eModal} setModal={setEModal} error={modalError}/>
        </>
    )
}

export default RemoveThemeModal;