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
import debounce from "lodash.debounce";
import GroupService from '../../services/GroupService';
import { IGroup } from '../../models/response/IGroup';

interface MoveUserToGroupModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
    email: string,
    _id: string,
}

type Form = {
    group_id: string,
};

const MoveUserToGroupModal: FC<MoveUserToGroupModalProps> = ({ modal, setModal, email, _id }) => {
    const [modalError, setModalError] = useState<string>('');
    const [eModal, setEModal] = useState<boolean>(false);
    const { register, handleSubmit, setValue, formState: {errors} } = useForm<Form>();
    const {userid} = useParams();
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [dropdown, setDropDown] = useState<boolean>(false);

    const onSubmit: SubmitHandler<Form> = async (data, e) => {
        e?.preventDefault();
        if(userid) {
            await DialogService.addUserToChat(email, data.group_id).then(()=> setModal(false)).catch((e: AxiosError)=> {
                const event = e.response?.data as ServerError;
                setModalError(event.error)
                setEModal(true);
            });
            await DialogService.removeUserFromChat(_id, userid).then(()=> setModal(false)).catch((e: AxiosError)=> {
                const event = e.response?.data as ServerError;
                setModalError(event.error)
                setEModal(true);
            });
        }
        setValue('group_id', '');
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
                <h1 className='text-2xl font-semibold tracking-wider text-gray-800 capitalize '>Move user to another group</h1>
                <p className='text-center pt-5'>Enter the id or name of the group you want to move the user {email} to</p>
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

export default MoveUserToGroupModal;