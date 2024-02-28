import { FC, useState, useEffect, useRef } from 'react'
import { JaaSMeeting } from '@jitsi/react-sdk';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { useParams } from 'react-router-dom';
import TestLessonService from '../../services/TestLessonService';
import Program from '../../components/TestLesson/Program/Program';
import Chat from '../../components/OnlineLesson/Chat/Chat';
import { IMaterial } from '../../models/Program/IMaterial';
import ChessBoard from '../../components/TestLesson/ChessBoard/ChessBoard';
import Game from '../../components/TestLesson/Game/Game';
import Theory from '../../components/OnlineLesson/Theory/Theory';
import { GroupChangeMaterialSocket, GroupEntryModeSocket, GroupFullCleanSocket, GroupUpdateSocket } from '../../sockets/GroupSockets';
import { socket } from '../../sockets/socket';
import { IMove } from '../../models/MyGroups/IMove';
import { getTestGroup } from '../../store/reducers/GroupSlice';
import { setMovesState } from '../../store/reducers/GroupSlice';
import AuthService from '../../services/AuthService';
import { Chess } from 'chess.js'

const Container:FC<{lesson: boolean; setApi: (api: unknown) => void,}> = ({ lesson, setApi }) => {
    const dispatch = useAppDispatch();
    const [rightPanelMode, setRightPanelMode] = useState<string>('none');
    const { groupId } = useParams();
    const [game, setGame] = useState(new Chess());
    const [moveMode, setmoveMode] = useState<boolean>(false);
    const [globalMode, setGlobalMode] = useState<boolean>(false);
    const [program, setProgram] = useState<IMaterial[]>([]);
    const [material, setMaterial] = useState<IMaterial>();
    const { user } = useAppSelector(state=> state.UserSlice);
    const { group } = useAppSelector(state=> state.GroupSlice);
    const [moves, setMoves] = useState<IMove[]>([]);
    const [clear, setClear] = useState<boolean>(false);
    const [recording, setRecording] = useState<boolean>(false);
    const api = useRef();
    const [jwt, setJwt] = useState<string>('');
    

    useEffect(() => {
        // if(user.role !== 'STUDENT') {
        //     setGlobalMode(true);
        // }
        const fetchData = async() => {
            if(groupId) {
                await dispatch(getTestGroup(groupId));
            }
        }
        void fetchData();
        
    }, [groupId])


    useEffect(() => {
        setmoveMode(group.moveMode);
    }, [group.moveMode])

    useEffect(() => {
        if(group.program) {
            setProgram(group.program);
            if(group.current) {
                const cond = group.program.findIndex(e=> e._id === group.current);
                if(cond !== -1) {
                    setMaterial(group.program[cond]);
                } else {
                    setMaterial(group.program[0]);
                }
            }
            
        }
    }, [group.program])

    useEffect(() => {
        const reciveMoveHandler = (data: {user_id: string, color: string, move: string}) => {
            dispatch(setMovesState(data));
        }
        socket.on("group:recive_change_material", (data: IMaterial) => {
            setMaterial(data);
        })
        socket.on("group:recive_make_move", reciveMoveHandler)
        socket.on("group:recive_entry_mode", (data: boolean) => {
            setmoveMode(data);
        })
        socket.on("group:recive_update", async (data: string) => {
            await dispatch(getTestGroup(data));
        })
        socket.on("group:recive_global_mode", (data: {user_id: string, bool: boolean}) => {
            if(user._id === data.user_id) {
                setGlobalMode(data.bool);
            }
        })
        
        return  () => {
            socket.off("group:recive_make_move", reciveMoveHandler);
        }
    }, [])
    
    

    const moveModeHandler = async () => {
        setmoveMode(moveMode ? false : true);
        groupId && GroupEntryModeSocket({room: groupId, bool: moveMode ? false : true});
        groupId && await TestLessonService.editGroup(groupId, {moveMode: moveMode ? false : true});
    }

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

    const clearProgramHandler = async () => {
        if(groupId) {
            await TestLessonService.editGroup(groupId, {program: []} );
            await dispatch(getTestGroup(groupId));
            GroupUpdateSocket({room: groupId});
        }
    }
    

    return (
        <div className=''>
            <div className="flex m-5 mb-2 max-2xl:m-0 rounded-full z-20">
            </div>
            <div className="flex p-0"> 
            </div>
            <div className="flex justify-between mx-5 h-[calc(100vh-240px)] max-2xl:h-[calc(100vh-170px)]">
                <div className="flex flex-col h-full justify-between w-full max-w-[450px] max-2xl:max-w-[330px]">
                    <Program active={material?._id} setMaterial={setMaterial} program={program}/>
                    {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANER' || user.role === 'TRANERMETODIST') &&
                        <button className='basis-[55%] w-full bg-gradient-button rounded-full my-4 max-h-[50px] text-lg font-semibold py-2 max-2xl:text-sm' onClick={()=> void clearProgramHandler()}>Очистить главы</button>
                    }
                    <Chat />
                </div>
                <div className="mx-0 flex flex-col items-center w-full h-[calc(100vh-400px)] max-2xl:h-[calc(100vh-200px)] text-center">
                    {material?.data.tags.FEN
                    ?
                        <ChessBoard game={game} setGame={setGame} custom={material?.custom} type={material?.type} moveMode={moveMode} globalMode={globalMode} clear={clear} setClear={setClear} movesM={moves} setMoves={setMoves} PrevBackTheme={PrevBackTheme} materialId={material?._id} position={material?.data.tags.FEN}/>
                    :
                        <ChessBoard game={game} setGame={setGame} custom={material?.custom} type={material?.type} moveMode={moveMode} globalMode={globalMode} clear={clear} setClear={setClear} movesM={moves} setMoves={setMoves} PrevBackTheme={PrevBackTheme} materialId={material?._id} position={'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'}/>
                    }
                    
                </div>
                <div className="flex flex-col h-full justify-between w-full max-w-[600px] max-2xl:max-w-[430px]">
                    {material &&
                        <Theory rightPanelMode={rightPanelMode} setRightPanelMode={setRightPanelMode} theory={material}/>
                    }
                    {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANER' || user.role === 'TRANERMETODIST') &&
                        <div className="w-full flex justify-between">
                            <button className='basis-[45%] mr-3 bg-gradient-button rounded-full my-1 text-lg font-semibold py-2 max-2xl:text-sm' onClick={()=> moveModeHandler()}>{moveMode ? 'Выключить режим ходов' : 'Включить режим ходов'}</button>
                            <button className='basis-[55%] w-full bg-gradient-button rounded-full my-1 text-lg font-semibold py-2 max-2xl:text-sm' onClick={()=> {setClear(true), groupId && GroupFullCleanSocket({room: groupId})}}>Очистить варианты учеников</button>
                        </div>
                    }
                    <Game cgame={game} setGame={setGame} position={material?.data.tags.FEN} moveMode={moveMode} rightPanelMode={rightPanelMode} setRightPanelMode={setRightPanelMode} moves={moves} />
                </div>
            </div>
            
        </div>
    )
}

export default Container;