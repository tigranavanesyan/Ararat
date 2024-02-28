import { FC } from 'react'
import { JitsiMeeting } from '@jitsi/react-sdk';

interface ChatCallProps {
    roomid: string;
    username: string;
    email: string;
    active: boolean;
    setActive: (bool: boolean) => void;
}

const ChatCall: FC<ChatCallProps> = ({roomid, username, email, active, setActive}) => {
    return (
        <>
            {active&&
                <div className='w-full h-full fixed bg-gray-800 bg-opacity-80 flex items-center justify-center'>
                    <div className="w-full max-w-[1000px]">
                        <JitsiMeeting
                            domain = { 'jitsi.beknazaryanstudio.ru' }
                            roomName = {roomid}
                            configOverwrite = {{
                                startWithAudioMuted: true,
                                disableModeratorIndicator: true,
                                startScreenSharing: true,
                                enableEmailInStats: false,
                                enableLobbyChat: false,
                                hideAddRoomButton: true,
                                toolbarButtons: [
                                    'camera',
                                    'desktop',
                                    'fullscreen',
                                    'highlight',
                                    'microphone',
                                    'noisesuppression',
                                    'participants-pane',
                                    'select-background',
                                    'settings',
                                    'hangup',
                                    'videoquality',
                                    'whiteboard',
                                    ],
                            }}
                            interfaceConfigOverwrite = {{
                                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
                            }}
                            userInfo = {{
                                displayName: username,
                                email: email
                            }}
                            onApiReady = { (externalApi) => {
                                externalApi.addListener('readyToClose', ()=> {setActive(false)});
                            } }
                            
                            getIFrameRef = { (iframeRef) => { iframeRef.style.height = '400px'; } }
                        />
                    </div>
                </div>
            }
        </>
    )
}

export default ChatCall;