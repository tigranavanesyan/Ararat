import { FC, useRef, useEffect, useState } from 'react'
import { BsPlayFill } from '@react-icons/all-files/bs/BsPlayFill'
import { BsPauseFill } from '@react-icons/all-files/bs/BsPauseFill'
import { IMessage } from '../../../models/IMessage';
import WaveSurfer from 'wavesurfer.js'
import { formatTime } from '../../../utils/formatTime';

interface AudioMessageProps {
    msg: IMessage;
    isMe: boolean;
}

const AudioMessage: FC<AudioMessageProps> = ({msg, isMe}) => {
    const message = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [currentTime, setCurrentTime] = useState<string>()
    const [duration, setDuration] = useState<string>()
    const [ws, setWs] = useState<WaveSurfer>();

    useEffect(() => {
        let wafecolor = '#FCEBDF';
        let progresscolor = '#FFFFFF'
        
        if(!isMe) {
            wafecolor = '#B9B9C5';
            progresscolor = '#DBDBE3'
        }
        
        if (msg.type !== 'audio') return
        if (!message.current) return
        
        const wavesurfer = WaveSurfer.create({
            container: message.current,
            waveColor: wafecolor,
            progressColor: progresscolor,
            cursorWidth: 0,
            barWidth: 5,
            barGap: 1,
            barHeight: 0.5,
            height: 70,
            autoplay: false,
            url: msg.audio,
        })
        setWs(wavesurfer);
        const subscriptions = [
            wavesurfer.on('play', () => setIsPlaying(true)),
            wavesurfer.on('pause', () => setIsPlaying(false)),
            wavesurfer.on('timeupdate', (currentTime) => setCurrentTime(formatTime(currentTime))),
            wavesurfer.on('decode', (duration) =>  setDuration(formatTime(duration)))
        ]


        
        return () => {
            subscriptions.forEach((unsub) => unsub());
            wavesurfer.destroy();
        }
    }, [isMe, message, msg.audio, msg.type])

    const playHandler = () => {
        isPlaying ? void ws?.pause() : void ws?.play();
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center">
                <button className={['text-black rounded-full p-3 text-xl mr-3', isMe ? 'bg-[#FCEBDF]' : 'bg-[#B9B9C5]'].join(' ')} onClick={()=> playHandler()}>{isPlaying ? <BsPauseFill/> : <BsPlayFill/>}</button>
                <div className='min-w-[250px] cursor-pointer z-0' ref={message}></div>
            </div>
            <div className="flex justify-between text-sm mb-2">
                <div className="">{currentTime}</div>
                <div className="">{duration}</div>
            </div>
        </div>
    )
}

export default AudioMessage;