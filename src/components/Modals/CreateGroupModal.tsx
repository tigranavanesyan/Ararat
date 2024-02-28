import { FC, useState } from 'react'
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Textarea from '../UI/Textarea';
import Button from '../UI/Button';
import { useForm, SubmitHandler } from "react-hook-form";
import { createChat } from '../../store/reducers/MessengerSlice';
import { useAppDispatch } from '../../hooks/redux';
import { ServerError } from '../../models/response/ServerError';
import AuthErrorModal from './AuthError';
import parse from 'date-fns/parse';
import formatISO from 'date-fns/formatISO';
import InputMask from 'react-input-mask';

interface CreateGroupModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
}

type Form = {
    name: string,
    description: string,
};

const CreateGroupModal: FC<CreateGroupModalProps> = ({ modal, setModal }) => {
    const [modalError, setModalError] = useState<string>('');
    const [eModal, setEModal] = useState<boolean>(false);
    const { register, handleSubmit, formState: {errors} } = useForm<Form>();
    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<Form> = async (data, e) => {
        e?.preventDefault();
        const response = await dispatch(createChat({name: data.name, description: data.description, anonim: true}));
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
            <Modal active={modal} setActive={setModal} className='items-center'>
                <h1 className='text-2xl font-semibold tracking-wider text-gray-800 capitalize '>Create anonim group</h1>
                <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className='bg-white container mx-auto flex flex-col px-10 py-5 max-w-2xl'>
                    <Input wrapperClasses='mb-5' type="text" label='Name:' placeholder='Name' error={errors.name?.message} register={register('name', { required: "The field must be filled" })}/>
                    <Textarea wrapperClasses='mb-5' label='Description:' placeholder='Description' error={errors.description?.message} register={register('description', { required: "The field must be filled" })}/>
                    <Button>Create group</Button>
                </form>
            </Modal>
            <AuthErrorModal modal={eModal} setModal={setEModal} error={modalError}/>
        </>
    )
}

export default CreateGroupModal;