import { FC } from 'react'

import Chats from '../../components/Messenger/Chats/Chats';
import StartMessaging from '../../components/Messenger/StartMessaging';

const MessengerPage: FC = () => {
    return (
        <>
            <Chats/>
            <StartMessaging/>
        </>
    )
}

export default MessengerPage;