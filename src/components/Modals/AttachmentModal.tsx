import { FC } from 'react'
import Modal from '../UI/Modal';
import { IAttachment } from '../../models/IAttachment';

interface AttachmentModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
    attachment: IAttachment
}

const AttachmentModal: FC<AttachmentModalProps> = ({ modal, setModal, attachment }) => {
    return (
        <Modal active={modal} setActive={setModal} className='items-center !max-w-[1600px] max-2xl:!max-w-[1300px] w-auto'>
            {attachment.type === 'image' &&
                <img src={attachment.url} alt="image" />
            }
            {attachment.type === 'video' &&
                <video src={attachment.url} controls />
            }
        </Modal>
    )
}

export default AttachmentModal;