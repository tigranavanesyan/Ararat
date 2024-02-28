import { FC } from 'react'
import MainLogo from '../assets/MainLogo.png'
import GroupService from '../services/GroupService'

const IndexPage : FC = () => {
    
    return (
        <div className="w-full flex  items-center relative p-10">
            <ul className='self-start justify-self-start text-xl font-semibold max-2xl:text-xl leading-normal'>
                <li>Раздел дополнительные задачи - <span className='text-red-600'> до 01.02.2024</span></li>
                <li>Раздел лиги/турниры - <span className='text-red-600'> до 01.03.2024</span></li>
                <li>Перевод всего портала на армянском и<br/> на английском - <span className='text-red-600'> до 01.03.2024</span></li>
                <li>Мобильное приложение - <span className='text-red-600'> до 01.03.2024</span></li>
                <li>Сеансы - <span className='text-red-600'> до 01.04.2024</span></li>
                <li>Викторины по задачам - <span className='text-red-600'> до 01.04.2024</span></li>
            </ul>
            <img className='max-w-[500px] max-2xl:max-w-[300px] self-center left-1/2 -translate-x-1/2 absolute' src={MainLogo} alt="mainlogo" />
        </div>
    )
}

export default IndexPage;