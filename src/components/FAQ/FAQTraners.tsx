import { FC } from 'react'
import Item from './Item';
import { useAppSelector } from '../../hooks/redux';

const FAQTraners: FC = () => {
    const { faqtrainers } = useAppSelector(state=> state.FaqSlice)
    return (
        <div className='w-full flex flex-col items-center p-5 py-10 bg-[#f0f0f0] rounded-xl overflow-auto max-h-[calc(100vh-130px)]'>
            <p className='text-red-500 mb-5 text-lg font-bold'>Советы будут тут по блокам до 10.11.2023</p>
            {faqtrainers &&
                faqtrainers.map(item=>
                    <Item key={item._id} item={item}></Item>    
                )
            }
            <ul className='self-start justify-self-start text-xl mt-10 font-semibold max-2xl:text-lg leading-normal'>
                <li>Раздел дополнительные задачи - до 01.12.2023</li>
                <li>Раздел лиги/турниры - до 01.12.2023</li>
                <li>Перевод всего портала на армянском и на английском - до 01.01.2024</li>
                <li>Мобильное приложение - до 01.01.2024</li>
                <li>Сеансы - до 01.02.2024</li>
                <li>Викторины по задачам - до 01.03.2024</li>
            </ul>
        </div>
    )
}

export default FAQTraners;