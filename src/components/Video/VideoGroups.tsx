import { FC, useState, useEffect } from 'react'
import { IGroup } from '../../models/response/IGroup';
import Groups from '../../assets/menu-icons/groups-black.png'
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import { useAppSelector } from '../../hooks/redux';
import { AiOutlinePlus } from '@react-icons/all-files/ai/AiOutlinePlus'
import CreateFullGroupModal from '../Modals/CreateFullGroupModal';
import VideoGroup from './VideoGroup';
import VideoService from '../../services/VideoService';

interface VideoGroupsProps {
    groups: IGroup[];
}

const VideoGroups: FC<VideoGroupsProps> = ({groups}) => {
    const {user} = useAppSelector(state=> state.UserSlice);
    const [couners, setCounters] = useState<{my: number, learn: number}>({my: 0, learn: 0})
    useEffect(() => {
        VideoService.getCounters().then(resp => setCounters({my: resp.data.my, learn: resp.data.learn}));
    }, [])
    
    return (
        <div className="p-5">
            <div className="w-full bg-[#f0f0f0] rounded-xl overflow-hidden border-collapse flex flex-wrap py-10 p-20">
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') &&
                    <div key={'653bb68d6188c50706d14f4a'} className="basis-1/2 mb-3">
                        <VideoGroup group={{_id: '653bb68d6188c50706d14f4a', name: 'Обучающий материал', videocounter: couners.learn}}/>
                    </div>
                }
                {user.role === 'TRANERMETODIST' &&
                    <>
                        <div key={'653bb68d6188c50706d14f4a'} className="basis-1/2 mb-3">
                            <VideoGroup group={{_id: '653bb68d6188c50706d14f4a', name: 'Обучающий материал', videocounter: couners.learn}}/>
                        </div>
                        <div key={user._id} className="basis-1/2 mb-3">
                            <VideoGroup group={{_id: user._id, name: 'ПРОБНЫЕ УРОКИ ЛИЧНАЯ', videocounter: couners.my}}/>
                        </div>
                    </>
                }
                {groups.map(group=>
                    group._id !== '653bb23a7575d7142fe229e7' &&
                    <div key={group._id} className="basis-1/2 mb-3">
                        <VideoGroup group={group}/>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VideoGroups;