import { FC } from 'react'

interface TitleProps {
    name: string;
}

const Title: FC<TitleProps> = ({name}) => {
    return (
        <div className='bg-gradient-title h-14 max-2xl:h-9 max-2xl:text-xl flex justify-center items-center text-[#6D5733] text-3xl rounded-full font-bold'>{name}</div>
    )
}

export default Title;