import { FC, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import OutlineButton from '../UI/OutlineButton';
import AddProgramThemeModal from '../Modals/AddProgramThemeModal';
import Theme from './Theme';
import { useParams } from 'react-router-dom';
import { Reorder } from "framer-motion"
import { setThemes } from '../../store/reducers/ProgramSlice';
import { ITheme } from '../../models/Program/ITheme';
import RemoveThemeModal from '../Modals/RemoveThemeModal';

const Themes: FC = () => {
    const { groupId } = useParams();
    const [modal, setModal] = useState<boolean>(false);
    const [modal2, setModal2] = useState<boolean>(false);
    const [modal3, setModal3] = useState<boolean>(false);
    const [theme, setTheme] = useState<ITheme | undefined>();
    const { themes } = useAppSelector(state=> state.ProgramSlice);
    const { user } = useAppSelector(state=> state.UserSlice);
    const [active, setActive] = useState<string>();
    const dispatch = useAppDispatch();
    const setThemesHandler = (e) => {
        dispatch(setThemes(e));
        
    }
    const editHandler = (theme: ITheme) => {
        setTheme(theme);
        setModal2(true);
    }

    const removeHandler = (theme: ITheme) => {
        setTheme(theme);
        setModal3(true);
    }

    return (
        <div className='flex flex-col w-full items-center max-2xl:items-start mr-28 max-2xl:mr-16 overflow-auto h-[calc(100vh-320px)]'>

            <Reorder.Group axis="y" values={themes} onReorder={setThemesHandler}>
            {themes.map((theme) => (
                <Theme editHandler={editHandler} removeHandler={removeHandler} active={active} setActive={setActive} key={theme._id} theme={theme}/>
            ))}
            </Reorder.Group>
            {((user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') && !groupId) &&
                <OutlineButton className='py-1 mt-4 !w-[400px] !text-base' onClick={()=> setModal(true)}>Добавить тему</OutlineButton>
            }
            <AddProgramThemeModal modal={modal} setModal={setModal}/>
            <AddProgramThemeModal modal={modal2} setModal={setModal2} theme={theme} edit={true}/>
            {theme &&
                <RemoveThemeModal modal={modal3} setModal={setModal3} theme={theme}/>
            }
        </div>
    )
}

export default Themes;