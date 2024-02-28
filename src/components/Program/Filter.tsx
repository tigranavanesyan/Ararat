import { FC, useState, useEffect } from 'react'
import OutlineButton from '../UI/OutlineButton';
import { useAppDispatch } from '../../hooks/redux';
import { getThemes } from '../../store/reducers/ProgramSlice';

const Filter: FC = () => {
    const dispatch = useAppDispatch();
    const [levels] = useState<Array<{ id: number, level: number }>>([
        { id: 0, level: 1, },
        { id: 1, level: 2, },
        { id: 2, level: 3, },
        { id: 3, level: 4, },
        { id: 4, level: 5, },
        { id: 5, level: 6, },
        { id: 6, level: 7, },
        { id: 7, level: 8, },
        { id: 8, level: 9, },
        { id: 9, level: 10, },
    ]);
    const [strategies] = useState<Array<{ id: number, name: string, slug: string, dark?: boolean }>>([
        { id: 0, name: 'Эндшпиль', slug: 'endshpil' },
        { id: 1, name: 'Миттельшпиль', slug: 'mittelshpil' },
        { id: 2, name: 'Стратегия', slug: 'strategy' },
        { id: 3, name: 'Дебют', slug: 'debut' },
        { id: 4, name: 'Тактика', slug: 'tactic' },
        { id: 5, name: 'Сбросить фильтр', slug: '', dark: true },
    ]);
    const [data, setData] = useState<{ strategy: string, level: number | null }>({
        strategy: '',
        level: null
    })
    const [loaded, setLoaded] = useState(false);
    const [countEndshpil, setCountEndshpil] = useState(0)
    const [countMittelshpil, setCountMittelshpil] = useState(0)
    const [countStrategy, setCountStrategy] = useState(0)
    const [countDebut, setCountDebut] = useState(0)
    const [countTactic, setCountTactic] = useState(0)

    const initThemeCount = async () => {
        const theme_data = await dispatch(getThemes({ filter: data.strategy, level: data.level }))
        let theme_payload: Array<any> = theme_data['payload'];
        const filter_endshpil = theme_payload.filter(index => index.filter === "endshpil")
        setCountEndshpil(filter_endshpil.length)
        const filter_mittelshpil = theme_payload.filter(index => index.filter === "mittelshpil")
        setCountMittelshpil(filter_mittelshpil.length)
        const filter_strategy = theme_payload.filter(index => index.filter === "strategy")
        setCountStrategy(filter_strategy.length)
        const filter_debut = theme_payload.filter(index => index.filter === "debut")
        setCountDebut(filter_debut.length)
        const filter_tactic = theme_payload.filter(index => index.filter === "tactic")
        setCountTactic(filter_tactic.length)
        setLoaded(true)
    }

    useEffect(() => {
        initThemeCount();
    }, [loaded])

    useEffect(() => {
        if (data.strategy || data.level || data.level === 0) {
            const fetchData = async () => {
                await dispatch(getThemes({ filter: data.strategy, level: data.level }))
            }
            void fetchData()
        }

    }, [data, dispatch])

    return (
        <div className='bg-gradient-button flex rounded-3xl justify-between items-center px-3 py-2'>
            <div className="flex flex-wrap w-[320px] max-2xl:w-[220px]">
                {levels.map(level =>
                    <OutlineButton onClick={() => setData({ ...data, level: level.level })} key={level.id} className={['mb-2 mr-2 max-2xl:mr-1 max-2xl:mb-1 !h-12 !w-12 max-2xl:!w-10 max-2xl:!h-10 max-2xl:text-base !p-0 !rounded-full', data.level === level.level ? 'border-apricot' : null].join(' ')}>{level.level}</OutlineButton>
                )}
            </div>
            <div className="flex flex-wrap justify-end max-w-[760px] max-2xl:max-w-[630px]">
                {strategies.map(strategie =>
                    <OutlineButton
                        dark={strategie.dark}
                        onClick={
                            () => setData(strategie.id === 5 ? { level: 0, strategy: strategie.slug } : { ...data, strategy: strategie.slug })}
                        key={strategie.id}
                        className={['mb-2 gap-x-2 !rounded-full mr-3 max-w-[240px] max-2xl:text-base max-2xl:max-w-[190px] !py-2', data.strategy === strategie.slug ? 'border-apricot' : null].join(' ')}>
                        {strategie.name}  
                        {strategie.slug === 'endshpil' && <p className='text-blue-700 font-bold'>{countEndshpil}</p>}
                        {strategie.slug === 'mittelshpil' && <p className='text-blue-700 font-bold'>{countMittelshpil}</p>}
                        {strategie.slug === 'strategy' && <p className='text-blue-700 font-bold'>{countStrategy}</p>}
                        {strategie.slug === 'debut' && <p className='text-blue-700 font-bold'>{countDebut}</p>}
                        {strategie.slug === 'tactic' && <p className='text-blue-700 font-bold'>{countTactic}</p>}
                    </OutlineButton>
                )}
            </div>
        </div>
    )
}

export default Filter;