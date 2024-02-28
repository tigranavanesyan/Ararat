import {FC} from 'react'
import { IAttachment } from '../../../../models/IAttachment';
import Attachment from './Attachment';

interface AttachmentsProps {
    attachments: IAttachment[];
}

const Attachments: FC<AttachmentsProps> = ({attachments}) => {
    return (
        <div className="h-auto flex flex-wrap mb-2">
            {
                attachments.map((item, id) =>
                    <Attachment key={id} attachment={item}/>
                )
            }
        </div>
    )
}

export default Attachments;