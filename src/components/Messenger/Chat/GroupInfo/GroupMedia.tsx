import { FC, useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'
import { IMessage } from '../../../../models/IMessage'
import { IAttachment } from '../../../../models/IAttachment'
import Attachment from '../Attachments/Attachment'
import Message from '../Message'
import { Fragment } from 'react'

interface GroupMediaProps {
    messages: IMessage[];
}

const GroupMedia: FC<GroupMediaProps> = ({ messages }) => {

    const [attachments, setAttachments] = useState<IAttachment[]>([]);
    const [linkMessages, setLinkMessages] = useState<IMessage[]>([]);

    useEffect(() => {
        const tempAttachments = [] as IAttachment[];
        const tempMessages = [] as IMessage[];
        const urlPattern = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\z`!()\[\]{};:'".,<>?«»“”‘’]))/ig; // eslint-disable-line no-useless-escape 
        messages.map(message => {
            if(message.attachments.length > 0) {
                message.attachments.map(attachment=> {
                    tempAttachments.push(attachment);
                })
            }
            if(message.msg.match(urlPattern)) {
                tempMessages.push(message);
            }
        })
        setAttachments(tempAttachments);
        setLinkMessages(tempMessages);
    }, [messages])
    
    
    return (
        <div className='px-1'>
            <Tab.Group>
                <Tab.List className='flex justify-between px-4 mb-4'>
                    <Tab>
                        {({ selected }) => (
                            <button className={ selected ? 'border-b-2 border-gray-900 font-medium text-lg p-2' : 'font-medium text-lg p-2'}>Media</button>
                        )}
                    </Tab>
                    <Tab>
                        {({ selected }) => (
                            <button className={ selected ? 'border-b-2 border-gray-900 font-medium text-lg p-2' : 'font-medium text-lg p-2'}>Files</button>
                        )}
                    </Tab>
                    <Tab>
                        {({ selected }) => (
                            <button className={ selected ? 'border-b-2 border-gray-900 font-medium text-lg p-2' : 'font-medium text-lg p-2'}>Links</button>
                        )}
                    </Tab>
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel>
                        <div className="flex flex-wrap h-[calc(100vh-100px)] overflow-auto">
                            {attachments.map((attachment, id)=>
                                attachment.type !== 'file' &&
                                <Attachment key={id} className='flex-grow-0' attachment={attachment}/>
                            )}
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="flex flex-wrap h-[calc(100vh-100px)] overflow-auto">
                            {attachments.map((attachment, id)=>
                                attachment.type === 'file' &&
                                <Attachment key={id} className='flex-grow-0' attachment={attachment}/>
                            )}
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="flex flex-wrap h-[calc(100vh-100px)] overflow-auto">
                            {linkMessages.map((message,id)=>
                                <Message key={id} className='w-full' msg={message} isMe={false}/>
                            )}
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    )
}

export default GroupMedia;