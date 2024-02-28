import { FC } from 'react'

interface DateProps {
    data: string;
}

const Data: FC<DateProps> = ({data}) => {
    return (
        <div className='flex justify-center mb-5'>
            <div className="bg-white shadow-md rounded-md text-sm p-2">{data}</div>
        </div>
    )
}

export default Data;