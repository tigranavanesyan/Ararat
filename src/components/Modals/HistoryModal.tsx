import { FC, useEffect, useState } from 'react'
import Modal from '../UI/Modal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getHomeworks } from '../../store/reducers/HomeworkSlice';
import MainButton from '../UI/MainButton';
import { useParams } from 'react-router-dom';
import format from 'date-fns/format';
import { Link } from 'react-router-dom';
import HomeworkModal from './HomeworkModal';
import GroupInfo from '../MyGroups/GroupInfo';
import History from '../History/History';

interface HistoryModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
}

const HistoryModal: FC<HistoryModalProps> = ({ modal, setModal }) => {
    const { group } = useAppSelector(state=> state.GroupSlice);
    


    return (
        <>
            <Modal active={modal} setActive={setModal} className='!max-w-[1600px] max-2xl:!max-w-[1300px] p-0 items-center'>
                <div className="flex flex-col bg-[#F0F0F0] rounded-3xl w-full">
                <div className='m-5 p-5 bg-[#f0f0f0] rounded-xl flex justify-between flex flex-col'>
                    {group &&
                        <History group={group}/>
                    }
                </div>
                    <MainButton onClick={() => {setModal(false);}} className='my-5 mx-10'>Перейти обратно к уроку</MainButton>
                </div>     
            </Modal>
        </>
    )
}

export default HistoryModal;