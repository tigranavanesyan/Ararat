import { FC, useRef, useState, useEffect, useMemo } from 'react'
import { Chessboard } from "react-chessboard";
import { Square } from 'react-chessboard/dist/chessboard/types';
import Engine from '../../utils/engine';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import GroupService from '../../services/GroupService';
import { useParams } from 'react-router-dom';
import {AiFillFastBackward} from '@react-icons/all-files/ai/AiFillFastBackward';
import {AiFillStepBackward} from '@react-icons/all-files/ai/AiFillStepBackward';
import {AiFillStepForward} from '@react-icons/all-files/ai/AiFillStepForward';
import {AiFillFastForward} from '@react-icons/all-files/ai/AiFillFastForward';
import {AiOutlineCloseCircle} from '@react-icons/all-files/ai/AiOutlineCloseCircle'
import {CgArrowsExchangeAltV} from '@react-icons/all-files/cg/CgArrowsExchangeAltV'
import {FaFastBackward} from '@react-icons/all-files/fa/FaFastBackward' 
import {FaFastForward} from '@react-icons/all-files/fa/FaFastForward' 
import HomeworkService from '../../services/HomeworkService';
import { editGroup } from '../../store/reducers/GroupSlice';
import { editHomework } from '../../store/reducers/HomeworkSlice';
import { pushGame } from '../../store/reducers/GroupSlice';
import { IMove } from '../../models/MyGroups/IMove';
import { clearGameState} from '../../store/reducers/GroupSlice';
import { setMovesState, setGameState } from '../../store/reducers/HomeworkSlice';
import { stepBack } from '../../store/reducers/HomeworkSlice';
import ChessboardArrows from '../../utils/ChessboardArrows';

interface ChessBoardProps {
    position?: string;
    materialId?: string;
    movesM: Array<{ id: string; user_id: string, name: string; sname: string; moves: Array<{color: string, move: string}>;}>;
    setMoves: React.Dispatch<React.SetStateAction<Array<{ id: string; user_id: string, name: string; sname: string; moves: Array<{color: string, move: string}>;}>>>;
    PrevBackTheme: (bool: boolean) => void;
}

const ChessBoard: FC<ChessBoardProps> = ({ position, materialId, movesM, setMoves, PrevBackTheme, game, setGame}) => {
    const { groupId } = useParams();
    const dispatch = useAppDispatch();
    const [moveFrom, setMoveFrom] = useState("");
    const [moveTo, setMoveTo] = useState<Square | null>(null);
    const [showPromotionDialog, setShowPromotionDialog] = useState(false);
    const [rightClickedSquares, setRightClickedSquares] = useState({});
    const [moveSquares, setMoveSquares] = useState({});
    const [boardOrientation, setBoardOrientation] = useState("white");
    const ref = useRef();
    const [optionSquares, setOptionSquares] = useState({});
    const { user } = useAppSelector(state=> state.UserSlice);
    const { gameHistory } = useAppSelector(state=> state.HomeworkSlice);
    const homeworkSl = useAppSelector(state=> state.HomeworkSlice);
    const redoHistory = useRef([]);
    const blackSquares = ['a1', 'c1', 'e1', 'g1', 'b2', 'd2', 'f2', 'h2', 'a3', 'c3', 'e3', 'g3', 'b4', 'd4', 'f4', 'h4', 'a5', 'c5', 'e5', 'g5', 'b6', 'd6', 'f6', 'h6', 'a7', 'c7', 'e7', 'g7', 'b8', 'd8', 'f8', 'h8'];

    //stockfish
    // const engine = useMemo(() => new Engine(), []);
    const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());
    const [positionEvaluation, setPositionEvaluation] = useState(0);
    const [depth, setDepth] = useState(10);
    const [bestLine, setBestline] = useState("");
    const [possibleMate, setPossibleMate] = useState("");


    useEffect(() => {
        ref.current = new ChessboardArrows()
        ref.current.ChessboardArrows('board_wrapper'); 
    }, [])

    useEffect(() => {
        if (!game.game_over() || game.in_draw()) {
            findBestMove();
        }
      }, [chessBoardPosition]);

    useEffect(() => {
        const updateHistory = async () => {
            if(groupId) {
                await dispatch(editHomework({groupId: groupId, payload: {material: materialId, move: {user_id: user._id, name: user.name, sname: user.sname, moves: []}}}))
                dispatch(setGameState({materialId: materialId, user_id: user._id, name: user.name, sname: user.sname}));
            }
        }
        void updateHistory();
        if(position) {
            const gameCopy = { ...game };
            gameCopy.load(position);
            setGame(gameCopy);
            setMoves([]);
        }
        
    }, [position])
        
    useEffect(() => {
        if(gameHistory.length > 0) {
            const gameCopy = { ...game };
            gameHistory.map(move=> {
                gameCopy.move(move);
            }) 
            setGame(gameCopy);
        }
    }, [gameHistory])
    

    function safeGameMutate(modify) {
        setGame((g) => {
            const update = { ...g };
            modify(update);
            return update;
        });
    }
    
    async function back() {
        const moves = [];
        if(game.history().pop()){
            dispatch(stepBack({user_id: user._id}));
            redoHistory.current.push(game.history().pop())
            moves.push(...homeworkSl.game[0].moves);
            moves.pop();
        }
        safeGameMutate((game) => {
            game.undo();
        })
        const tmp = game.history();
        tmp.pop()
        await HomeworkService.editHomework(groupId, {material: materialId, move: {user_id: user._id, name: user.name, sname: user.sname, moves: moves}, movesHistory: tmp});
    }

    function fastBack() {
        for(let i = 0; i <= game.history().length; i++) {
            back();
        }
    }
    
    async function next() {
        const gameCopy = { ...game };
        const fen = redoHistory.current.pop();
        if(fen) {
            const color = game.turn() === 'w' ? 'w' : 'b';
            dispatch(setMovesState({user_id: user._id, color: color, move: fen}));
            gameCopy.move(fen);
            setGame(gameCopy);
            await HomeworkService.editHomework(groupId, {material: materialId, move: {user_id: user._id, name: user.name, sname: user.sname, moves: [...homeworkSl.game[0].moves, {color: color, move: fen}]}, movesHistory: game.history()});
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
                    await HomeworkService.editHomework(groupId, {material: materialId, move: {user_id: user._id, name: user.name, sname: user.sname, moves: [...homeworkSl.game[0].moves, {color: move.color, move: move.san}]}, movesHistory: game.history()});
                    dispatch(setMovesState({user_id: user._id, name: user.name, sname: user.sname, color: move.color, move: move.san}));
                }
                
            }

            // if invalid, setMoveFrom and getMoveOptions
            if (move === null) {
                const hasMoveOptions = getMoveOptions(square);
                if (hasMoveOptions) setMoveFrom(square);
                return;
            }

            setGame(gameCopy);

            //setTimeout(findBestMove, 300);
            setMoveFrom("");
            setMoveTo(null);
            setOptionSquares({});
            return;
        }
        
    }

    async function onDrop(sourceSquare, targetSquare, piece) {
        const gameCopy = { ...game };
        const move = gameCopy.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q",
        });
        setPossibleMate("");
        setChessBoardPosition(game.fen());
        if(move) {
            if(movesM.find(item=> item.user_id === user._id)) {
                const tmp = movesM;
                const index = tmp.findIndex(item=> item.user_id === user._id);
                tmp[index].moves.push({ color: move.color, move: move.san});
                setMoves([...tmp]);
            } 
            
            if(groupId) {
                await HomeworkService.editHomework(groupId, {material: materialId, move: {user_id: user._id, name: user.name, sname: user.sname, moves: [...homeworkSl.game[0].moves, {color: move.color, move: move.san}]}, movesHistory: game.history()});
                dispatch(setMovesState({user_id: user._id, name: user.name, sname: user.sname, color: move.color, move: move.san}));
            }
            
        }
    
        
        setGame(gameCopy);
        setMoveFrom("");
        setMoveTo(null);
        return true;
    }


    // function findBestMove() {
    //     const gameCopy = { ...game };
    //     engine.evaluatePosition(game.fen(), 2);

    //     engine.onMessage(({ bestMove }) => {
    //         if (bestMove) {
    //         // In latest chess.js versions you can just write ```game.move(bestMove)```
    //         gameCopy.move({
    //             from: bestMove.substring(0, 2),
    //             to: bestMove.substring(2, 4),
    //             promotion: bestMove.substring(4, 5),
    //         });

    //         setGame(gameCopy);
    //         }
    //     });
    // }

    function findBestMove() {
        // engine.evaluatePosition(chessBoardPosition, 18);

        // engine.onMessage(({ positionEvaluation, possibleMate, pv, depth }) => {
        //     if (depth < 10) return;
    
        // positionEvaluation &&
        //     setPositionEvaluation(
        //       ((game.turn() === "w" ? 1 : -1) * Number(positionEvaluation)) / 100
        //     );
        //     possibleMate && setPossibleMate(possibleMate);
        //     depth && setDepth(depth);
        //     pv && setBestline(pv);
        // });

    }
    const bestMove = bestLine?.split(" ")?.[0];

    function onPieceDragBegin(piece, sourceSquare) {
        setMoveFrom(sourceSquare);
        const hasMoveOptions = getMoveOptions(sourceSquare);
    }
    function onPieceDragEnd(piece, sourceSquare) {
        const hasMoveOptions = getMoveOptions(null);
    }
    function onDragOverSquare (square) {
        setMoveTo(square);
    }

    function onPromotionPieceSelect(piece) {
        // if no piece passed then user has cancelled dialog, don't make move and reset
        if (piece) {
            const gameCopy = { ...game };
            gameCopy.move({
                from: moveFrom,
                to: moveTo,
                promotion: piece[1].toLowerCase() ?? "q",
            });
            setGame(gameCopy);
            setTimeout(findBestMove, 300);
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
    
    return (
        <div className='w-[calc(100vh-256px)] max-2xl:w-[calc(100vh-200px)]'>
            <div id="board_wrapper">
                <canvas id="primary_canvas" className='w-[calc(100vh-256px)] h-[calc(100vh-256px)] max-2xl:w-[calc(100vh-200px)] max-2xl:h-[calc(100vh-200px)]'></canvas>
                <canvas id="drawing_canvas" className='w-[calc(100vh-256px)] h-[calc(100vh-256px)] max-2xl:w-[calc(100vh-200px)] max-2xl:h-[calc(100vh-200px)]'></canvas>
                <Chessboard
                    id="ClickToMove"
                    animationDuration={200}
                    position={game.fen()}
                    onDragOverSquare={onDragOverSquare}
                    onSquareClick={onSquareClick}
          
                    onPromotionPieceSelect={onPromotionPieceSelect}
                    areArrowsAllowed={false}
                    customArrows={
                        bestMove && [
                          [
                            bestMove.substring(0, 2) as Square,
                            bestMove.substring(2, 4) as Square,
                            "rgb(0, 128, 0)",
                          ],
                        ]
                      }
                    boardOrientation={boardOrientation}
                    customSquareStyles={{
                    ...moveSquares,
                    ...optionSquares,
                    ...rightClickedSquares,
                    }}
                    onPieceDragBegin={onPieceDragBegin}
                    onPieceDragEnd={onPieceDragEnd}
                    promotionToSquare={moveTo}
                    onPieceDrop={onDrop}
                    showPromotionDialog={showPromotionDialog}
                />
            </div>
            <div className="flex items-center justify-center border-2 border-[#ccc] rounded-full py-2 mt-2">
                <button title='Глава назад' className='mr-6 text-base text-red-500' onClick={() => PrevBackTheme(false)}><FaFastBackward/></button>
                <button title='Все ходы назад' className='mr-6 text-xl' onClick={() => fastBack()}><AiFillFastBackward/></button>
                <button title='Ход назад' className='mr-6 text-xl' onClick={() => back()}><AiFillStepBackward/></button>
                <button title='Ход вперед' className='mr-6 text-xl' onClick={() => next()}><AiFillStepForward/></button>
                <button title='Все ходы вперед' className='mr-6 text-xl' onClick={() => fastNext()}><AiFillFastForward/></button>
                <button title='Глава вперед' className='mr-6 text-base text-red-500' onClick={() => PrevBackTheme(true)}><FaFastForward/></button>
                <button title='В исходную позицию' className='mr-6 text-xl' onClick={() => safeGameMutate((game) => { game.load(position);})}><AiOutlineCloseCircle/></button>
                <button title='Перевернуть доску' className='text-xl' onClick={() => {setBoardOrientation((currentOrientation) => currentOrientation === "white" ? "black" : "white");}}><CgArrowsExchangeAltV/></button>
            </div>
        </div>
    );
}

export default ChessBoard;