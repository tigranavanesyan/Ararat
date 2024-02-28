import { FC, useEffect, useState } from 'react'
import sanitize from 'sanitize-html';

interface MessageProps {
    message: {id: string, name: string, sname: string, msg: string};
}

const Message: FC<MessageProps> = ({message}) => {
    
    const [wrapMessage, setWrapMessage] = useState<string>('');

    useEffect(() => {
        const urlPattern = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/gi;  // eslint-disable-line no-useless-escape  
        const Replace = message.msg.replace(urlPattern, '<a class="text-blue-500" target="_blank" href="$&">$&</a>');
        setWrapMessage(sanitize(Replace, {allowedTags: ["span", "a"],  allowedAttributes: { a: ["href", "target"] }, allowedClasses: {'span': [ 'text-blue-500' ], 'a': [ 'text-blue-500' ]}}))
    }, [])

    return (
        <div>
            <p className='break-all'><span className='font-bold'>{message.name} {message.sname}:</span> <span dangerouslySetInnerHTML={{__html: wrapMessage}}></span></p>
        </div>
    )
}

export default Message;