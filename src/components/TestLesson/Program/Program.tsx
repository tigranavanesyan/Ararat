import { FC } from 'react'
import Title from '../../UI/Title';
import { IMaterial } from '../../../models/Program/IMaterial';
import Item from './Item';
import { GroupChangeMaterialSocket } from '../../../sockets/GroupSockets';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux';

interface ProgramProps {
    program: IMaterial[];
    setMaterial: (material: IMaterial) => void;
    setMaterialName?: (name: string) => void;
    active?: string;
    homework?: boolean;
}

const Program: FC<ProgramProps> = ({program, setMaterial, setMaterialName, active, homework}) => {
    const {groupId} = useParams();
    const { user } = useAppSelector(state => state.UserSlice);
    const setMaterialHandler = (item: IMaterial) => {
        if(!homework) {
            if((user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANER' || user.role === 'TRANERMETODIST') && groupId) {
                setMaterial(item);
                GroupChangeMaterialSocket({room: groupId, material: item});
            }
        } else {
            setMaterial(item);
            if(setMaterialName) {
                setMaterialName(item.theme_id.name);
            }
        }
    }
    return (
        <div className='flex flex-col'>
            <Title name='Глава'/>
            <div className="border-2 border-[#CCC] -mt-6 pt-6 rounded-b-2xl border-t-0">
                <div className={["flex flex-col overflow-auto", homework ? 'h-[calc(100vh-300px)]': 'max-h-[250px] max-2xl:max-h-[150px]'].join(' ')}>
                    {program.length > 0 &&
                        program.map((item, id)=>
                            <>
                                <Item active={active} onClick={()=> setMaterialHandler(item)} key={item._id} id={item._id} type={item.type} number={id + 1}/>
                                <div className="">{}</div>
                            </>     
                        )
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default Program;