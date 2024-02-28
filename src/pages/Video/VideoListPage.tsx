import { FC } from 'react'
import TopMenu from '../../components/UI/TopMenu/TopMenu';
import VideoList from '../../components/Video/VideoList';

const VideoListPage: FC = () => {
    return (
        <div className='w-full'>
            <TopMenu/>
            <VideoList />
        </div>
    )
}

export default VideoListPage;