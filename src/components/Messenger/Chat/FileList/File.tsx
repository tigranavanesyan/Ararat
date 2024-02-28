import { FC } from 'react'
import { BsFillFileArrowDownFill } from '@react-icons/all-files/bs/BsFillFileArrowDownFill'
import { IoMdClose } from '@react-icons/all-files/io/IoMdClose'
import { BsEye } from '@react-icons/all-files/bs/BsEye'
import { useAppDispatch } from '../../../../hooks/redux';
import { setAttachmentModal } from '../../../../store/reducers/MessengerSlice';

interface FileProps {
    id: number;
    file: File;
    removeFileHandler: (id: number) => void;
}

const File: FC<FileProps> = ({file, id, removeFileHandler}) => {
    const fileImage = file.type.indexOf('image');
    const videoImage = file.type.indexOf('video');
    const dispath = useAppDispatch();
    const setM = (bool: boolean) => {
        let type = '' as string;
        if(fileImage === 0) {
            type = 'image';
        } else if (videoImage === 0) {
            type = 'video';
        }
        dispath(setAttachmentModal({modal: bool, attachment: {url: URL.createObjectURL(file), type: type}}));
    }
    return (
        <div className='h-[100px] relative w-[100px] mr-3'>
            <div className="z-10 absolute right-0 text-white bg-gray-400 bg-opacity-80 px-1">
                {(fileImage === 0 || videoImage === 0) &&
                    <button className='mr-2 ' onClick={() => setM(true)}><BsEye/></button>
                }
                <button className='text-white' onClick={() => removeFileHandler(id)}><IoMdClose/></button>
            </div>
            {fileImage === 0 &&
                <img className='h-full w-full object-cover' src={URL.createObjectURL(file)} alt="img"/>
            }
            {videoImage === 0 &&
                <video controls className='h-full w-full object-cover' src={URL.createObjectURL(file)}/>
            }
            {(fileImage !== 0 && videoImage !== 0) &&
                <div className="bg-violet-500 w-full h-full flex flex-col justify-center items-center text-white text-4xl">
                    <BsFillFileArrowDownFill className='mb-3'/>
                    <p className='text-sm break-all'>{file.name}</p>
                </div>
            }
        </div>
    )
}

export default File;