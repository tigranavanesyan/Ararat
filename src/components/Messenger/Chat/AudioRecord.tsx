import { FC } from 'react'
import { motion } from 'framer-motion';

const AudioRecord: FC = () => {
    return (
        <div className='flex items-center'>
            <motion.div 
                animate={{
                    scale: [1, 1.2, 1],
                }} 
                transition={{
                    duration: 2,
                    ease: "easeInOut",
                    times: [0, 0.5, 1],
                    repeat: Infinity,
                    repeatDelay: 0.2
                }}
                className="bg-red-500 mr-3 w-4 h-4 rounded-full">
            </motion.div>
            <p className='text-black text-base'>Voice Recording</p>
        </div>
    )
}

export default AudioRecord;