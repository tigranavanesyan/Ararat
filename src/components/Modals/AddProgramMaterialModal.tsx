import { FC, useState, useEffect } from 'react'
import Modal from '../UI/Modal';
import Textarea from '../UI/Textarea';
import Button from '../UI/Button';
import { useForm, SubmitHandler } from "react-hook-form";
import { ServerError } from '../../models/response/ServerError';
import AuthErrorModal from './AuthError';
import ProgramService from '../../services/ProgramService';
import { AxiosError } from 'axios';
import { useAppDispatch } from '../../hooks/redux';
import { createMaterial, createCustomMaterial, editCustomMaterial } from '../../store/reducers/ProgramSlice';
import UploadFile from '../Messenger/Chat/UploadFile';
import { Tab } from '@headlessui/react'
import {Chessboard} from 'react-chessboard'
import { Chess } from 'chess.js'
import Star from '../../assets/pawns/Star.svg'
import Wk from '../../assets/pawns/Wk.svg'
import Wq from '../../assets/pawns/Wq.svg'
import Wr from '../../assets/pawns/Wr.svg'
import Wb from '../../assets/pawns/Wb.svg'
import Wn from '../../assets/pawns/Wn.svg'
import Wp from '../../assets/pawns/Wp.svg'

import Bk from '../../assets/pawns/Bk.svg'
import Bq from '../../assets/pawns/Bq.svg'
import Br from '../../assets/pawns/Br.svg'
import Bb from '../../assets/pawns/Bb.svg'
import Bn from '../../assets/pawns/Bn.svg'
import Bp from '../../assets/pawns/Bp.svg'

import {BsFillTrashFill} from '@react-icons/all-files/bs/BsFillTrashFill'
import {BsArrowCounterclockwise} from '@react-icons/all-files/bs/BsArrowCounterclockwise'
import {RiDeleteBin6Line} from '@react-icons/all-files/ri/RiDeleteBin6Line'
import {HiArrowsUpDown} from '@react-icons/all-files/hi2/HiArrowsUpDown'


import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import FenParser from '@chess-fu/fen-parser';
import Select from '../UI/Main/Select';
import { ISelect } from '../../models/ISelect';
import CheckBox from '../UI/Main/CheckBox';
import { IMaterial } from '../../models/Program/IMaterial';
interface AddProgramMaterialModalProps {
    modal: boolean,
    setModal: (bool: boolean) => void,
    theme_id: string,
    edit?: boolean
    material?: IMaterial
}

type Form = {
    pgn: string,
    theory: string,
};

const AddProgramMaterialModal: FC<AddProgramMaterialModalProps> = ({ modal, setModal, theme_id, edit, material }) => {
    const dispatch = useAppDispatch();
    const [modalError, setModalError] = useState<string>('');
    const turnList = [{id: '1', name: 'Белые', slug: 'w'}, {id: '2', name: 'Черные', slug: 'b'}]
    const [turn, setTurn] = useState<ISelect>(turnList[0]);
    const [castling, setCastling] = useState<{wOO: boolean, wOOO: boolean, bOO: boolean, bOOO: boolean}>(
        {
            wOO: true,
            wOOO: true,
            bOO: true,
            bOOO: true
        }
    );
    
    

    const [eModal, setEModal] = useState<boolean>(false);
    const { register, handleSubmit, setValue, getValues, formState: {errors} } = useForm<Form>();
    const [game, setGame] = useState(new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'));
    const [piece, setPiece] = useState<string>('');
    const [stars, setStars] = useState<string[]>([]);
    const [orientation, setOrientation] = useState<string>('white');
    const [fen, setFen] = useState<string>(game.fen());

    useEffect(() => {
        const fen = new FenParser(game.fen());
        console.log(fen);
        const arr = [];
        if(castling.wOO) {
            arr.push('K')
        }
        if(castling.wOOO) {
            arr.push('Q')
        }
        if(castling.bOO) {
            arr.push('k')
        }
        if(castling.bOOO) {
            arr.push('q')
        }
        fen.castles = arr.join('');
        game.load(fen.toString());
        setFen(fen.toString());

    }, [castling])

    useEffect(() => {
        if(edit) {
            if(material?.data.tags.FEN) {
                const gameCopy = { ...game };
                gameCopy.load(material?.data.tags.FEN);
                setGame(gameCopy);
                setFen(gameCopy.fen());
                if(material?.custom) {
                    const tmp = [] as Array<string>
                    material?.custom.map(item=> {
                        tmp.push(item.square);
                    })
                    setStars(tmp);
                }
            }
            setValue('theory', material?.data?.gameComment?.comment)
        }
    }, [edit])
    

    const setFilesHandler = (files: FileList) => {
        const file = files[0];
        if(file) {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function() {
                const result = reader.result as string;
                setValue("pgn", result, {shouldValidate: true })
            };
        }
    }

    const onSubmit: SubmitHandler<Form> = async (data, e) => {
        e?.preventDefault();
        await dispatch(createMaterial({theme_id: theme_id, pgn: data.pgn})).then(()=> setModal(false)).catch((e: AxiosError)=> {
            const event = e.response?.data as ServerError;
            setModalError(event.error)
            setEModal(true);
        });
    }

    const createCustomMaterialHandler = async () => {
        let tmp = [] as [{square: string, type: string}];
        stars.map(star=>{
            tmp.push({square: star, type: 'star'})
        });
        if(edit) {
            await dispatch(editCustomMaterial({material_id: material?._id, fen: game.fen(), custom: tmp, theory: getValues('theory')})).then(()=> setModal(false)).catch((e: AxiosError)=> {
                const event = e.response?.data as ServerError;
                setModalError(event.error);
                setEModal(true);
            });
        } else {
            await dispatch(createCustomMaterial({theme_id: theme_id, fen: game.fen(), custom: tmp, theory: getValues('theory')})).then(()=> setModal(false)).catch((e: AxiosError)=> {
                const event = e.response?.data as ServerError;
                setModalError(event.error)
                setEModal(true);
            });
        }

    }
    const funcTest = () => {
        const gameCopy = { ...game };
        // gameCopy.setCastlingRights('w', { 'k': false, 'q': true })
        setGame(gameCopy);
    }
    const addFigure = (square) => {
        const gameCopy = { ...game };
        if(piece === 'star') {
            gameCopy.put({ type: 'p', color: 'b' }, square);
            setStars(prev=> [...prev, square]);
        } else if(piece === 'pawn') {
            gameCopy.put({ type: 'p', color: 'w' }, square);
        } else if(piece === 'k') {
            gameCopy.put({ type: 'k', color: 'w' }, square);
        } else if(piece === 'q') {
            gameCopy.put({ type: 'q', color: 'w' }, square);
        } else if(piece === 'r') {
            gameCopy.put({ type: 'r', color: 'w' }, square);
        } else if(piece === 'b') {
            gameCopy.put({ type: 'b', color: 'w' }, square);
        } else if(piece === 'n') {
            gameCopy.put({ type: 'n', color: 'w' }, square);
        } else if(piece === 'bk') {
            gameCopy.put({ type: 'k', color: 'b' }, square);
        } else if(piece === 'bq') {
            gameCopy.put({ type: 'q', color: 'b' }, square);
        } else if(piece === 'br') {
            gameCopy.put({ type: 'r', color: 'b' }, square);
        } else if(piece === 'bb') {
            gameCopy.put({ type: 'b', color: 'b' }, square);
        } else if(piece === 'bn') {
            gameCopy.put({ type: 'n', color: 'b' }, square);
        } else if(piece === 'bpawn') {
            gameCopy.put({ type: 'p', color: 'b' }, square);
        } else if(piece === 'remove') {
            gameCopy.remove(square);
        }
        

        setGame(gameCopy);
        setFen(gameCopy.fen())
    }

    const startPosition = () => {
        const gameCopy = { ...game };
        gameCopy.load('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        setGame(gameCopy);
        setFen(gameCopy.fen())
    }
    const clearPosition = () => {
        const gameCopy = { ...game };
        gameCopy.load('8/8/8/8/8/8/8/8 w - - 0 1');
        setGame(gameCopy);
        setFen(gameCopy.fen())
    }

    const CustomPieceRenderer = (props) => {
        const {squareWidth, square} = props;
        return (
            <>
                {(stars.includes(square))
                ?
                    <img width='81' height='81' src={Star} alt="" />
                :
                <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width={squareWidth}
                height={squareWidth}
                viewBox={"1 1 43 43"}
              >
                <path d="m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 H 34 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z" />
              </svg>
                }
            </>
        );
    };

    const onChangeTurn = (value: ISelect) => {
        setTurn(value);
        const fen = new FenParser(game.fen());
        fen.turn = value.slug;
        game.load(fen.toString());
        setFen(fen.toString())
    }

    return (
        <>
            <Modal active={modal} setActive={setModal} className='items-center !max-w-[1200px] !w-auto'>
                <h1 className='text-2xl font-semibold tracking-wider text-gray-800 capitalize '>{edit ? 'Edit material' : 'Create new material' }</h1>
                <Tab.Group as='div' className='w-full'>
                    <Tab.List as="div" className='flex py-1 mt-4'>
                        <Tab as='div' className='w-full' disabled={edit ? true : false}>
                        {({ selected }) => (
                            <button
                            className={
                                selected ? 'bg-apricot text-black w-full py-1' : 'bg-white text-black w-full py-1'
                            }
                            >
                            PGN
                            </button>
                        )}
                        </Tab>
                        <Tab as='div' className='w-full'>
                        {({ selected }) => (
                            <button
                            className={
                                selected ? 'bg-apricot text-black w-full py-1' : 'bg-white text-black w-full py-1'
                            }
                            >
                            Custom
                            </button>
                        )}
                        </Tab>
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel as='div' className='w-full'>
                            <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className='bg-white container mx-auto flex flex-col px-10 py-5 max-w-2xl'>
                                <div className="flex items-center mb-4">
                                    <label className='block text-sm text-gray-600'>PGN File: </label>
                                    <UploadFile labelClass='!text-gray-800 hover:!text-white' accept='.pgn' id='pgn-upload' multiple setFilesHandler={setFilesHandler}/>
                                </div>
                                <Textarea wrapperClasses='mb-5' label='PGN:' placeholder='PGN' error={errors.pgn?.message} register={register('pgn', { required: "The field must be filled" })}/>
                                <Button>Create Material</Button>
                            </form>
                        </Tab.Panel>
                        <Tab.Panel as='div' className='w-full'>
                            <div className="flex my-3">
                                <div className="flex flex-col items-center">
                                    <div className="flex mb-5 items-center">
                                        <button className={['mr-2 w-14', piece === 'bk' && 'border-2 rounded-lg border-apricot'].join(' ')} onClick={()=> void setPiece('bk')}>
                                            <img src={Bk} className='w-full h-full' alt="Bk" />
                                        </button>
                                        <button className={['mr-2 w-14', piece === 'bq' && 'border-2 rounded-lg border-apricot'].join(' ')} onClick={()=> void setPiece('bq')}>
                                            <img src={Bq} className='w-full h-full' alt="Bq" />
                                        </button>
                                        <button className={['mr-2 w-14', piece === 'br' && 'border-2 rounded-lg border-apricot'].join(' ')} onClick={()=> void setPiece('br')}>
                                            <img src={Br} className='w-full h-full' alt="Br" />
                                        </button>
                                        <button className={['mr-2 w-14', piece === 'bb' && 'border-2 rounded-lg border-apricot'].join(' ')} onClick={()=> void setPiece('bb')}>
                                            <img src={Bb} className='w-full h-full' alt="Bb" />
                                        </button>
                                        <button className={['mr-2 w-14', piece === 'bn' && 'border-2 rounded-lg border-apricot'].join(' ')} onClick={()=> void setPiece('bn')}>
                                            <img src={Bn} className='w-full h-full' alt="Bn" />
                                        </button>
                                        <button className={['mr-2 w-14', piece === 'bpawn' && 'border-2 rounded-lg border-apricot'].join(' ')} onClick={()=> void setPiece('bpawn')}>
                                            <img src={Bp} className='w-full h-full' alt="Bp" />
                                        </button>
                                        <button className={['mr-2 w-12 h-12 mt-2 flex justify-center items-center text-[35px] text-red-600', piece === 'remove' && 'border-2 rounded-lg border-apricot'].join(' ')} title='Remove' onClick={()=> void setPiece('remove')}><BsFillTrashFill/></button>
                                    </div>
                                    <div className="w-[500px] h-[500px] mr-5">
                                            <Chessboard
                                                position={game.fen()}
                                                onSquareClick={addFigure}
                                                arePiecesDraggable={false}
                                                allowDragOutsideBoard={true}
                                                boardOrientation={orientation}
                                                customPieces={{
                                                    "bP": (props) => CustomPieceRenderer(props)
                                                }}
                                            />
                                    </div>
                                    <div className="flex mb-5 items-center">
                                        <button className={['mr-2 w-14', piece === 'k' && 'border-2 rounded-lg border-apricot'].join(' ')} onClick={()=> void setPiece('k')}>
                                            <img src={Wk} className='w-full h-full' alt="Wk" />
                                        </button>
                                        <button className={['mr-2 w-14', piece === 'q' && 'border-2 rounded-lg border-apricot'].join(' ')} onClick={()=> void setPiece('q')}>
                                            <img src={Wq} className='w-full h-full' alt="Wq" />
                                        </button>
                                        <button className={['mr-2 w-14', piece === 'r' && 'border-2 rounded-lg border-apricot'].join(' ')} onClick={()=> void setPiece('r')}>
                                            <img src={Wr} className='w-full h-full' alt="Wr" />
                                        </button>
                                        <button className={['mr-2 w-14', piece === 'b' && 'border-2 rounded-lg border-apricot'].join(' ')} onClick={()=> void setPiece('b')}>
                                            <img src={Wb} className='w-full h-full' alt="Wb" />
                                        </button>
                                        <button className={['mr-2 w-14', piece === 'n' && 'border-2 rounded-lg border-apricot'].join(' ')} onClick={()=> void setPiece('n')}>
                                            <img src={Wn} className='w-full h-full' alt="Wn" />
                                        </button>
                                        <button className={['mr-2 w-14', piece === 'pawn' && 'border-2 rounded-lg border-apricot'].join(' ')} onClick={()=> void setPiece('pawn')}>
                                            <img src={Wp} className='w-full h-full' alt="Wp" />
                                        </button>
                                        <button className={['mr-2 w-12 h-12 mt-2 flex justify-center items-center text-[35px] text-red-600', piece === 'remove' && 'border-2 rounded-lg border-apricot'].join(' ')} title='Remove' onClick={()=> void setPiece('remove')}><BsFillTrashFill/></button>
                                    </div>
                                    <div className="flex items-center">
                                        <p className='mb-1 font-semibold mr-2'>FEN:</p>
                                        <p className="bg-white border-apricot border rounded-lg p-2 self-start">{fen}</p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col">
                                    <div className="flex items-center mb-5">
                                        <p className='text-lg font-semibold mr-5'>Ход:</p>
                                        <Select className='!mb-0' options={turnList} value={turn} onChange={onChangeTurn}/>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className='text-lg font-semibold mb-5'>Рокировка:</p>
                                        <div className="flex flex-wrap">
                                            <CheckBox wrapperClass='basis-1/2 mb-3' checked={castling.wOO} onChange={()=> setCastling({...castling, wOO: castling.wOO ? false : true})} label='Белые О-О'/>
                                            <CheckBox wrapperClass='basis-1/2 mb-3' checked={castling.wOOO} onChange={()=> setCastling({...castling, wOOO: castling.wOOO ? false : true})} label='О-О-О'/>
                                            <CheckBox wrapperClass='basis-1/2 mb-3' checked={castling.bOO} onChange={()=> setCastling({...castling, bOO: castling.bOO ? false : true})} label='Черные О-О'/>
                                            <CheckBox wrapperClass='basis-1/2 mb-3' checked={castling.bOOO} onChange={()=> setCastling({...castling, bOOO: castling.bOOO ? false : true})} label='О-О-О'/>
                                        </div>
                                    </div>
                                    
                                    <p className='text-lg font-semibold mb-2'>Элементы:</p>
                                    <button className='mr-2 w-14 mb-5' onClick={()=> void setPiece('star')}><img src={Star} className={['w-full h-full', piece === 'star' && 'border-2 rounded-lg border-apricot'].join(' ')} alt="star" /></button>
                                    <div className="flex flex-col items-start mb-5">
                                        <button className='flex items-center text-lg text-blue-600 hover:text-blue-700 hover:bg-blue-100 p-2 font-semibold' onClick={() => startPosition()}><BsArrowCounterclockwise className='mr-2'/>Начальная позиция</button>
                                        <button className='flex items-center text-lg text-blue-600 hover:text-blue-700 hover:bg-blue-100 p-2 font-semibold' onClick={() => clearPosition()}><RiDeleteBin6Line className='mr-2'/>Очистить доску</button>
                                        <button className='flex items-center text-lg text-blue-600 hover:text-blue-700 hover:bg-blue-100 p-2 font-semibold' onClick={() => setOrientation(orientation === 'white' ? 'black' : 'white')}><HiArrowsUpDown className='mr-2'/>Перевернуть доску</button>
                                    </div>
                                    <Textarea wrapperClasses='mb-5' label='Theory:' placeholder='Theory' register={register('theory')}/>
                                </div>
                            </div>
                            <Button onClick={()=> void createCustomMaterialHandler()} className='mt-2'>{edit ? 'Edit material' : 'Create Material'}</Button>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>      
            </Modal>
            <AuthErrorModal modal={eModal} setModal={setEModal} error={modalError}/>
        </>
    )
}

export default AddProgramMaterialModal;