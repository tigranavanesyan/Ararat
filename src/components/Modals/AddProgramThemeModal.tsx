import { FC, useState, useEffect } from 'react'
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { ServerError } from '../../models/response/ServerError';
import AuthErrorModal from './AuthError';
import ProgramService from '../../services/ProgramService';
import { AxiosError } from 'axios';
import { Listbox } from '@headlessui/react'
import { LevelValidation } from '../../utils/ValidationRules';
import { useAppDispatch } from '../../hooks/redux';
import { createTheme } from '../../store/reducers/ProgramSlice';
import { ITheme } from '../../models/Program/ITheme';
import { editTheme } from '../../store/reducers/ProgramSlice';

interface AddProgramThemeModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
    edit?: boolean,
    theme?: ITheme,
}

interface Filter {
    id: number,
    name: string,
    slug: string
}

type Form = {
    name: string,
    select: Filter,
    level: number,
};

const AddProgramThemeModal: FC<AddProgramThemeModalProps> = ({ modal, setModal, edit, theme }) => {
    const dispatch = useAppDispatch();
    const [modalError, setModalError] = useState<string>('');
    const [eModal, setEModal] = useState<boolean>(false);
    const [filter] = useState<Filter[]>([
        { id: 1, name: 'Эндшпиль', slug: 'endshpil' },
        { id: 2, name: 'Миттельшпиль', slug: 'mittelshpil' },
        { id: 3, name: 'Стратегия', slug: 'strategy' },
        { id: 4, name: 'Дебьют', slug: 'debut' },
        { id: 5, name: 'Тактика', slug: 'tactic' },
    ]);
    const { control, register, setValue, handleSubmit, formState: {errors} } = useForm<Form>({defaultValues: {select: filter[0]}});
    const [selectedFilter, setSelectedFilter] = useState(filter[0]);
    const onSubmit: SubmitHandler<Form> = async (data, e) => {
        e?.preventDefault();
        if(!edit) {
            await dispatch(createTheme({name: data.name, filter: data.select.slug, level: data.level})).then(()=> setModal(false)).catch((e: AxiosError)=> {
                const event = e.response?.data as ServerError;
                setModalError(event.error)
                setEModal(true);
            });
        } else {
            if(theme) {
                const response = await dispatch(editTheme({themeId: theme._id, name: data.name, filter: data.select.slug, level: data.level}));
                const res = response.payload as ServerError;
                if(res?.error) {
                    setEModal(true);
                    setModalError(res.error)
                } else {
                    setModal(false);
                }
            }
        }
    }
    useEffect(() => {
        if(edit) {
            if(theme) {
                setValue('name', theme.name);
                setValue('level', theme.level);
                const indx = filter.findIndex(item=> item.slug === theme.filter);
                setValue('select', filter[indx]);
                setSelectedFilter(filter[indx]);
            }
        }
    }, [theme])
    
    return (
        <>
            <Modal active={modal} setActive={setModal} className='items-center'>
                <h1 className='text-2xl font-semibold tracking-wider text-gray-800 capitalize '>{edit ? 'Edit theme' : 'Create new theme'}</h1>
                <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className='bg-white container mx-auto flex flex-col px-10 py-5 max-w-2xl'>
                    <Input wrapperClasses='mb-5' type="text" label='Theme name:' placeholder='Theme name' error={errors.name?.message} register={register('name', { required: "The field must be filled" })}/>
                    <Controller
                        name="select"
                        control={control}
                        render={({ field: { onChange } }) =>
                            <div>
                                <label className='block text-sm text-gray-600 mb-2' htmlFor='selectFilter'>Filter</label>
                                <Listbox id='selectFilter' className='mb-5 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-apricot focus:ring-apricot focus:outline-none focus:ring focus:ring-opacity-40' as="div" value={selectedFilter} 
                                    onChange={(e) => {
                                        onChange(e);
                                        setSelectedFilter(e);
                                    }}
                                >
                                    <Listbox.Button className='p-3'>{selectedFilter.name}</Listbox.Button>
                                    <Listbox.Options className='border-t-2 border-t-apricot'>
                                        {filter.map((filter) => (
                                        <Listbox.Option
                                            className='cursor-pointer px-3 py-2 hover:bg-apricot'
                                            key={filter.id}
                                            value={filter}
                                        >
                                            {filter.name}
                                        </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Listbox>
                            </div>
                        }
                    />
                    <Input wrapperClasses='mb-5' type="number" label='Level:' placeholder='Level' error={errors.level?.message} register={register('level', LevelValidation)}/>
                    <Button>{edit ? 'Edit Theme' : 'Create Theme'}</Button>
                </form>
            </Modal>
            <AuthErrorModal modal={eModal} setModal={setEModal} error={modalError}/>
        </>
    )
}

export default AddProgramThemeModal;