import { FC } from 'react'

interface AvatarProps {
    avatar?: string;
    className?: string;
}

const Avatar: FC<AvatarProps> = ({avatar, className}) => {
    return (
        <div className={['w-12 h-12 min-w-[48px] bg-black rounded-full', className].join(' ')}>
            <img className='w-[inherit] h-[inherit] rounded-full' src={avatar} alt="avatar"/>
        </div>
    )
}

export default Avatar;