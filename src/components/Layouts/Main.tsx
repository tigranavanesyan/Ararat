import { FC, PropsWithChildren } from 'react'
import Sidebar from '../../components/Index/Sidebar/Sidebar';

interface LayoutMainProps {
    closedmenu?: boolean;
}

const LayoutMain: FC<PropsWithChildren<LayoutMainProps>> = ({children, closedmenu}) => {
    return (
        <main className='flex h-screen'>
            <Sidebar closedmenu={closedmenu}/>
            {children}
        </main>
    )
}

export default LayoutMain;