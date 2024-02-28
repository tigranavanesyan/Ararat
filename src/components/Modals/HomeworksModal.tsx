import { FC, useEffect, useState } from 'react'
import Modal from '../UI/Modal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getHomeworks } from '../../store/reducers/HomeworkSlice';
import MainButton from '../UI/MainButton';
import { useParams } from 'react-router-dom';
import format from 'date-fns/format';
import { Link } from 'react-router-dom';
import HomeworkModal from './HomeworkModal';

interface HomeworksModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
}

const HomeworksModal: FC<HomeworksModalProps> = ({ modal, setModal }) => {
    const {groupId} = useParams();
    const [modal2, setModal2] = useState<boolean>(false);
    const [homeworkId, setHomeworkId] = useState<string>('');
    const dispatch = useAppDispatch();
    const { homeworks } = useAppSelector(state=> state.HomeworkSlice);
    useEffect(() => {
        const fetchData = async() => {
            await dispatch(getHomeworks({group_id: groupId}))
        }
        void fetchData();
    }, [dispatch])


    return (
        <>
            <Modal active={modal} setActive={setModal} className='!max-w-[1600px] max-2xl:!max-w-[1300px] p-0 items-center'>
                <div className="flex flex-col bg-[#F0F0F0] rounded-3xl w-full">
                <div className='m-5 p-5 bg-[#f0f0f0] rounded-xl flex justify-between'>
                    <div className="flex flex-col w-full overflow-auto max-h-[calc(100vh-280px)]">
                        {homeworks &&
                            homeworks.map(item=>
                                <div key={item._id} className="w-full bg-gradient-top-menu rounded-xl p-3 flex justify-between mb-5">
                                    <div className="flex">
                                        {item.lesson &&
                                            <div className="flex text-xl font-bold flex-col items-center justify-center bg-gradient-button rounded-xl px-3 mr-10">
                                                <p className='text-[#8A6E3E]'>Дата урока: {format(new Date(item.lesson), 'd MMM')}</p>
                                            </div>
                                        }
                                        <div className="flex text-xl font-bold flex-col items-center justify-center bg-gradient-button rounded-xl px-3 mr-10">
                                            <p className='text-[#8A6E3E]'>Срок до: {format(new Date(item.end), 'd MMM')}</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className='text-2xl text-white mb-3'>Домашнее задание</p>
                                            <div className="flex">
                                                {groupId &&
                                                    <button onClick={() => {setHomeworkId(item._id); setModal2(true);}} className='bg-gradient-button rounded-full px-4 text-lg font-semibold'>Посмотреть дз</button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-center max-w-[300px] border-l-4 border-l-[#B7975A] pl-5">
                                        
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
                    <MainButton onClick={() => {setModal(false);}} className='my-5 mx-10'>Перейти обратно к уроку</MainButton>
                </div>     
            </Modal>
            {modal2 &&
                <HomeworkModal modal={modal2} setModal={setModal2} parsetModal={setModal} homeworkId={homeworkId}/>
            } 
        </>
    )
}

export default HomeworksModal;