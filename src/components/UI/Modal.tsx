import { FC, PropsWithChildren, useEffect, MouseEventHandler } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "@react-icons/all-files/io/IoMdClose";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

interface ModalProps {
    className?: string,
    active: boolean,
    setActive: (bool: boolean) => void,
    noclosable ?: boolean
    onClose?: () => void;
}

const Modal: FC<PropsWithChildren<ModalProps>> = ({className, children, active, setActive, noclosable, onClose, ...props}) => {
    
    useEffect(() => {
        active ? disableBodyScroll(document.body) : enableBodyScroll(document.body);
    }, [active])
    
    const stopProp: MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
    };
    
    const closeHandler = () => {
        setActive(false);
        onClose && onClose();
    }

    return (
        <AnimatePresence>
            {active &&
                <motion.div className='min-h-full overflow-y-auto fixed w-full h-full bg-black p-3 bg-opacity-80 left-0 top-0 flex justify-center items-center z-30' initial={{ opacity: 0 }} exit={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} onClick={() => !noclosable && closeHandler() }>
                    <motion.div className={['min-w-[320px] max-w-[500px] max-h-full overflow-y-auto w-full p-8 bg-white dark:bg-[#17212B] flex flex-col rounded-sm relative', className].join(' ')} initial={{ opacity: 0, scale: 0 }} exit={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} onClick={e=> stopProp(e)} {...props}>
                        {!noclosable &&
                            <IoMdClose className='absolute right-3 top-3 text-2xl cursor-pointer dark:text-white' onClick={() => !noclosable && closeHandler()}/>
                        }
                        {children}
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    )
}

export default Modal;