import { FC, useEffect } from 'react'
import Modal from '../UI/Modal';
import { useAppDispatch } from '../../hooks/redux';
import { getThemes } from '../../store/reducers/ProgramSlice';
import Filter from '../Program/Filter';
import Themes from '../Program/Themes';
import Materials from '../Program/Materials';
import MainButton from '../UI/MainButton';

interface SelectHomeWorkModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
    selectHomeWork: (data: {_id: string, position: string, seq: number}) => void;
}

const SelectHomeWorkModal: FC<SelectHomeWorkModalProps> = ({ modal, setModal, selectHomeWork }) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const fetchData = async() => {
            await dispatch(getThemes({}))
        }
        void fetchData();
    }, [dispatch])

    return (
        <Modal active={modal} setActive={setModal} className='!max-w-[1300px] p-0 items-center'>
            <div className="flex flex-col bg-[#F0F0F0] rounded-3xl w-full">
                <Filter />
                <div className="flex justify-between px-5 py-3">
                    <Themes />
                    <Materials setActive={setModal} selectHomeWork={selectHomeWork} homework={true}/>
                </div>
                <MainButton onClick={() => setModal(false)} className='mb-5 mx-10'>Перейти обратно в раздел дз</MainButton>
            </div>
        </Modal>
    )
}

export default SelectHomeWorkModal;