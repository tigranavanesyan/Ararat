import { FC, useEffect } from 'react'
import Modal from '../UI/Modal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getHomeworks } from '../../store/reducers/HomeworkSlice';
import MainButton from '../UI/MainButton';
import { useParams } from 'react-router-dom';
import format from 'date-fns/format';
import { Link } from 'react-router-dom';
import Table from '../../components/Homework/CheckPacge/Table';
import { GroupUpdateSocket } from '../../sockets/GroupSockets';
import { getGroup } from '../../store/reducers/GroupSlice';

interface HomeworkModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
    homeworkId: string;
    parsetModal: (bool: boolean) => void;
}

const HomeworkModal: FC<HomeworkModalProps> = ({ modal, setModal, homeworkId, parsetModal }) => {
    const {groupId} = useParams();
    const dispatch = useAppDispatch();
    const { group } = useAppSelector(state=> state.GroupSlice)
    useEffect(() => {
        const fetchData = async() => {
            await dispatch(getHomeworks({group_id: groupId}))
        }
        void fetchData();
    }, [dispatch])

    const closeHandler = async () => {
        if(groupId) {
            parsetModal(false);
            await dispatch(getGroup(groupId));
            GroupUpdateSocket({room: groupId});
        }
    }

    return (
        <Modal onClose={()=> void closeHandler()} active={modal} setActive={setModal} className='!max-w-[1600px] max-2xl:!max-w-[1300px] p-0 items-center'>
            <div className="flex flex-col bg-[#F0F0F0] rounded-3xl w-full">
                <div className='w-full'>
                    <div className='m-5 p-5 bg-[#f0f0f0] rounded-xl flex justify-between'>
                        <div className="flex flex-col w-full">
                            {group &&
                                <Table table={group} homework={homeworkId}/>
                            }
                        </div>
                    </div>
                </div>
                <MainButton onClick={() => {setModal(false); void closeHandler();}} className='my-5 mx-10'>Перейти обратно к уроку</MainButton>
            </div>
        </Modal>
    )
}

export default HomeworkModal;