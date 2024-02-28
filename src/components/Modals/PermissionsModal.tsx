import { FC, useState, useEffect } from 'react'
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { useForm, SubmitHandler } from "react-hook-form";
import { ServerError } from '../../models/response/ServerError';
import AuthErrorModal from './AuthError';
import DialogService from '../../services/DialogService';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import PermissionsService from '../../services/PermissionsService';
import SuccessModal from './SuccessModal';
import { useAppSelector } from '../../hooks/redux';
import CheckBox from '../UI/Main/CheckBox';

interface AddUserToAddGroupModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
    userdata: string,
    reqCouner: {sber1: number, tink1: number, sber2: number, arm1: number, arm2: number};
}

type Form = {
    group_id: string,
};

const PermissionsModal: FC<AddUserToAddGroupModalProps> = ({ modal, setModal, userdata, reqCouner }) => {
    const [modalError, setModalError] = useState<string>('');
    const {user} = useAppSelector(state => state.UserSlice)
    const [role, setRole] = useState<string>(userdata.role);
    const [requizits, setRequizits] = useState<number>(userdata.requizits);
    const [eModal, setEModal] = useState<boolean>(false);
    const [sModal, setSModal] = useState<boolean>(false);
    const { register, handleSubmit, formState: {errors} } = useForm<Form>();
    const {userid} = useParams();
    const [userInfo, setUserInfo] = useState<{name: string, sname: string, tname: string, seance: boolean, online: boolean, offline: boolean, allgroups: boolean}>({
        name: '',
        sname: '',
        tname: '',
        seance: false,
        online: false,
        offline: false,
        allgroups: false,
    });
    useEffect(() => {
        setUserInfo({name: userdata.name, sname: userdata.sname, tname: userdata.tname, seance: userdata.seance, online: userdata.online, offline: userdata.offline, allgroups: userdata.allgroups});
        setRole(userdata.role);
        setRequizits(userdata.requizits);
    }, [userdata])
    

    const submit = async() => {
        await PermissionsService.setRole(userdata._id, role, userInfo.name, userInfo.sname, requizits, undefined, userInfo.seance, userInfo.online, userInfo.offline, userInfo.allgroups, userInfo.tname).then(()=> {setSModal(true); setModal(false);});
    }

    return (
        <>
            <Modal active={modal} setActive={setModal} className='items-center'>
                <h1 className='text-2xl font-semibold tracking-wider text-gray-800 capitalize '>Edit user</h1>
                <p className='text-center pt-5 mb-2'>{userdata.name} {userdata.sname} {userdata.tname}</p>
                <Input wrapperClasses='mb-5 w-full' type='text' placeholder='Name' label='Name:' value={userInfo.name} onChange={e=> setUserInfo({...userInfo, name: e.target.value})}/>
                <Input wrapperClasses='mb-5 w-full' type='text' placeholder='Surname' label='Surname:'value={userInfo.sname} onChange={e=> setUserInfo({...userInfo, sname: e.target.value})}/>
                <Input wrapperClasses='mb-5 w-full' type='text' placeholder='Отчество' label='Отчество:'value={userInfo.tname} onChange={e=> setUserInfo({...userInfo, tname: e.target.value})}/>
                <p className='text-left self-start'>Role:</p>
                <select onChange={e=> setRole(e.target.value)} className='border-2 border-black mb-5 w-full'>
                    {user.role === 'DIRECTOR' &&
                        <>
                            <option selected={role === 'DIRECTOR'} value="DIRECTOR">DIRECTOR</option>
                            <option selected={role === 'ZDIRECTOR'} value="ZDIRECTOR">Зам. DIRECTOR</option>
                            <option selected={role === 'ADMIN'} value="ADMIN">ADMIN</option>
                            <option selected={role === 'TRANER'} value="TRANER">TRANER</option>
                            <option selected={role === 'TRANERMETODIST'} value="TRANERMETODIST">TRANER METODIST</option>
                        </>
                    }
                    <option selected={role === 'STUDENT'} value="STUDENT">STUDENT</option>
                    <option selected={role === 'NEWUSER'} value="NEWUSER">NEW USER</option>
                </select>
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') &&
                    <select onChange={e=> setRequizits(e.target.value)} className='border-2 border-black mb-5 w-full'>
                        <option selected={requizits === 1} value="1">Сбер (Grigoryan Hrachya) | {reqCouner.sber1} исп.</option>
                        <option selected={requizits === 2} value="2">Тинькофф (Grigoryan Hrachya) | {reqCouner.tink1} исп.</option>
                        <option selected={requizits === 3} value="3">Сбер (Tamamyan Arevik) | {reqCouner.sber2} исп.</option>
                        <option selected={requizits === 4} value="4">ID bank Armenia (Anahit Tadevosyan) | {reqCouner.arm1} исп.</option>
                        <option selected={requizits === 5} value="5">ID bank Armenia (Meline Khachatryan | {reqCouner.arm2} исп.)</option>
                        {/* <option selected={requizits === 6} value="6">Сбер (Ogannes Khachatryan)</option> */}
                    </select>
                }
                <div className="w-full">
                    <CheckBox checked={userInfo.seance} onChange={()=> setUserInfo({...userInfo, seance: userInfo.seance ?false:true})} wrapperClass='mb-3' label='Готов к сеансу'/>
                    <CheckBox checked={userInfo.online} onChange={()=> setUserInfo({...userInfo, online: userInfo.online ?false:true})} wrapperClass='mb-3' label='Онлайн турнир чаты'/>
                    <CheckBox checked={userInfo.offline} onChange={()=> setUserInfo({...userInfo, offline: userInfo.offline ?false:true})} wrapperClass='mb-3' label='Офлайн турнир чаты'/>  
                    {role === 'ZDIRECTOR' &&
                        <CheckBox checked={userInfo.allgroups} onChange={()=> setUserInfo({...userInfo, allgroups: userInfo.allgroups ?false:true})} wrapperClass='mb-3' label='Добавить во все группы'/>
                    }
                </div>
                <Button onClick={e=> submit()}>Submit</Button>
            </Modal>
            <AuthErrorModal modal={eModal} setModal={setEModal} error={modalError}/>
            <SuccessModal modal={sModal} setModal={setSModal} message='User role changed successfully!'/>
        </>
    )
}

export default PermissionsModal;