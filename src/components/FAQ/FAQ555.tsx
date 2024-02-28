import { FC } from 'react'
import Item from './Item';
import { useAppSelector } from '../../hooks/redux';

const FAQ555: FC = () => {
    const { faq } = useAppSelector(state=> state.FaqSlice)
    return (
        <div className='h-full w-full flex flex-col items-center p-5 py-10 bg-[#f0f0f0] rounded-xl overflow-auto xl:max-h-[calc(100vh-130px)]'>
            <p className='text-red-500 mb-5 text-lg font-bold'>555Советы редактируются и идеализируются. Также будем добавлять новые разные темы до 03.01.2024.</p>
            {faq &&
                faq.map(item=>
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

export default FAQ555;