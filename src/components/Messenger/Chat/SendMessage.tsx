import { FC, useState, useRef, useEffect } from 'react'
import Textarea from './Textarea';
import AudioRecord from './AudioRecord';
import IcoButton from '../../UI/IcoButton';
import { BsMic } from '@react-icons/all-files/bs/BsMic';
import { VscSend } from '@react-icons/all-files/vsc/VscSend';
import { BsEmojiSmile } from '@react-icons/all-files/bs/BsEmojiSmile';
import { BsStopFill } from '@react-icons/all-files/bs/BsStopFill';
import EmojiPicker from '../../UI/EmojiPicker';
import { ServerError } from '../../../models/response/ServerError';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { sendMessage, editMessage } from '../../../store/reducers/MessengerSlice';
import { toggleRecording } from '../../../services/MediaRecord';
import { recorder } from '../../../services/MediaRecord';
import UploadFile from './UploadFile';
import FileList from './FileList/FileList';
import { IMessage } from '../../../models/IMessage';
import ReplyMessage from './ReplyMessage';
import { setReplyMessage, setEditMessage } from '../../../store/reducers/MessengerSlice';

const SendMessage: FC = () => {
    const [replyMsg, setReplyMsg] = useState<IMessage | null>();
    const [replyCanceled, setReplyCanceled] = useState<boolean>(false);
    const [edMessage, setEditMsg] = useState<IMessage | null>();
    const [src, setSrc] = useState<Blob>();
    const [audioRecord, setAudioRecord] = useState<boolean>(false);
    const { userid } = useParams();
    const ref = useRef<HTMLButtonElement>(null);
    const [msg, setMsg] = useState<string>('');
    const [pickerActive, setPickerActive] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { reply, editMsg, chat } = useAppSelector(state => state.MessengerSlice);
    const [fileList, setfileList] = useState<Array<File>>([]);
    const [tagState, setTagState] = useState<boolean>(false);

    const msgHandler = async () => {
        if (userid) {
            if (!edMessage) {
                if (msg.length > 0 || src || fileList.length > 0) {
                    const response = await dispatch(sendMessage({ msg, userid, audio: src, fileList: fileList, reply: reply }));
                    const res = response.payload as ServerError;
                    if (!res?.error) {
                        setMsg('');
                        setSrc(undefined);
                        setfileList([]);
                        dispatch(setReplyMessage(null));
                    }
                }
            } else {
                if (msg.length > 0 || fileList.length > 0) {
                    if (editMsg) {
                        const response = await dispatch(editMessage({ msg_id: editMsg, msg, fileList: fileList }));
                        const res = response.payload as ServerError;
                        if (!res?.error) {
                            setMsg('');
                            setSrc(undefined);
                            setfileList([]);
                            dispatch(setEditMessage(null));
                        }
                    }

                }
            }

        }
    }

    useEffect(() => {
        const fetch = async () => {
            await msgHandler();
        }
        if (src) {
            void fetch();
        }
    }, [src])  // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (reply) {
            const msg = chat.messages.filter(message => message._id === reply)[0];
            if (msg) {
                setReplyMsg(msg);
            }
        } else {
            setReplyMsg(null);
        }
    }, [reply])  // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (editMsg) {
            const msg = chat.messages.filter(message => message._id === editMsg)[0];
            if (msg) {
                setEditMsg(msg);
            }
        } else {
            setEditMsg(null);
        }
    }, [editMsg])  // eslint-disable-line react-hooks/exhaustive-deps


    const recorderHandler = (bool = true as boolean) => {
        audioRecord ? setAudioRecord(false) : setAudioRecord(true);
        toggleRecording();
        if (bool) {
            if (recorder?.state) {
                recorder.ondataavailable = function (e) {
                    //const url = URL.createObjectURL(e.data);
                    setSrc(e.data);
                };
            }
        }

    }
    const stopRecordHandler = () => {
        recorderHandler(false);
        setSrc(undefined);
    }

    const audioMessageHandler = () => {
        recorderHandler();
    }

    const setFilesHandler = (files: FileList) => {
        const fileLingth = fileList.length;
        for (let i = 0; i < files.length; i++) {
            if (i < 6 - fileLingth) {
                const fileExt = files[i].name.split('.').pop();
                if (fileExt !== 'exe') {
                    setfileList(oldFileList => [...oldFileList, files[i]]);
                }
            }
        }
    }
    const removeFileHandler = (id: number) => {
        setfileList(oldFileList => oldFileList.filter((_, i) => i !== id));
    }

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void msgHandler();
        }
    }

    const textareaHandler = (value: string) => {
        setMsg(value);
        if (chat.isGroup) {
            if (value[value.length - 1] === '@') {
                setTagState(true);
            } else {
                if (tagState) {
                    setTagState(false);
                }
            }
        }
    }

    const tagHandler = (value: string) => {
        setTagState(false);
        setMsg(msg + value);
    }

    return (
        <div className='bg-[#f0f2f5] flex relative items-center h-auto justify-between px-12 p-2'>
            <div className="flex items-center">
                <IcoButton ref={ref} onClick={() => { pickerActive ? setPickerActive(false) : setPickerActive(true) }} icon={<BsEmojiSmile />} className='!px-3 !py-2 !text-gray-800 hover:!text-white' />
                <EmojiPicker button={ref.current} msg={msg} setMsg={setMsg} active={pickerActive} setActive={setPickerActive} />
                <UploadFile labelClass='!text-gray-800 hover:!text-white' accept='*' id='files-upload' multiple setFilesHandler={setFilesHandler} />
            </div>
            {audioRecord
                ?
                <AudioRecord />
                :
                <div className='w-full'>
                    {replyMsg &&
                        <div>
                            <ReplyMessage msg={replyMsg} />
                        </div>
                    }
                    {edMessage &&
                        <ReplyMessage msg={edMessage} />
                    }
                    {fileList.length > 0 &&
                        <FileList removeFileHandler={removeFileHandler} fileList={fileList} />
                    }
                    {tagState &&
                        <div className="flex flex-col items-start absolute top-0 -translate-y-full bg-gray-800 text-white">
                            {chat.isGroup &&
                                <>
                                    {chat.users?.map(user =>
                                        <button onClick={() => tagHandler(user.name)} className='px-3 py-2 hover:bg-gray-600'>{user.name}</button>
                                    )}
                                </>
                            }
                        </div>
                    }

                    <Textarea setFilesHandler={setFilesHandler} onKeyDownHandler={onKeyDownHandler} msg={msg} setMsg={textareaHandler} textfocus={true} />
                </div>
            }
            <div>
                {audioRecord &&
                    <>
                        <IcoButton className='!text-gray-800 hover:!text-white' onClick={() => void stopRecordHandler()} icon={<BsStopFill />} />
                        <IcoButton className='!text-gray-800 hover:!text-white' onClick={() => { audioMessageHandler() }} icon={<VscSend />} />
                    </>
                }
                {!audioRecord &&
                    <>
                        {(msg || fileList.length > 0)
                            ?
                            <IcoButton className='!text-gray-800 hover:!text-white' onClick={() => void msgHandler()} icon={<VscSend />} />
                            :
                            <IcoButton className='!text-gray-800 hover:!text-white' onClick={() => void recorderHandler()} icon={<BsMic />} />
                        }
                    </>
                }
            </div>
        </div>
    )
}

export default SendMessage;