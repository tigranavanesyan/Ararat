import { FC } from 'react'
import TopMenu from '../components/UI/TopMenu/TopMenu';
import Balance from '../components/Balance/Balance';

const BalancePage: FC = () => {
    return (
        <div className='w-full'>
            <div className="p-5">
                <Balance />
            </div>
        </div>
    )
}

export default BalancePage;