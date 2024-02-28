import {FC, useEffect, useState, ChangeEvent} from 'react'
import { useParams } from 'react-router-dom';
import VideoService from '../../services/VideoService';
import { IVideo } from '../../models/IVideo';
import { format } from 'date-fns';
import VideoModal from '../Modals/VideoModal';
import SuccessModal from '../Modals/SuccessModal';
import AuthErrorModal from '../Modals/AuthError';
import Modal from '../UI/Modal';
import { useAppSelector } from '../../hooks/redux';

const VideoList: FC = () => {
    const {groupId} = useParams();
    const [videos, setVideos] = useState<IVideo[]>([]);
    const [modal, setModal] = useState<boolean>(false);
    const [name, setName] = useState<Date>(new Date());
    const [video, setVideo] = useState<string>('');
    const [modal2, setModal2] = useState<boolean>(false);
    const [modal3, setModal3] = useState<boolean>(false);
    const [modalError] = useState<string>('Повторите попытку позже');
    const [eModal, setEModal] = useState<boolean>(false);
    const {user} = useAppSelector(state=> state.UserSlice);

    useEffect(() => {
        const fetchData = async() => {
            await VideoService.getVideos(groupId).then(res=>setVideos(res.data.videos));
        }
        void fetchData();
    }, [groupId])

    const setFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
        const event = e.target as HTMLInputElement
        if(event.files) {
            let file: File | undefined = undefined;
            for(let i = 0; i < event.files.length; i++) {
                file = event.files[i];
            }
            if(file) {
                if(file.type.includes('video')) {
                    if(groupId) {
                        setModal3(true);
                        await VideoService.uploadVideo(groupId, file).then(res=> {setModal3(false); setModal2(true); setVideos(prevState => [res.data.video, ...prevState])}).catch(e=> setEModal(true));
                    }
                }
            }
            
        }
    }
    
    return (
        <div className="p-5">
            <div className="w-full bg-[#f0f0f0] rounded-xl overflow-hidden border-collapse py-10 p-20 flex flex-col">
                <div className="flex flex-col overflow-auto h-[calc(100vh-420px)]">
                    {videos &&
                        videos.map(video=>
                            <button onClick={()=> {setModal(true); setVideo(video._id); setName(video.date)}} key={video._id} className="mb-3 bg-white border rounded-full py-2 px-8 font-semibold text-center">
                                Занятие: {format(new Date(video.date), 'dd.MM.Y')}
                            </button>
                        )
                    }
                </div>
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANER' || (user.role === 'TRANERMETODIST' && groupId !== '653bb68d6188c50706d14f4a')) &&
                    <>
                        <label htmlFor='fileupl' className='text-center cursor-pointer bg-gradient-button text-4xl py-16 mt-10 font-semibold rounded-full'>Добавить видеозапись</label>
                        <input className='hidden' id='fileupl' accept="video/mp4,video/x-m4v,video/*, .mkv" onChange={e=> void setFileHandler(e)} type="file" name='file'/>
                    </>
                }
            </div>
            <VideoModal modal={modal} setModal={setModal} video={video} name={name}/>
            <AuthErrorModal modal={eModal} setModal={setEModal} error={modalError}/>
            <SuccessModal modal={modal2} setModal={setModal2} message='Видео загружено!'/>
            <Modal noclosable={true} active={modal3} setActive={setModal3} className='items-center'>
                <p className='text-xl font-bold'>Загрузка...</p>
            </Modal>
        </div>
    )
}

export default VideoList;