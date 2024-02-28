import { FC } from 'react'
import { ITopMenu } from '../../../models/ITopMenu';
import MenuItem from './MenuItem';
import { useAppSelector } from '../../../hooks/redux';

interface TopMenuProps {
    menu?: ITopMenu[];
    className?: string;

}

const TopMenu: FC<TopMenuProps> = ({menu}) => {
    const {user} = useAppSelector(state=> state.UserSlice);
    return (
        <>  
            <div className='bg-[#2c2c2c] h-[90px] w-full flex py-5 px-10 relative justify-between'>
                {menu &&
                    menu.map(item=>
                        !item.dropdown &&
                        !item.scope
                        ?
                        <MenuItem key={item.id} item={item}/>
                        :
                        item.scope?.includes(user.role) &&
                        <MenuItem key={item.id} item={item}/>
                    )
                }
            </div>
        </>
        
    )
}

export default TopMenu;