import { FC, useRef, FormEvent, useEffect } from 'react'
import { useAppSelector } from '../../../hooks/redux';

interface TextareaProps {
    msg: string;
    setMsg: (msg: string) => void,
    onKeyDownHandler: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void,
    setFilesHandler: (files: FileList) => void,
}

const Textarea: FC<TextareaProps> = ({msg, setMsg, onKeyDownHandler, setFilesHandler}) => {
    const ref = useRef<HTMLTextAreaElement>(null);
    const { chat, reply, editMsg } = useAppSelector(state=> state.MessengerSlice)
    const { user } = useAppSelector(state=> state.UserSlice)
    const textAreaHandler = (e: FormEvent) => {
        const target = e.target as HTMLInputElement;
        setMsg(target.value);
        if(ref.current) {
            ref.current.style.height = "25px";
            ref.current.style.height = ref.current.scrollHeight.toString()+"px";
        }   
    }

    useEffect(() => {
        if(editMsg) {
            if(ref.current) {
                ref.current.focus();
            }
        }
    }, [editMsg])
    

    const onPasteHandler = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        if(e.clipboardData) {
            const items = e.clipboardData.items;
            const dt = new DataTransfer(); 
            if(items[0] && items[0].type.indexOf("image") !== -1) {
                const blob = items[0].getAsFile();
                if(blob) {
                    dt.items.add(blob);
                    setFilesHandler(dt.files);
                }
            }
        }
        
        setMsg(target.value);
        if(ref.current) {
            ref.current.style.height = "25px";
            ref.current.style.height = ref.current.scrollHeight.toString()+"px";
        }   
    }

    return (
        <>
            {chat.isTech && !reply && (user.role !== 'STUDENT' && user.role !== 'TRANER')
            ?
                <div>Для того чтобы написать ответ, выберите пользователя для ответа</div>
            :
                chat.isChanel && (user.role !== 'DIRECTOR' && user.role !== 'ZDIRECTOR')
                ?
                <div>Вы не можете писать в этом чате</div>
                :
                <textarea id="textReply" onPaste={e=> onPasteHandler(e)} onKeyDown={e=> onKeyDownHandler(e)} ref={ref} value={msg} placeholder='Введите сообщение...' onInput={e=> textAreaHandler(e)} className='px-5 py-2 w-full rounded-lg shadow-sm text-[15px] resize-none custom-scroll focus:outline-none bg-white text-black h-[40px] max-h-[80px]'></textarea>
            }
        </>
    )
}

export default Textarea;