import { FC, useState } from 'react'
import { ITheme } from '../../models/Program/ITheme'
import Folder from '../../assets/icons/folder.png'
import FolderGreen from '../../assets/icons/folder-green.png'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { getMaterials, setSeq } from '../../store/reducers/ProgramSlice'
import { setTheme } from '../../store/reducers/ProgramSlice'
import { Reorder, useDragControls } from "framer-motion"
import { Menu } from '@headlessui/react'
import { IoIosArrowDown } from '@react-icons/all-files/io/IoIosArrowDown'
import ProgramService from '../../services/ProgramService'

interface ThemeProps {
    theme: ITheme;
    active: string,
    setActive: (value: string) => void;
    editHandler: (theme: ITheme) => void;
    removeHandler: (theme: ITheme) => void;
}

const Theme: FC<ThemeProps> = ({theme, active, setActive, editHandler, removeHandler}) => {
    const dispatch = useAppDispatch();
    const controls = useDragControls()
    const { user } = useAppSelector(state=> state.UserSlice)
    const { themes } = useAppSelector(state=> state.ProgramSlice)

    const fetchMaterials = async () => {
        setActive(theme._id);
        dispatch(setTheme(theme._id));
        await dispatch(getMaterials(theme._id));
    }

    const DragEndHandler = async (id: string, oldseq: number) => {
        const seq = themes.findIndex(theme=> theme._id === id);
        dispatch(setSeq({oldseq, seq}))
        await ProgramService.editTheme(id, undefined, {oldseq, seq});
    }

    return (
        <Reorder.Item dragListener={false} dragControls={(user.role ==='DIRECTOR' || user.role === 'ZDIRECTOR') ? controls : undefined} key={theme._id} value={theme} onDragEnd={() => void DragEndHandler(theme._id, theme.seq)}>
            <button className='flex items-center w-full max-2xl:max-w-[400px] mb-2 relative [&>.arr-menu]:hover:block'>
                <div onPointerDown={(e) => controls.start(e)} className="mr-2"><img className='pointer-events-none' src={active === theme._id ? FolderGreen : Folder} alt="folder"/></div>
                <p onClick={()=> void fetchMaterials()} className={['w-full rounded-full py-2 flex items-center justify-center font-bold text-sm border-2 ', active === theme._id ? 'bg-[#1EA413] border-[#1EA413] text-white' : 'border-[#C4C4C4] bg-white text-[#353535]'].join(' ')}>{theme.name}</p>
                <Menu as='div' className='absolute right-2 top-1/2 z-10 -translate-y-1/2 arr-menu hidden'>
                    <Menu.Button as='button' className='text-gray-800 text-xl'><IoIosArrowDown/></Menu.Button>
                    <Menu.Items as='div' className='absolute right-0 border bg-white w-[180px] rounded-2xl flex flex-col border-[#B7975A] overflow-hidden'>
                        {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') &&
                            <>
                                <Menu.Item as='button' onClick={()=> editHandler(theme)} className='border-b border-[#B7975A] py-1 font-medium hover:bg-[#B7975A] hover:text-white'>
                                    Change studio
                                </Menu.Item>
                                <Menu.Item as='button' onClick={()=> removeHandler(theme)} className='border-b border-[#B7975A] py-1 font-medium hover:bg-[#B7975A] hover:text-white'>
                                    Delete studio
                                </Menu.Item>
                            </>
                        }
                        <Menu.Item as='button' className='py-1 font-medium hover:bg-[#B7975A] hover:text-white'>
                            Comments
                        </Menu.Item>
                    </Menu.Items>
                </Menu>
            </button>
        </Reorder.Item>
    )
}

export default Theme;