import { FC } from 'react'
import File from './File';

interface FileListProps {
    fileList: Array<File>;
    removeFileHandler: (id: number) => void;
}

const FileList: FC<FileListProps> = ({fileList, removeFileHandler}) => {

    return (
        <div className='flex mb-3'>
            {
                fileList.map((file, id)=>
                    <File key={id} file={file} id={id} removeFileHandler={removeFileHandler}/>
                )
            }
        </div>
    )
}

export default FileList;