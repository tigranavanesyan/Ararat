import { FC, useState, useEffect } from 'react'
import Modal from '../UI/Modal';
import 'react-datepicker/dist/react-datepicker.css'
import format from 'date-fns/format';
import VideoService from '../../services/VideoService';
import { IVideo } from '../../models/IVideo';

interface VideoModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
    video: string;
    name: Date;
}


const VideoModal: FC<VideoModalProps> = ({ modal, setModal, video, name }) => {
    const [videoObj, setVideoObj] = useState<IVideo>({} as IVideo);

    useEffect(() => {
        const fetchData = async () => {
            if(video) {
                await VideoService.getVideo(video).then(res=> {
                    setVideoObj(res.data.video);
                });
            }
        }
        void fetchData();
    }, [video])

    return (
        <>
            <Modal active={modal} setActive={setModal} className='items-center !rounded-3xl max-w-[700px] border-2 border-[#8A6E3E]'>
                <h1 className='text-2xl font-bold tracking-wider text-gray-800 capitalize mb-6'>Занятие: {format(new Date(name), 'dd.MM.Y')}</h1>
                {videoObj.video &&
                    <video src={videoObj.video} controls={true}></video>
                }
            </Modal>
        </>
    )
}

export default VideoModal;