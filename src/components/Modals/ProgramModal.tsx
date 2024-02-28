import { FC, useEffect } from 'react'
import Modal from '../UI/Modal';
import { useAppDispatch } from '../../hooks/redux';
import { getThemes } from '../../store/reducers/ProgramSlice';
import Filter from '../Program/Filter';
import Themes from '../Program/Themes';
import Materials from '../Program/Materials';
import MainButton from '../UI/MainButton';
import { useParams } from 'react-router-dom';
import { getGroup } from '../../store/reducers/GroupSlice';
import { getTestGroup } from '../../store/reducers/GroupSlice';
import { GroupUpdateSocket } from '../../sockets/GroupSockets';

interface ProgramModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
    testlesson: boolean,
}

const ProgramModal: FC<ProgramModalProps> = ({ modal, setModal, testlesson }) => {
    const dispatch = useAppDispatch();
    const { groupId } = useParams();
    useEffect(() => {
        const fetchData = async() => {
            await dispatch(getThemes({}))
        }
        void fetchData();
    }, [dispatch])

    const closeHandler = async () => {
        if(groupId) {
            if(testlesson) {
                await dispatch(getTestGroup(groupId));
            } else {
                await dispatch(getGroup(groupId));
            }
            GroupUpdateSocket({room: groupId});
        }
    }

    return (
        <Modal onClose={()=> void closeHandler()} active={modal} setActive={setModal} className='!max-w-[1500px] max-2xl:!max-w-[1300px] p-0 items-center'>
            <div className="flex flex-col bg-[#F0F0F0] rounded-3xl w-full">
                <Filter />
                <div className="flex justify-between px-5 py-3">
                    <Themes />
                    <Materials testlesson={testlesson} setActive={setModal}/>
                </div>
                <MainButton onClick={() => {setModal(false); void closeHandler();}} className='mb-5 mx-10'>Перейти обратно к уроку</MainButton>
            </div>
        </Modal>
    )
}

export default ProgramModal;