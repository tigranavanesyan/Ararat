import { FC, useRef, useState, useEffect, useMemo, forwardRef } from 'react'
import { Chessboard } from "react-chessboard";
import { CustomPieceFnArgs, Square } from 'react-chessboard/dist/chessboard/types';
import Engine from '../../../utils/engine';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import GroupService from '../../../services/GroupService';
import { useParams } from 'react-router-dom';
import { GroupChangeGameSocket, GroupMakeMoveSocket, GroupMakeMoveBackSocket, GroupAddGameUserSocket, GroupStepBackSocket, GroupStepNextSocket } from '../../../sockets/GroupSockets';
import { editUserNameAuth } from '../../../store/reducers/UserSlice';
import {AiFillFastBackward} from '@react-icons/all-files/ai/AiFillFastBackward';
import {AiFillStepBackward} from '@react-icons/all-files/ai/AiFillStepBackward';
import {AiFillStepForward} from '@react-icons/all-files/ai/AiFillStepForward';
import {AiFillFastForward} from '@react-icons/all-files/ai/AiFillFastForward';
import {AiOutlineCloseCircle} from '@react-icons/all-files/ai/AiOutlineCloseCircle'
import {CgArrowsExchangeAltV} from '@react-icons/all-files/cg/CgArrowsExchangeAltV'
import {FaFastBackward} from '@react-icons/all-files/fa/FaFastBackward' 
import {FaFastForward} from '@react-icons/all-files/fa/FaFastForward' 
import { editTestGroup } from '../../../store/reducers/GroupSlice';
import TestLessonService from '../../../services/TestLessonService';
import { socket } from '../../../sockets/socket';
import { pushGame } from '../../../store/reducers/GroupSlice';
import { IMove } from '../../../models/MyGroups/IMove';
import { setGameState, setMovesState, clearGameState, clearUserMoves, stepBack, editUserName} from '../../../store/reducers/GroupSlice';
import ChessboardArrows from '../../../utils/ChessboardArrows';
import "../../../utils/chessboard-arrows.css";
import Star from '../../../assets/pawns/Star.svg'


interface ChessBoardProps {
    moveMode: boolean;
    globalMode: boolean;
    clear: boolean;
    setClear: (bool: boolean) => void;
    position?: string;
    materialId?: string;
    movesM: Array<{ id: string; user_id: string, name: string; sname: string; moves: Array<{color: string, move: string}>;}>;
    setMoves: React.Dispatch<React.SetStateAction<Array<{ id: string; user_id: string, name: string; sname: string; moves: Array<{color: string, move: string}>;}>>>;
    PrevBackTheme: (bool: boolean) => void;
    type: string;
    custom: [{square: string, type: string}];
}

const ChessBoard: FC<ChessBoardProps> = ({moveMode, globalMode, clear, setClear, position, materialId, movesM, setMoves, PrevBackTheme, type, custom, game, setGame}) => {
    const { groupId } = useParams();
    const dispatch = useAppDispatch();

    const [moveFrom, setMoveFrom] = useState("");
    const [moveTo, setMoveTo] = useState<Square | null>(null);
    const [showPromotionDialog, setShowPromotionDialog] = useState(false);
    const [rightClickedSquares, setRightClickedSquares] = useState({});
    const [moveSquares, setMoveSquares] = useState({});
    const [boardOrientation, setBoardOrientation] = useState("white");
    const [optionSquares, setOptionSquares] = useState({});
    const engine = useMemo(() => new Engine(), []);
    const { user } = useAppSelector(state=> state.UserSlice);
    const redoHistory = useRef([]);
    const ref = useRef();
    const relPos = useRef<string>('');
    const blackSquares = ['a1', 'c1', 'e1', 'g1', 'b2', 'd2', 'f2', 'h2', 'a3', 'c3', 'e3', 'g3', 'b4', 'd4', 'f4', 'h4', 'a5', 'c5', 'e5', 'g5', 'b6', 'd6', 'f6', 'h6', 'a7', 'c7', 'e7', 'g7', 'b8', 'd8', 'f8', 'h8'];
    useEffect(() => {
        if(groupId) {
            ref.current = new ChessboardArrows()
            ref.current.ChessboardArrows('board_wrapper', groupId, user.role, globalMode); 
        }  
    }, [groupId])

    useEffect(() => {
        ref.current.setGlobalMode(globalMode);
    }, [globalMode])

    useEffect(() => {
        const updateHistory = async () => {
            if(groupId) {
                if(game.history() && user.role !== 'STUDENT') {
                    await dispatch(editTestGroup({groupId: groupId, payload: {current: materialId}}));
                }
                if(user.role !== 'TRANER' && user.role !== 'DIRECTOR' && user.role !== 'ZDIRECTOR' && user.role !== 'TRANERMETODIST') {
                    await dispatch(editTestGroup({groupId: groupId, payload: {material: materialId, move: {user_id: user._id, name: user.name, sname: user.sname, moves: []}}}))
                    GroupAddGameUserSocket({room: groupId, move: {user_id: user._id, name: user.name, sname: user.sname, moves: []}});
                    dispatch(pushGame({user_id: user._id, name: user.name, sname: user.sname, moves: []}));
                }
                dispatch(setGameState(materialId));
                
            }
        }
        void updateHistory();
        if(position) {
            relPos.current = position;
            const gameCopy = { ...game };
            gameCopy.load(position);
            setGame(gameCopy);
            setMoves([]);
            if(game.turn() === 'w') {
                setBoardOrientation("white");
            } else {
                setBoardOrientation("black");
            }
            ref.current.clearCanvas();
        }

    }, [position])
    
    useEffect(() => {
        if(clear) {
            setClear(false)
            safeGameMutate((game) => { game.load(position);})
            dispatch(clearGameState());
        }
    }, [clear])

    useEffect(() => {
        socket.on("group:recive_change_game", (data) => {
            const gameCopy = { ...game };
            gameCopy.move(data.game);
            setGame(gameCopy);
            if(data.fen !== game.fen()) {
                safeGameMutate((game) => { game.load(data.fen);})
            }
        })
        socket.on("group:recive_move_back", () => {
            back();
        })
        socket.on("group:recive_full_clean", () => {
            safeGameMutate((game) => { game.load(relPos.current);})
            dispatch(clearGameState());
        })
        socket.on("group:recive_user_clean", (data) => {
            if(user._id === data) {
                safeGameMutate((game) => { game.load(relPos.current);});
                dispatch(clearUserMoves(data));
            } else {
                dispatch(clearUserMoves(data));
            }
        })
        socket.on("group:recive_user_edit", (data: {user_id: string, name: string}) => {
            dispatch(editUserName(data));
            dispatch(editUserNameAuth({name: data.name}));
        })
        socket.on("group:back_recive", (user_id) => {
            dispatch(stepBack({user_id: user_id}));
        })
        socket.on("group:next_recive", (data) => {
            dispatch(setMovesState({user_id: data.user_id, color: data.color, move: data.move}));
        })

 
        socket.on("group:recive_add_game_user", (data) => {
            dispatch(pushGame(data));
        })

        
        socket.on("group:recive_draw_arrow", (data) => {
            ref.current.socketDrawArrowToCanvas(data.fromx, data.fromy, data.tox, data.toy, data.color, data.resolution);
        })
        socket.on("group:recive_draw_circle", (data) => {
            ref.current.drawCircleSocket(data.x, data.y, data.color, data.resolution);
        })
        socket.on("group:recive_clear_canvas", () => {
            ref.current.clearCanvas();
        })
        
        

        
    }, [socket])
    


    function safeGameMutate(modify) {
        setGame((g) => {
            const update = { ...g };
            modify(update);
            return update;
        });
    }
    

    function back() {
        if(game.history().pop()){
            dispatch(stepBack({user_id: user._id}));
            GroupStepBackSocket({room: groupId, user_id: user._id})
            redoHistory.current.push(game.history().pop())
        }
        if(groupId) {
            if(globalMode) {
                GroupMakeMoveBackSocket({room: groupId});
            }
        }
        safeGameMutate((game) => {
            game.undo();
        })
    }

    function fastBack() {
        for(let i = 0; i <= game.history().length; i++) {
            back();
        }
    }
    
    function next() {
        const gameCopy = { ...game };
        const fen = redoHistory.current.pop();

        if(fen) {
            const color = game.turn() === 'w' ? 'w' : 'b';
            GroupStepNextSocket({room: groupId, user_id: user._id, color: color, move: fen});
            dispatch(setMovesState({user_id: user._id, color: color, move: fen}));
        }
        
        gameCopy.move(fen);
        setGame(gameCopy);
        
        if(groupId) {
            if(globalMode) {
                GroupChangeGameSocket({room: groupId, game: fen, fen: game.fen()});
            }
        }
        
    }

    function fastNext() {
        for(let i = 0; i <= redoHistory.current.length+1; i++) {
            next();
        }
    }

    function getMoveOptions(square: Square) {
        const moves = game.moves({
            square,
            verbose: true,
        });
        if (moves.length === 0) {
        setOptionSquares({});
        return false;
    }

        const newSquares = {};
        moves.map((move) => {
            newSquares[move.to] = {
            background:
                game.get(move.to) &&
                game.get(move.to).color !== game.get(square).color
                ? blackSquares.includes(move.to) ? "radial-gradient(circle, rgba(97,112,64,1) 85%, transparent 85%)" : "radial-gradient(circle, rgba(130,151,105,1) 85%, transparent 85%)"
                : blackSquares.includes(move.to) ? "radial-gradient(circle, rgba(97,112,64,1) 20%, transparent 20%)" : "radial-gradient(circle, rgba(130,151,105,1) 20%, transparent 20%)",
            borderRadius: "50%",
            
            };
            return move;
        });
        newSquares[square] = {
            background:  blackSquares.includes(square) ? "rgba(97,112,64,1)" : "rgba(130,150,105,1)",
        };
        setOptionSquares(newSquares);
        return true;
    }

    async function onSquareClick(square: Square) {
        if(moveMode || user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANER' || user.role === 'TRANERMETODIST') {
            setRightClickedSquares({});
        // from square
            
            if (!moveFrom) {
                const hasMoveOptions = getMoveOptions(square);
                if (hasMoveOptions) setMoveFrom(square);
                return;
            }
        // to square
            if (!moveTo) {
            // check if valid move before showing dialog
            const moves = game.moves({
                moveFrom,
                verbose: true,
            });
            const foundMove = moves.find(
                (m) => m.from === moveFrom && m.to === square
            );
            // not a valid move
            if (!foundMove) {
                // check if clicked on new piece
                let hasMoveOptions;
                
                if(moveFrom === square) {
                    hasMoveOptions = getMoveOptions(null);
                } else {
                    hasMoveOptions = getMoveOptions(square)
                }
                
                // if new piece, setMoveFrom, otherwise clear moveFrom
                setMoveFrom(hasMoveOptions ? square : "");
                return;
            }

            // valid move
            setMoveTo(square);

            // if promotion move
                if (
                    (foundMove.color === "w" &&
                        foundMove.piece === "p" &&
                        square[1] === "8") ||
                    (foundMove.color === "b" &&
                        foundMove.piece === "p" &&
                        square[1] === "1")
                    ) {
                    setShowPromotionDialog(true);
                    return;
                }

                // is normal move
                const gameCopy = { ...game };
                const move = gameCopy.move({
                    from: moveFrom,
                    to: square,
                    promotion: "q",
                });

                
                if(move) {
                    if(movesM.find(item=> item.user_id === user._id)) {
                        const tmp = movesM;
                        const index = tmp.findIndex(item=> item.user_id === user._id);
                        //tmp.pop()?.moves.pop().count
                        tmp[index].moves.push({ color: move.color, move: move.san});
                        setMoves([...tmp]);

                    } 
                    
                    if(groupId) {
                        await TestLessonService.editGroup(groupId, {material: materialId, move: {user_id: user._id, name: user.name, sname: user.sname, moves: [{color: move.color, move: move.san}]}});
                        dispatch(setMovesState({user_id: user._id, color: move.color, move: move.san}));
                        GroupMakeMoveSocket({room: groupId, user_id: user._id, color: move.color, move: move.san});
                    }
                    
                }

                // if invalid, setMoveFrom and getMoveOptions
                if (move === null) {
                    const hasMoveOptions = getMoveOptions(square);
                    if (hasMoveOptions) setMoveFrom(square);
                    return;
                }
                if(groupId) {
                    if(globalMode) {
                        GroupChangeGameSocket({room: groupId, game: {
                            from: moveFrom,
                            to: square,
                            promotion: "q",
                        }, fen: game.fen()});
                    }
                }

                setGame(gameCopy);

                //setTimeout(findBestMove, 300);
                setMoveFrom("");
                setMoveTo(null);
                setOptionSquares({});
                return;
            }
        }
    }

    function findBestMove() {
        const gameCopy = { ...game };
        engine.evaluatePosition(game.fen(), 2);

        engine.onMessage(({ bestMove }) => {
            if (bestMove) {
            // In latest chess.js versions you can just write ```game.move(bestMove)```
            gameCopy.move({
                from: bestMove.substring(0, 2),
                to: bestMove.substring(2, 4),
                promotion: bestMove.substring(4, 5),
            });

            setGame(gameCopy);
            }
        });
    }

    function onPieceDragBegin(piece, sourceSquare) {
        //if(moveMode || user.role === 'DIRECTOR' || user.role === 'TRANER') {
            setMoveFrom(sourceSquare);
            const hasMoveOptions = getMoveOptions(sourceSquare);
        //}
    }
    function onPieceDragEnd(piece, sourceSquare) {
        //if(moveMode || user.role === 'DIRECTOR' || user.role === 'TRANER') {
      
            const hasMoveOptions = getMoveOptions(null);
        //}
    }
    function onDragOverSquare (square) {
        setMoveTo(square);
    }
    async function onDrop(sourceSquare, targetSquare, piece) {
        if(moveMode || user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANER' || user.role === 'TRANERMETODIST') {
            const gameCopy = { ...game };
            const move = gameCopy.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q",
            });
            
            if(type === 'customtask') {
                let tokens = gameCopy.fen().split(" ");
                tokens[1] = 'w';
                tokens[3] = "-";
                gameCopy.load(tokens.join(" "));
            }

            if(move) {
                if(movesM.find(item=> item.user_id === user._id)) {
                    const tmp = movesM;
                    const index = tmp.findIndex(item=> item.user_id === user._id);
                    //tmp.pop()?.moves.pop().count
                    tmp[index].moves.push({ color: move.color, move: move.san});
                    setMoves([...tmp]);

                } 
                
                if(groupId) {
                    await TestLessonService.editGroup(groupId, {open: true, material: materialId, move: {user_id: user._id, name: user.name, sname: user.sname, moves: [{color: move.color, move: move.san}]}});
                    dispatch(setMovesState({user_id: user._id, color: move.color, move: move.san}));
                    GroupMakeMoveSocket({room: groupId, user_id: user._id, color: move.color, move: move.san});
                    if(globalMode) {
                        GroupChangeGameSocket({room: groupId, game: {
                            from: sourceSquare,
                            to: targetSquare,
                            promotion: piece[1].toLowerCase() ?? "q",
                        }, fen: game.fen()});
                    }
                }
                
            }
        
            // illegal move
            //if (move === null) return false;
        
            // exit if the game is over

            //if (game.game_over() || game.in_draw()) return false;
            
            setGame(gameCopy);
            setMoveFrom("");
            setMoveTo(null);
            //setTimeout(findBestMove, 300);
            return true;
        }
      }

    async function onPromotionPieceSelect(piece) {
        // if no piece passed then user has cancelled dialog, don't make move and reset
        if (piece) {
            const gameCopy = { ...game };
            const move = gameCopy.move({
                from: moveFrom,
                to: moveTo,
                promotion: piece[1].toLowerCase() ?? "q",
            });
            if(move) {
                if(groupId) {
                    await TestLessonService.editGroup(groupId, {open: true, material: materialId, move: {user_id: user._id, name: user.name, sname: user.sname, moves: [{color: move.color, move: move.san}]}});
                    dispatch(setMovesState({user_id: user._id, color: move.color, move: move.san}));
                    GroupMakeMoveSocket({room: groupId, user_id: user._id, color: move.color, move: move.san});
                    if(globalMode) {
                        GroupChangeGameSocket({room: groupId, game: {
                            from: moveFrom,
                            to: moveTo,
                            promotion: piece[1].toLowerCase() ?? "q",
                        }, fen: game.fen()});
                    }
                }
            }
            setGame(gameCopy);
            //setTimeout(findBestMove, 300);
        }
        setMoveFrom("");
        setMoveTo(null);
        setShowPromotionDialog(false);
        setOptionSquares({});
        return true;
    }

    function onSquareRightClick(square) {
        const colour = "rgba(0, 0, 255, 1)";
        setRightClickedSquares({
        ...rightClickedSquares,
        [square]:
            rightClickedSquares[square] &&
            rightClickedSquares[square].backgroundColor === colour
            ? undefined
            : { backgroundColor: colour },
        });
    }

    const CustomPieceRenderer = (props) => {
        const {square} = props;
        const tmp = [] as Array<string>
        custom.map(item=> {
            tmp.push(item.square);
        })
        return (
            <>
                {(tmp.includes(square))
                ?
                    <img width='81' height='81' src={Star} alt="" />
                :
                <svg viewBox="1 1 43 43" width="81.25" height="81.25">
                    <g>
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
                            <path d="m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 H 34 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z" style={{opacity: 1, fill: 'rgb(255, 255, 255)', fillOpacity: 1, fillRule: "nonzero", stroke: 'rgb(0, 0, 0)', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1}}>
                            </path>
                        </svg>
                    </g>
                </svg>
                }
            </>
        );
    };


    return (
        <div className='w-[calc(100vh-281px)] max-2xl:w-[calc(100vh-200px)]'>
            <div id="board_wrapper">
                <canvas id="primary_canvas" className='w-[calc(100vh-281px)] h-[calc(100vh-281px)] max-2xl:w-[calc(100vh-200px)] max-2xl:h-[calc(100vh-200px)]'></canvas>
                <canvas id="drawing_canvas" className='w-[calc(100vh-281px)] h-[calc(100vh-281px)] max-2xl:w-[calc(100vh-200px)] max-2xl:h-[calc(100vh-200px)]'></canvas>
                <Chessboard
                    animationDuration={200}
                    arePiecesDraggable={moveMode || user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANER' || user.role === 'TRANERMETODIST' ? true : false}
                    position={game.fen()}
                    onSquareClick={onSquareClick}
                    onSquareRightClick={onSquareRightClick}
                    onPromotionPieceSelect={onPromotionPieceSelect}
                    boardOrientation={boardOrientation}
                    onDragOverSquare={onDragOverSquare}
                    areArrowsAllowed={false}
                    //promotionDialogVariant='vertical'
                    customArrowColor='rgba(0,0,0,0)'
                    customSquareStyles={{
                    ...moveSquares,
                    ...optionSquares,
                    }}
                    onPieceDragBegin={onPieceDragBegin}
                    onPieceDragEnd={onPieceDragEnd}
                    promotionToSquare={moveTo}
                    showPromotionDialog={showPromotionDialog}
                    onPieceDrop={onDrop}
                    customPieces={type === 'customtask' && {
                        "bP": (props) => CustomPieceRenderer(props)
                    }}
                    
                />
            </div>
            <div className="flex items-center justify-center border-2 border-[#ccc] rounded-full py-2 mt-2 max-2xl:py-1">
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANER' || user.role === 'TRANERMETODIST') &&
                    <button title='Глава назад' className='mr-6 text-base text-red-500 max-2xl:text-sm' onClick={() => PrevBackTheme(false)}><FaFastBackward/></button>
                }
                <button className='mr-6 text-xl max-2xl:text-base' title='Все ходы назад' onClick={() => fastBack()}><AiFillFastBackward/></button>
                <button className='mr-6 text-xl max-2xl:text-base' title='Ход назад' onClick={() => back()}><AiFillStepBackward/></button>
                <button className='mr-6 text-xl max-2xl:text-base' title='Ход вперед' onClick={() => next()}><AiFillStepForward/></button>
                <button className='mr-6 text-xl max-2xl:text-base' title='Все ходы вперед' onClick={() => fastNext()}><AiFillFastForward/></button>
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANER' || user.role === 'TRANERMETODIST') &&
                    <button title='Глава вперед' className='mr-6 text-base max-2xl:text-sm text-red-500' onClick={() => PrevBackTheme(true)}><FaFastForward/></button>
                }
                <button className='mr-6 text-xl max-2xl:text-base' title='В исходную позицию' onClick={() => safeGameMutate((game) => { game.load(position);})}><AiOutlineCloseCircle/></button>
                <button className='text-xl max-2xl:text-base' title='Перевернуть доску' onClick={() => {setBoardOrientation((currentOrientation) => currentOrientation === "white" ? "black" : "white");}}><CgArrowsExchangeAltV/></button>
            </div>
        </div>
    );
}

export default ChessBoard;