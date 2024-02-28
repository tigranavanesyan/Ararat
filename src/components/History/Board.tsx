import { FC, useRef, useState, useEffect, useMemo } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from "react-chessboard";
import { Square } from 'react-chessboard/dist/chessboard/types';
import Engine from '../../utils/engine';
import { useAppSelector } from '../../hooks/redux';
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



interface ChessBoardProps {
    moveMode: boolean;
    position?: string;
    materialId?: string;
    movesM: Array<{ id: string; user_id: string, name: string; sname: string; moves: Array<{color: string, move: string}>;}>;
    setMoves: React.Dispatch<React.SetStateAction<Array<{ id: string; user_id: string, name: string; sname: string; moves: Array<{color: string, move: string}>;}>>>;
    PrevBackTheme: (bool: boolean) => void;
}

const ChessBoard: FC<ChessBoardProps> = ({moveMode, position, materialId, movesM, setMoves, PrevBackTheme}) => {
    const { groupId } = useParams();
    const [game, setGame] = useState(new Chess());
    const [moveFrom, setMoveFrom] = useState("");
    const [moveTo, setMoveTo] = useState<Square | null>(null);
    const [showPromotionDialog, setShowPromotionDialog] = useState(false);
    const [rightClickedSquares, setRightClickedSquares] = useState({});
    const [moveSquares, setMoveSquares] = useState({});
    const [boardOrientation, setBoardOrientation] = useState("white");
    const history = useRef([
        {
            material: "64f0b6e08bf89783fbcdedde",
            moves: [{id: "1693824785954.9082", user_id: "64e27f0e4db46189d8b1b322", name: "Sasha", sname: "3", user_id: "64e27f0e4db46189d8b1b322"}],
            movesHistory: ["Ng5"]
        }
    ])
    const [optionSquares, setOptionSquares] = useState({});
    const engine = useMemo(() => new Engine(), []);
    const { user } = useAppSelector(state=> state.UserSlice);
    const redoHistory = useRef([]);

    useEffect(() => {
        if(position) {
            const gameCopy = { ...game };
            gameCopy.load(position);
            setGame(gameCopy);
            setMoves([]);
        }

    }, [position])
    


    function safeGameMutate(modify) {
        setGame((g) => {
            const update = { ...g };
            modify(update);
            return update;
        });
    }
    
    function back() {
        if(game.history().pop()){
            redoHistory.current.push(game.history().pop())
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
        gameCopy.move(fen);
        setGame(gameCopy);
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
                ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
                : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
            borderRadius: "50%",
            };
            return move;
        });
        newSquares[square] = {
            background: "rgba(255, 255, 0, 0.4)",
        };
        setOptionSquares(newSquares);
        return true;
    }

    function onSquareClick(square: Square) {
        if(moveMode) {
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
                const hasMoveOptions = getMoveOptions(square);
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

                    } else {
                        setMoves(prev => [...prev, {id: (Date.now() + Math.random()).toString(), user_id: user._id, name: user.name, sname: user.sname, moves: [{color: move.color, move: move.san}]}]);
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
        <div className='w-[680px]'>
            <Chessboard
                id="ClickToMove"
                animationDuration={200}
                arePiecesDraggable={false}
                position={game.fen()}
                onSquareClick={onSquareClick}
                onSquareRightClick={onSquareRightClick}
                onPromotionPieceSelect={onPromotionPieceSelect}
                customArrowColor = {"rgb(34,197,94)"}
                boardOrientation={boardOrientation}
                customSquareStyles={{
                ...moveSquares,
                ...optionSquares,
                ...rightClickedSquares,
                }}
                promotionToSquare={moveTo}
                showPromotionDialog={showPromotionDialog}
            />
            <div className="flex items-center justify-center border-2 border-[#ccc] rounded-full py-2 mt-2">
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANER') &&
                    <button className='mr-6 text-base text-red-500' onClick={() => PrevBackTheme(false)}><FaFastBackward/></button>
                }
                <button className='mr-6 text-xl' onClick={() => fastBack()}><AiFillFastBackward/></button>
                <button className='mr-6 text-xl' onClick={() => back()}><AiFillStepBackward/></button>
                <button className='mr-6 text-xl' onClick={() => next()}><AiFillStepForward/></button>
                <button className='mr-6 text-xl' onClick={() => fastNext()}><AiFillFastForward/></button>
                {(user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR' || user.role === 'TRANER') &&
                    <button className='mr-6 text-base text-red-500' onClick={() => PrevBackTheme(true)}><FaFastForward/></button>
                }
                <button className='mr-6 text-xl' onClick={() => safeGameMutate((game) => { game.load(position);})}><AiOutlineCloseCircle/></button>
                <button className='text-xl' onClick={() => {setBoardOrientation((currentOrientation) => currentOrientation === "white" ? "black" : "white");}}><CgArrowsExchangeAltV/></button>
            </div>
        </div>
    );
}

export default ChessBoard;