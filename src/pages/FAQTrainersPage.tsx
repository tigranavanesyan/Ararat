import { FC } from 'react'
import TopMenu from '../components/UI/TopMenu/TopMenu';
import FAQTraners from '../components/FAQ/FAQTraners';

const FAQTrainersPage: FC = () => {
    return (
        <div className='w-full'>
            <TopMenu/>
            <div className="p-5">
                <FAQTraners />
            </div>
        </div>
    )
}

export default FAQTrainersPage;