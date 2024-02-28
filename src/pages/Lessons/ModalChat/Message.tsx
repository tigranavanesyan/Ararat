import { FC, useEffect, useState } from 'react'
import sanitize from 'sanitize-html';
import { IMessage } from '../../../models/IMessage';

interface MessageProps {
    message: IMessage;
}

const Message: FC<MessageProps> = ({message}) => {
    
    const [wrapMessage, setWrapMessage] = useState<string>('');

    useEffect(() => {
        const urlPattern = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\z`!()\[\]{};:'".,<>?«»“”‘’]))/ig;  // eslint-disable-line no-useless-escape  
        const Replace = message.msg.replace(urlPattern, '<a class="text-blue-500" target="_blank" href="$1">$1</a>');
        setWrapMessage(sanitize(Replace, {allowedTags: ["span", "a"],  allowedAttributes: { a: ["href", "target"] }, allowedClasses: {'span': [ 'text-blue-500' ], 'a': [ 'text-blue-500' ]}}))
    }, [])

    return (
        <div className='mb-1'>
            <p className='break-all'><span className={['font-bold', (message.from?.role === 'DIRECTOR' || message.from?.role === 'ZDIRECTOR') && '!text-red-700'].join(' ')} style={{color: message.from?.hex}}>{message.from?.name} {message.from.sname}:</span> <span dangerouslySetInnerHTML={{__html: wrapMessage}}></span></p>
        </div>
    )
}

export default Message;