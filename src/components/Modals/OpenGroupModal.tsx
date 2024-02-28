import { FC, useState } from 'react'
import Modal from '../UI/Modal';
import Input from '../UI/Main/Input';
import MainButton from '../UI/MainButton';
import { useForm, SubmitHandler } from "react-hook-form";
import { ServerError } from '../../models/response/ServerError';
import AuthErrorModal from './AuthError';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useAppDispatch } from '../../hooks/redux';
import { addUserToGroup } from '../../store/reducers/GroupSlice';
import debounce from "lodash.debounce";
import PermissionsService from '../../services/PermissionsService';
import { User } from '../../models/User';

interface OpenGroupModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
}

type Form = {
    email: string,
};

const OpenGroupModal: FC<OpenGroupModalProps> = ({ modal, setModal }) => {
    const dispatch = useAppDispatch();
    const [modalError, setModalError] = useState<string>('');
    const [eModal, setEModal] = useState<boolean>(false);
    const { register, handleSubmit, setValue, formState: {errors} } = useForm<Form>();
    const {groupId} = useParams();
    const [users, setUsers] = useState<User[]>([]);
    const [dropdown, setDropDown] = useState<boolean>(false);

    const onSubmit: SubmitHandler<Form> = async (data, e) => {
        e?.preventDefault();
        if(groupId) {
            await dispatch(addUserToGroup({email: data.email, group_id: groupId})).then((res)=> 
            {
                setModal(false)
                const error = res.payload as ServerError;
                if(error.error) {
                    setEModal(true);
                    setModalError(error.error);
                    setModal(false);
                }
            });
        }
    }

    const testdebounce = debounce(async (e: string)=>{
        if(e.length > 0) {
            await PermissionsService.getUsers(undefined, e).then(res=> {setUsers(res.data.users); setDropDown(true)});
        } else {
            setDropDown(false)
        }
    }, 1000)

    return (
        <>
            <Modal active={modal} setActive={setModal} className='items-center border-2 border-[#8A6E3E] !rounded-3xl'>
                <h1 className='text-2xl font-semibold tracking-wider text-gray-800 capitalize '>Add user to group</h1>
                <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className='bg-white container mx-auto flex flex-col py-5 max-w-2xl'>
                    <Input wrapperClass='mb-4' type="text" placeholder='Email' error={errors.email?.message} register={register('email', { required: "The field must be filled" })} onInput={e=> void testdebounce(e.target.value)}/>
                    {(users.length > 0 && dropdown) &&
                        <ul className="flex flex-col shadow-lg bg-gray-100 border border-[#8A6E3E] pt-5 -mt-10 rounded-b-lg mb-5 max-h-[200px] overflow-auto">
                            {users.map(user=>
                                <li className='hover:bg-apricot cursor-pointer py-2 px-4 border-b' onClick={()=> {setValue('email', user.email); setDropDown(false)}}>{user.email} ({user.name} {user.sname})</li>    
                            )}
                        </ul>
                    }
                    <MainButton>Add user</MainButton>
                </form>
            </Modal>
            <AuthErrorModal modal={eModal} setModal={setEModal} error={modalError}/>
        </>
    )
}

export default OpenGroupModal;