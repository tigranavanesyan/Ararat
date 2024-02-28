import { FC } from 'react'
import { ITopMenu } from '../../../models/ITopMenu';
import MenuItemPermissions from './MenuItemPermissions';
import Input from '../Main/Input';
import debounce from "lodash.debounce";
import { useAppSelector } from '../../../hooks/redux';

interface TopMenuPermissionsProps {
    menu?: ITopMenu[];
    fetchData: (role: string, search?: string, archive?: boolean) => void;
}

const TopMenuPermissions: FC<TopMenuPermissionsProps> = ({menu, fetchData}) => {  
    const {user} = useAppSelector(state=> state.UserSlice);
    const SearchDebounce = debounce((e: string)=>{
        fetchData('', e);
    }, 1000)

    return (
        <>
            <div className='bg-[#2c2c2c] h-[90px] w-full flex py-5 px-10 relative justify-between'>
                {menu &&
                    menu.map(item=>
                        !item.scope
                        ?
                        <>
                            {item.name === 'Archive'
                            ?
                            <MenuItemPermissions onClick={()=> fetchData('', undefined, true)} key={item.id} item={item}/>
                            :
                            <MenuItemPermissions onClick={()=> fetchData(item.path ? item.path : '')} key={item.id} item={item}/>
                            }
                        </>
                        :
                        item.scope.includes(user.role) &&
                        <MenuItemPermissions onClick={()=> fetchData(item.path ? item.path : '')} key={item.id} item={item}/>
                    )
                }
                <Input onChange={e=> void SearchDebounce(e.target.value)} type='text' placeholder='Search...' />
            </div>
        </>
        
    )
}

export default TopMenuPermissions;