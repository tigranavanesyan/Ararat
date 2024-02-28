import { FC, useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { useParams, useNavigate } from 'react-router-dom';
import GroupService from '../../services/GroupService';
import Program from './Program/Program';
import Chat from '../OnlineLesson/Chat/Chat';
import { IMaterial } from '../../models/Program/IMaterial';
import ChessBoard from '../Homework/ChessBoard'
import Game from './Game/Game';
import Theory from '../OnlineLesson/Theory/Theory';
import { GroupChangeMaterialSocket, GroupEntryModeSocket, GroupFullCleanSocket } from '../../sockets/GroupSockets';
import { socket } from '../../sockets/socket';
import { IMove } from '../../models/MyGroups/IMove';
import { getGroup } from '../../store/reducers/GroupSlice';
import { setMovesState } from '../../store/reducers/GroupSlice';
import { getHomework } from '../../store/reducers/HomeworkSlice';
import format from 'date-fns/format';
import HomeworkService from '../../services/HomeworkService';
import SuccessModal from '../Modals/SuccessModal';
import MainButton from '../UI/MainButton';
import { Chess } from 'chess.js'
import Modal from '../UI/Modal';
import { useHomework } from '../../utils/useHomework';

const Container:FC<{lesson: boolean}> = ({ lesson }) => {
    const dispatch = useAppDispatch();
    const [rightPanelMode, setRightPanelMode] = useState<string>('none');
    const { groupId } = useParams();
    const [game, setGame] = useState(new Chess());
    const navigate = useNavigate();
    const [modal, setModal] = useState<boolean>(false);
    const [modal2, setModal2] = useState<boolean>(false);
    const [modal3, setModal3] = useState<boolean>(false);
    const [moveMode, setmoveMode] = useState<boolean>(false);
    const [globalMode, setGlobalMode] = useState<boolean>(false);
    const [program, setProgram] = useState<IMaterial[]>([]);
    const [material, setMaterial] = useState<IMaterial>();
    const [materialName, setMaterialName] = useState<string>('');
    const { user } = useAppSelector(state=> state.UserSlice);
    const { homework } = useAppSelector(state=> state.HomeworkSlice);
    const [moves, setMoves] = useState<IMove[]>([]);
    const [clear, setClear] = useState<boolean>(false);
    const {analis} = useHomework(()=> {setModal3(false); setModal(true)}, homework?.group_id?._id, groupId);

    useEffect(() => {
        if(user.role !== 'STUDENT') {
            setGlobalMode(true);
        }
        const fetchData = async() => {
            if(groupId) {
                await dispatch(getHomework(groupId));
            }
        }
        void fetchData();
        
    }, [groupId])

    useEffect(() => {
        if(homework.program) {
            setProgram(homework.program);
            setMaterial(homework.program[0]);
            setMaterialName(homework.program[0]?.theme_id.name);
        }
    }, [homework.program])
    
    const PrevBackTheme = (bool: boolean) => {
        const index = program.findIndex(item=> item._id === material?._id);
        if(groupId) {
            if(bool) {
                if(program[index+1]) {
                    setMaterial(program[index+1]);
                    GroupChangeMaterialSocket({room: groupId, material: program[index+1]});
                }
            } else {
                if(program[index-1]) {
                    setMaterial(program[index-1]);
                    GroupChangeMaterialSocket({room: groupId, material: program[index-1]});
                }
            }
        }
    }

    const sendHandler = async () => {
        if(groupId) {
            if(homework.autocheck) {
                await HomeworkService.getHomework(groupId)
                .then(
                    async (res)=> {
                        const tasks: { material: string | undefined; fen: string; moves: string[]; }[] = [];
                        res.data.homework.history.map(item=> {
                            const fen = res.data.homework.program.find(itm=> itm._id === item.material)?.data.tags.FEN ?? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
                            const movesSan:string[] = [];
                            const moves = item.moves.find(itm=> itm.user_id === user._id)?.moves ?? [];
                            if(moves.length > 0) {
                                moves.map(mv=> {
                                    movesSan.push(mv.move);
                                })
                            }
                            if(movesSan.length > 0) {
                                tasks.push({material: item.material, fen: fen, moves: movesSan})
                            }
                            
                        })
                        if(tasks.length > 0) {
                            setModal2(false);
                            setModal3(true);
                            analis(tasks);
                        } else {
                            await HomeworkService.sendHomework(homework.group_id._id, groupId).then(()=> {setModal2(false); setModal(true)});
                        }
                        
                    }
                )
            } else {
                await HomeworkService.sendHomework(homework.group_id._id, groupId).then(()=> {setModal2(false); setModal(true)});
            }
            
        }
    }

    return (
        <>
            <div className="flex m-5 mb-2 rounded-full z-20">
                <div className="bg-gradient-button flex px-10 items-center w-full h-[108px] rounded-3xl justify-between">
                    {program &&
                        <div>
                            <p className='text-3xl font-bold mb-2'>Домашнее задание:</p>
                            <p className='text-2xl font-bold'>{materialName}</p>
                        </div>
                        
                    }
                    
                    {homework?.end &&
                        <div className="bg-gradient-top-menu px-10 py-5 items-center font-bold text-lg flex flex-col rounded-2xl text-white">
                            <span>Срок до:</span>
                            {format(new Date(homework.end), 'd MMM')}
                        </div>
                    }
                </div>
            </div>
            <div className="flex p-0"> 
            </div>
            <div className="flex justify-between mx-5 h-[calc(100vh-240px)]">
                <div className="flex flex-col h-full justify-between w-full max-w-[450px]">
                    <Program homework={true} active={material?._id} setMaterial={setMaterial} setMaterialName={setMaterialName} program={program}/>
                    <button onClick={()=> setModal2(true)} className='basis-[45%] mr-3 bg-gradient-button rounded-full my-1 text-lg font-semibold py-2'>Отправить дз на проверку</button>
                </div>
                <div className="mx-0 flex flex-col items-center w-full h-[calc(100vh-400px)] text-center">
                    <ChessBoard game={game} setGame={setGame} movesM={moves} setMoves={setMoves} PrevBackTheme={PrevBackTheme} materialId={material?._id} position={material?.data.tags.FEN ? material?.data.tags.FEN : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'}/>
                </div>
                <div className="flex flex-col h-full justify-between w-full max-w-[600px]">
                    <Game materialId={material?._id} cgame={game} setGame={setGame} position={material?.data.tags.FEN} rightPanelMode={rightPanelMode} setRightPanelMode={setRightPanelMode} moves={moves} />
                </div>
                <SuccessModal noclosable={true} modal={modal} setModal={setModal} message='Дз успешно отправленно на проверку'>
                    <MainButton className='mt-5' onClick={()=> navigate('/')}>Вернутся на главную</MainButton>
                </SuccessModal>
                <Modal active={modal2} setActive={setModal2} className='max-w-[520px]'>
                    <h1 className='text-2xl font-bold mb-5 text-center'>Ты решил все задачи? Проверил и перепроверил свои ответы?</h1>
                    <div className="flex">
                        <MainButton onClick={()=> void sendHandler()} className='mr-5 !bg-gradient-button-green'>Да, отправить ответы на проверку</MainButton>
                        <MainButton onClick={()=> setModal2(false)}>Отмена, вернутся к заданиям</MainButton>
                    </div>
                </Modal>
                
                <Modal noclosable={true} active={modal3} setActive={setModal3} className='max-w-[520px]'>
                    <h1 className='text-2xl font-bold mb-5 text-center'>Идет отправка дз, не закрывайте вкладку до завершения процесса.</h1>
                </Modal>
            </div>
        </>
    )
}

export default Container;