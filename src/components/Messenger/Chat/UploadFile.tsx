import { FC, ChangeEvent } from 'react'
import {ImAttachment} from '@react-icons/all-files/im/ImAttachment';

interface UploadFileProps {
    theme?: string;
    className?: string;
    setFilesHandler: (files: FileList) => void;
    multiple?: boolean
    id: string;
    accept: string;
    labelClass?: string;
}

const UploadFile: FC<UploadFileProps> = ({setFilesHandler, className, labelClass, theme, multiple, id, accept}) => {

    const filesHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const event = e.target as HTMLInputElement
        if(event.files) {
            setFilesHandler(event.files);
        }
    }

    return (
        <div className={className ? className : ''}>
            <input accept={accept} multiple={multiple} onChange={e=> filesHandler(e)} type="file" id={id} className='hidden'/>
            <label htmlFor={id} className={['hover:bg-gray-700 py-2 cursor-pointer flex px-3 rounded-sm transition-all mr-2 text-white text-xl', theme === 'dark' && '!text-gray-900 hover:!text-white', labelClass].join(' ')}><ImAttachment/></label>
        </div>
    )
}

export default UploadFile;