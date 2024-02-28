import { FC, useState } from 'react'
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { useForm, SubmitHandler } from "react-hook-form";
import { ServerError } from '../../models/response/ServerError';
import AuthErrorModal from './AuthError';
import DialogService from '../../services/DialogService';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { addUserToChat } from '../../store/reducers/MessengerSlice';
import { useAppDispatch } from '../../hooks/redux';
import debounce from "lodash.debounce";
import GroupService from '../../services/GroupService';
import { IGroup } from '../../models/response/IGroup';

interface AddUserToAddGroupModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
    email: string,
}

type Form = {
    group_id: string,
};

const AddUserToAddGroupModal: FC<AddUserToAddGroupModalProps> = ({ modal, setModal, email }) => {
    const dispatch = useAppDispatch();
    const [modalError, setModalError] = useState<string>('');
    const [eModal, setEModal] = useState<boolean>(false);
    const { register, handleSubmit, setValue, formState: {errors} } = useForm<Form>();
    const {userid} = useParams();
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [dropdown, setDropDown] = useState<boolean>(false);

    const onSubmit: SubmitHandler<Form> = async (data, e) => {
        e?.preventDefault();
        if(userid) {
            await dispatch(addUserToChat({email: email, dialog_id: data.group_id}))
            .then((res)=> {setModal(false); setValue('group_id', '');
            }).catch((e: AxiosError)=> {
                const event = e.response?.data as ServerError;
                setModalError(event.error)
                setEModal(true);
            });
        }
    }

    const testdebounce = debounce(async (e: string)=>{
        if(e.length > 0) {
            await GroupService.getGroups(undefined, e).then(res=> {setGroups(res.data.groups); setDropDown(true)});
        } else {
            setDropDown(false)
        }
    }, 1000)

    return (
        <>
            <Modal active={modal} setActive={setModal} className='items-center'>
                <h1 className='text-2xl font-semibold tracking-wider text-gray-800 capitalize '>Add user to group</h1>
                <p className='text-center pt-5'>Enter the id or name of the group you want to add the user {email} to</p>
                <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className='bg-white container mx-auto flex flex-col px-10 py-5 max-w-2xl'>
                    <Input wrapperClasses='mb-5' type="text" label='Group id:' placeholder='Group id' error={errors.group_id?.message} register={register('group_id', { required: "The field must be filled" })} onInput={e=> void testdebounce(e.target.value)}/>
                    {(groups.length > 0 && dropdown) &&
                        <ul className="flex flex-col shadow-lg bg-gray-100 border -mt-5 rounded-b-lg mb-5 max-h-[200px] overflow-auto">
                            {groups.map(group=>
                                <li className='hover:bg-apricot cursor-pointer py-2 px-4 border-b' onClick={()=> {setValue('group_id', group.name); setDropDown(false)}}>{group.name}</li>    
                            )}
                        </ul>
                    }
                    <Button>Move user</Button>
                </form>
            </Modal>
            <AuthErrorModal modal={eModal} setModal={setEModal} error={modalError}/>
        </>
    )
}

export default AddUserToAddGroupModal;