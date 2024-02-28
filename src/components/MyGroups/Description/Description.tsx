import { FC } from 'react'
import MainButton from '../../UI/MainButton';
import { useAppSelector } from '../../../hooks/redux';

const Description: FC = () => {
    const { group } = useAppSelector(state=> state.GroupSlice)
    return (
        <div className='bg-[#f0f0f0] mx-5 -my-2 rounded-xl overflow-hidden'>
            <div>
                <div className='bg-[#dadada] p-4'>
                    <div className="flex justify-between mx-auto">
                        <MainButton className='w-full mr-10'>Название</MainButton>
                        <MainButton className='w-full mr-10'>Уровень</MainButton>
                        <MainButton className='w-full mr-10'>Описание</MainButton>
                    </div>
                </div>
                <div>
                    <div className='flex justify-between mx-auto p-4 items-start'>
                        <div className='border-2 py-3 border-[#c4c4c4] rounded-full flex justify-center items-center font-semibold bg-white w-full mr-10'>{group?.name}</div>
                        <p className='w-full mr-10 text-center'>{group?.level}</p>
                        <p className='w-full mr-10 text-center whitespace-break-spaces break-all'>{group?.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Description;