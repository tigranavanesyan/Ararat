import { FC, useRef, useEffect } from 'react'
import  Picker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { EmojiClickData } from 'emoji-picker-react';
import { clickOuter } from '../../utils/clickOuter';

interface EmojiPickerProps {
    msg: string;
    setMsg: (val: string) => void;
    active: boolean;
    setActive: (bool: boolean) => void;
    button: HTMLButtonElement | null;
}

const EmojiPicker: FC<EmojiPickerProps> = ({msg, setMsg, active, setActive, button}) => {
    
    const onEmojiClick = (emojiObject: EmojiClickData ) => {
        setMsg(msg + emojiObject.emoji)
    }
    const pickerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if(pickerRef.current && button) {
            return clickOuter(pickerRef.current, ()=>setActive(false), button);
        }
    }, [active, setActive, button]);
    return (
        <>
            {active &&
                <div ref={pickerRef} className="absolute bottom-16">
                    <Picker theme={Theme.DARK}  emojiStyle={EmojiStyle.NATIVE} onEmojiClick={onEmojiClick} skinTonesDisabled={true}/>
                </div>
            }
        </>
    )
}

export default EmojiPicker;