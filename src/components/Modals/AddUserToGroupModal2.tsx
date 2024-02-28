import { FC, useState, useEffect } from 'react'
import Modal from '../UI/Modal';
import Input from '../UI/Main/Input';
import MainButton from '../UI/MainButton';
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
import { IRec, IInd } from '../../models/response/IRec';
import CreateFullGroupModal from './CreateFullGroupModal';

interface AddUserToGroupModal2ModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
    email: string,
    user_id: string
}

type Form = {
    group_id: string,
};

const AddUserToGroupModal2: FC<AddUserToGroupModal2ModalProps> = ({ modal, setModal, email, user_id }) => {
    const dispatch = useAppDispatch();
    const [modalError, setModalError] = useState<string>('');
    const [eModal, setEModal] = useState<boolean>(false);
    const { register, handleSubmit, setValue, formState: {errors} } = useForm<Form>();
    const {userid} = useParams();
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [dropdown, setDropDown] = useState<boolean>(false);
    const [recs, setRecs] = useState<IRec[]>([]);
    const [inds, setInds] = useState<IInd[]>([]);
    const [modal2, setModal2] = useState<boolean>(false)

    useEffect(() => {
        if(user_id) {
            const fetchData = async() => {
                await GroupService.getRecs(user_id).then(
                    (res) => {
                        setRecs(res.data.recs);
                        setInds(res.data.inds);
                    }
                );
            }
            void fetchData();
        }
        
    }, [user_id])
    

    const onSubmit: SubmitHandler<Form> = async (data, e) => {
        e?.preventDefault();
        await dispatch(addUserToChat({email: email, dialog_id: data.group_id}))
        .then((res)=> {setModal(false); setValue('group_id', '');
        }).catch((e: AxiosError)=> {
            const event = e.response?.data as ServerError;
            setModalError(event.error)
            setEModal(true);
        });
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
            <Modal active={modal} setActive={setModal} className='items-center border-2 border-[#8A6E3E] !rounded-3xl !max-w-[800px] !w-full'>
                <h1 className='text-2xl font-semibold tracking-wider text-gray-800 capitalize '>Add user to group</h1>
                <p className='text-center pt-5'>Enter the name or id of the group you want to add the user {email} to</p>
                <div className="text-left">
                    <p className='mb-2 text-lg font-bold mt-5'>Предложенные:</p>
                    <div>
                        {recs.length > 0 &&
                            recs.map(item=>
                                <button onClick={()=> setValue('group_id', item.name)} className='bg-gradient-button rounded-lg p-1 px-3 mb-2 text-left font-semibold'>{item.name} Уровень: {item.level}, Учеников: {item.users.filter(user=> user.role === 'STUDENT').length}/6</button>
                            )
                        }
                        {inds &&
                            inds.length > 0 &&
                            inds.map(item=>
                                <button onClick={()=> setModal2(true)} className='bg-gradient-button rounded-lg p-1 px-3 mb-2 text-left font-semibold'>Индивидуально: {item.name} {item.sname} {item.tname}</button>
                            )
                        }
                    </div>
                </div>
                <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className='bg-white container mx-auto flex flex-col px-10 py-5 max-w-2xl'>
                    <Input wrapperClass='mb-5' type="text" label='Group name:' placeholder='Group name' error={errors.group_id?.message} register={register('group_id', { required: "The field must be filled" })} onInput={e=> void testdebounce(e.target.value)}/>
                    {(groups.length > 0 && dropdown) &&
                        <ul className="flex flex-col shadow-lg bg-gray-100 border -mt-5 rounded-b-lg mb-5 max-h-[200px] overflow-auto">
                            {groups.map(group=>
                                <li className='hover:bg-apricot cursor-pointer py-2 px-4 border-b' onClick={()=> {setValue('group_id', group.name); setDropDown(false)}}>{group.name}</li>    
                            )}
                        </ul>
                    }
                    <MainButton>Add user</MainButton>
                </form>
            </Modal>
            <AuthErrorModal modal={eModal} setModal={setEModal} error={modalError}/>
            {modal2 &&
                <CreateFullGroupModal modal={modal2} setModal={setModal2} callback={(name)=> setValue('group_id', name)}/>
            }
        </>
    )
}

export default AddUserToGroupModal2;