import { FC, useState, useEffect } from 'react'
import TopMenu from '../../components/UI/TopMenu/TopMenu';
import { ITopMenu } from '../../models/ITopMenu';
import VideoGroups from '../../components/Video/VideoGroups';
import { IMyGropsTable } from '../../models/MyGroups/IMyGropsTable';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getGroups } from '../../store/reducers/GroupSlice';
import VideoList from '../../components/Video/VideoList';
import copy from 'copy-to-clipboard';

const VideoPage: FC = () => {
    const [menu] = useState<ITopMenu[]>([
        {id: 0, name: 'Название'},
        {id: 1, name: 'Уровень знаний'},
        {id: 2, name: 'Кол.\nучеников'},
        {id: 3, name: 'Начало обучения'},
    ])
    const [copyed, setCopyed] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { groups } = useAppSelector(state=> state.GroupSlice)
    const { user } = useAppSelector(state=> state.UserSlice);
    useEffect(() => {
        const fetchData = async() => {
            await dispatch(getGroups({videocounter: true}))
        }
        void fetchData();
    }, [dispatch])
    

    return (
        <div className='w-full'>
            <TopMenu/>
            <div className="h-[calc(100vh-100px)] overflow-auto">
                <p className='text-lg font-semibold text-red-500 px-5 mt-4 text-center'>Вы пропустили урок и тут не нашли запись урока?</p>
                <p className='text-lg font-semibold text-red-500 px-5 mt-4 text-center'>Чтобы аннулировать списание за урок, напишите администратору - <a target='_blank' className='text-blue-500' href="https://puzzle.araratchess.com/messenger/chat/651c1e9fbfbc95c1f9d7f8b8">https://puzzle.araratchess.com/messenger/chat/651c1e9fbfbc95c1f9d7f8b8</a></p>
                <p className='text-lg font-semibold text-black-500 px-5 mt-4 text-center'>Здравствуйте, мы пропустили урок и с нас списали денежные средства, но видеозаписи урока нет в разделе видеоуроки.<br/>Добавьте, пожалуйста, видеозапись или аннулируйте списание. <span className='cursor-pointer font-bold text-red-500' onClick={() => {setCopyed(true); copy('Здравствуйте, мы пропустили урок и с нас списали денежные средства, но видеозаписи урока нет в разделе видеоуроки. Добавьте, пожалуйста, видеозапись или аннулируйте списание.')}}>({copyed ?  'Скопировано' : 'Копировать текст'})</span></p>
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANER' || user.role === 'TRANERMETODIST') ?
                    groups &&
                    <VideoGroups groups={groups} />
                    :
                    <VideoList />
                }
            </div>
        </div>
    )
}

export default VideoPage;