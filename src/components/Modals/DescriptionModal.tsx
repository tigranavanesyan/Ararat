import { FC, useEffect } from 'react'
import Modal from '../UI/Modal';
import { useAppDispatch } from '../../hooks/redux';
import { getThemes } from '../../store/reducers/ProgramSlice';
import MainButton from '../UI/MainButton';
import { useParams } from 'react-router-dom';
import GroupInfo from '../MyGroups/GroupInfo';
import Description from '../MyGroups/Description/Description';

interface DescriptionModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
}

const DescriptionModal: FC<DescriptionModalProps> = ({ modal, setModal }) => {
    const dispatch = useAppDispatch();
    const { groupId } = useParams();
    useEffect(() => {
        const fetchData = async() => {
            await dispatch(getThemes({}))
        }
        void fetchData();
    }, [dispatch])


    return (
        <Modal active={modal} setActive={setModal} className='!max-w-[1600px] max-2xl:!max-w-[1300px] p-0 items-center'>
            <div className="flex flex-col bg-[#F0F0F0] rounded-3xl w-full">
                <GroupInfo />
                <Description/>
                <MainButton onClick={() => {setModal(false);}} className='my-5 mx-10'>Перейти обратно к уроку</MainButton>
            </div>
        </Modal>
    )
}

export default DescriptionModal;