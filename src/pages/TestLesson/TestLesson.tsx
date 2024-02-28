import { FC, useEffect, useState } from 'react'
import TestLessonService from '../../services/TestLessonService'
import { useParams } from 'react-router-dom';
import TopMenuTestLesson from '../../components/UI/TopMenu/TopMenuTestLesson';
import { ITopMenuOnlineLesson } from '../../models/ITopMenu';
import Container from '../../components/TestLesson/Container';
import { GroupRoomSocket, GroupRoomDisconnectSocket } from '../../sockets/GroupSockets';
import { authUser } from '../../store/reducers/UserSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import Modal from '../../components/UI/Modal';
import { useForm, SubmitHandler } from "react-hook-form";
import Input from '../../components/UI/Main/Input';
import MainButton from '../../components/UI/MainButton';

type Form = {
    name: string,
};

const TestLesson: FC = () => {
    const { register, handleSubmit, formState: {errors} } = useForm<Form>();
    const {groupId} = useParams();
    const dispatch = useAppDispatch();
    const {user} = useAppSelector(state=> state.UserSlice);
    const [modal, setModal] = useState<boolean>(true);
    useEffect(() => {
        const createGroup = async () => {
            // await TestLessonService.createGroup().then(resp=> {
            //     if(resp.data.group._id) {
            //         navigate('/testlesson/'+resp.data.group._id, {state: {from: location}, replace: true})
            //     }
            // });
        }
        void createGroup();
    }, [])

    useEffect(() => {
        if(groupId) {
            GroupRoomSocket(groupId);
        }
        return () => {
            if(groupId) {
                GroupRoomDisconnectSocket(groupId);
            }
        }
    }, [groupId])

    const onSubmit: SubmitHandler<Form> = async (data, e) => {
        e?.preventDefault();
        dispatch(authUser({name: data.name, sname: ''}));
        setModal(false);
    }

    const [menu] = useState<ITopMenuOnlineLesson[]>([
        {id: 0, name: 'Программа', openProgram: true}, // eslint-disable-line @typescript-eslint/restrict-template-expressions
    ])
    return(
        <div className='w-full'>
            <TopMenuTestLesson menu={menu} />
            {!user.role &&
                <Modal noclosable={true} active={modal} setActive={setModal}>
                    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className='bg-white container mx-auto flex flex-col px-10 py-5'>
                        <h1 className='text-2xl font-bold text-center mb-5'>Напишите имя ученика</h1>
                        <Input wrapperClass='mb-5' type="text" placeholder='Имя' error={errors.name?.message} register={register('name', { required: "The field must be filled" })}/>
                        <MainButton>Сохранить</MainButton>
                    </form>
                </Modal>
            }
            {user.name &&
                <Container />
            }
            
        </div>
    )

}

export default TestLesson;