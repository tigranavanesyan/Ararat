import { FC, useState, useEffect } from 'react'
import Modal from '../UI/Modal';
import Input from '../UI/Main/Input';
import Select from '../UI/Main/Select';
import Textarea from '../UI/Main/Textarea';
import Button from '../UI/Button';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { createChat } from '../../store/reducers/MessengerSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { ServerError } from '../../models/response/ServerError';
import AuthErrorModal from './AuthError';
import parse from 'date-fns/parse';
import formatISO from 'date-fns/formatISO';
import InputMask from 'react-input-mask';
import { ISelect } from '../../models/ISelect';
import MainButton from '../UI/MainButton';
import GroupService from '../../services/GroupService';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { editGroup } from '../../store/reducers/GroupSlice';

interface EditGroupTitleModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
}

type Form = {
    name: string,
};

const EditGroupTitleModal: FC<EditGroupTitleModalProps> = ({ modal, setModal }) => {
    const [modalError, setModalError] = useState<string>('');
    const [eModal, setEModal] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { group } = useAppSelector(state => state.GroupSlice);
    const {groupId} = useParams();
    const graphicOptions = [
        {id: '1', name: 'Понедельник', slug: 'pn'},
        {id: '2', name: 'Вторник', slug: 'vt'},
        {id: '3', name: 'Среда', slug: 'sr'},
        {id: '4', name: 'Четверг', slug: 'ct'},
        {id: '5', name: 'Пятница', slug: 'pt'},
        {id: '6', name: 'Суббота', slug: 'sb'},
        {id: '7', name: 'Воскресение', slug: 'vs'},
    ] as ISelect[];
    const { control, register, setValue, handleSubmit, formState: {errors} } = useForm<Form>();
    useEffect(() => {
        if(group.description) {
            setValue('name', group.name);
        }
    }, [group])
    const onSubmit: SubmitHandler<Form> = async (data, e) => {
        e?.preventDefault();
        if(groupId) {
            const response = await dispatch(editGroup({groupId, payload: {name: data.name}}));
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
            <Modal active={modal} setActive={setModal} className='items-center max-w-[600px] !rounded-3xl border-2 border-[#8A6E3E]'>
                <h1 className='text-2xl font-bold tracking-wider text-gray-800 capitalize '>Edit Titlte</h1>
                <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className='bg-white container mx-auto flex flex-col px-5 py-5 max-w-2xl'>
                    <Input type='text' wrapperClass='mb-5' placeholder='Title' error={errors.name?.message} register={register('name', { required: "The field must be filled" })}/>
                    <div className="flex justify-end">
                        <MainButton type='button' onClick={()=>setModal(false)} className='mr-5 !px-10'>Close</MainButton>
                        <MainButton className='!px-10 bg-gradient-button-green'>Save</MainButton>
                    </div>
                </form>
            </Modal>
            <AuthErrorModal modal={eModal} setModal={setEModal} error={modalError}/>
        </>
    )
}

export default EditGroupTitleModal;