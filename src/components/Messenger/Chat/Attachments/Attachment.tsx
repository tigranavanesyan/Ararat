import { FC } from 'react'
import { IAttachment } from '../../../../models/IAttachment';
import { BsEye } from '@react-icons/all-files/bs/BsEye'
import { BsPlayFill } from '@react-icons/all-files/bs/BsPlayFill'
import { BsDownload } from '@react-icons/all-files/bs/BsDownload'
import { BsFillFileArrowDownFill } from '@react-icons/all-files/bs/BsFillFileArrowDownFill'
import { useAppDispatch } from '../../../../hooks/redux';
import { setAttachmentModal } from '../../../../store/reducers/MessengerSlice';

interface AttachmentProps {
    attachment: IAttachment;
    className?: string; 
}

const Attachment: FC<AttachmentProps> = ({attachment, className}) => {
    const dispath = useAppDispatch();
    const setM = (bool: boolean) => {
        dispath(setAttachmentModal({modal: bool, attachment: attachment}));
    }

    return (
        <>
            {(attachment.type === 'image' || attachment.type === 'video') &&
                <div onClick={() => setM(true)} className={["h-[150px] basis-1/3 flex-grow mb-2 [&>div]:hover:flex relative hover:before:bg-gray-800 hover:before:opacity-80 before:absolute hover:before:w-[calc(100%-8px)] cursor-pointer hover:before:h-full",className].join(' ')}>
                    <div className="hidden text-white text-3xl absolute items-center justify-center h-full w-[calc(100%-8px)]">
                        {attachment.type === 'image' &&
                            <BsEye/>
                        }
                        {attachment.type === 'video' &&
                            <BsPlayFill/>
                        }
                    </div>
                    {attachment.type === 'image' &&
                        <img className='h-full pr-2' src={attachment.url} alt="image" />
                    }
                    {attachment.type === 'video' &&
                        <video className='h-full pr-2 w-full object-cover' src={attachment.url}></video>
                    }
                    
                </div>
            }
            {attachment.type === 'file' &&
                <a href={attachment.url} target='_blank'  download={true} className="h-[150px] basis-1/3 flex-grow mb-2 [&>div]:hover:flex relative hover:before:bg-gray-800 hover:before:opacity-80 before:absolute hover:before:w-[calc(100%-8px)] cursor-pointer hover:before:h-full">
                    <div className="hidden text-white text-3xl absolute items-center justify-center h-full w-[calc(100%-8px)]"><BsDownload/></div>
                    <div className="bg-violet-500 w-[calc(100%-8px)] h-full flex flex-col justify-center items-center text-white text-4xl">
                        <BsFillFileArrowDownFill className='mb-3'/>
                        <p className='text-base break-all text-center'>{attachment.name}</p>
                    </div>
                </a>
            }
        </>
        
    )
}

export default Attachment;