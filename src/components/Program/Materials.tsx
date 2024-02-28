import { FC, useState, useEffect } from 'react'
import { useAppSelector } from '../../hooks/redux';
import OutlineButton from '../UI/OutlineButton';
import AddProgramMaterialModal from '../Modals/AddProgramMaterialModal';
import { Chessboard } from "react-chessboard";
import { useParams } from 'react-router-dom';
import GroupService from '../../services/GroupService';
import TestLessonService from '../../services/TestLessonService';
import AuthErrorModal from '../Modals/AuthError';
import { ServerError } from '../../models/response/ServerError';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import Switch from '../UI/Switch';
import Star from '../../assets/pawns/Star.svg'
import {BsFillTrashFill} from '@react-icons/all-files/bs/BsFillTrashFill'
import {AiOutlineEdit} from '@react-icons/all-files/ai/AiOutlineEdit'

import RemoveMaterialModal from '../Modals/RemoveMaterialModal';
import { IMaterial } from '../../models/Program/IMaterial';

interface MaterialsProps {
    homework?: boolean;
    selectHomeWork?: (value: {_id: string, position: string, seq: number}) => void;
    setActive?: (bool: boolean) => void;
    testlesson: boolean;
}

const Materials: FC<MaterialsProps> = ({homework, selectHomeWork, setActive, testlesson}) => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [modal, setModal] = useState<boolean>(false);
    const [modal2, setModal2] = useState<boolean>(false);
    const [modal3, setModal3] = useState<boolean>(false);
    const [materialId, setMaterialId] = useState<string>('');
    const [eModal, setEModal] = useState<boolean>(false);
    const [modalError, setModalError] = useState<string>('');
    const { materials, theme } = useAppSelector(state=> state.ProgramSlice);
    const { user } = useAppSelector(state=> state.UserSlice);
    const [selMaterials, setSelMaterials] = useState<Array<string>>([]);
    const [selAll, setSelAll] = useState<boolean>(false);
    const [selOnLoad, setSelOnLoad] = useState<boolean>(false);
    const [material, setMaterial] = useState<IMaterial>()

    const selectMaterialHandler = (material_id: string) => {
        const nArr = selMaterials;
        if(nArr.includes(material_id)) {
            const tempArr = nArr.filter(item=> item !== material_id)
            setSelMaterials(tempArr);
            if(!homework) {
                void updateGroupHandler(tempArr);
            } else {
                selectHomeWorkHandler(material_id);
            }
        } else {
            nArr.push(material_id);
            setSelMaterials(oldState => [...oldState, ]);
            if(!homework) {
                void updateGroupHandler(nArr);
            } else {
                selectHomeWorkHandler(material_id);
            }
        }
    }

    const selectHomeWorkHandler = (material_id: string) => {
        if(selectHomeWork) {
            const itm = materials.find(material => material._id === material_id);
            if(itm) {
                selectHomeWork({_id: itm._id, position: itm.data.tags.FEN, seq: itm.seq});
            }
        }
    }
    const selectHandler = () => {
        if(selAll) {
            setSelAll(false);
            setSelMaterials([]);
        } else {
            setSelAll(true);
            const tmp = [] as Array<string>;
            materials.map(material=>{
                tmp.push(material._id);
                if(homework) {
                    selectHomeWork({_id: material._id, position: material.data.tags.FEN, seq: material.seq});
                }
            });
            setSelMaterials(tmp);
            if(!homework) {
                void updateGroupHandler(tmp);
            }
        }
        
    }
    
    const updateGroupHandler = async (data: Array<string>) => {
        if(groupId) {
            if(testlesson) {
                await TestLessonService.editGroup(groupId, {program: data} ).catch((e: AxiosError)=> {
                    const event = e.response?.data as ServerError;
                    setModalError(event.error)
                    setEModal(true);
                });
            } else {
                await GroupService.editGroup(groupId, {program: data} ).catch((e: AxiosError)=> {
                    const event = e.response?.data as ServerError;
                    setModalError(event.error)
                    setEModal(true);
                });
            }
            
        }
    }



    const selAllOnLoad = (e: boolean) => {
        setSelOnLoad(e);
        localStorage.setItem('selectMaterialsOnLoad', e.toString());
    }

    useEffect(() => {
        if(groupId && materials) {
            if(localStorage.getItem('selectMaterialsOnLoad') === 'true') {
                setSelOnLoad(true);
                const tmp = [] as Array<string>;
                materials.map(material=>{
                    tmp.push(material._id);
                });
                setSelMaterials(tmp);
            }
        }
    }, [groupId, materials])

    useEffect(() => {
        if(groupId) {
            const fetchData = async() => {
                if(testlesson) {
                    await TestLessonService.getGroup(groupId)
                    .then(result=> {
                        const tmp: Array<string> = [];
                        result.data.group.program.map(item=>{
                            tmp.push(item._id);
                            setSelMaterials(tmp);
                        })
                    })
                } else {
                    await GroupService.getGroup(groupId)
                    .then(result=> {
                        const tmp: Array<string> = [];
                        result.data.group.program.map(item=>{
                            tmp.push(item._id);
                            setSelMaterials(tmp);
                        })
                    })
                }
            }
            void fetchData();
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    
    const CustomPieceRenderer = (props, custom) => {
        const {square, squareWidth} = props;
        const tmp = [] as Array<string>
        console.log("---- props ---------", props)
        console.log("---- custom ---------", custom)
        custom.map(item=> {
            tmp.push(item.square);
        })
        return (
            <>
                {(tmp.includes(square))
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

    return (
        <div className='flex flex-col items-center'>
            {(theme && groupId) &&
                <div className='flex justify-between w-full mb-3'>
                    <Switch className='mr-2 border-none' label='Выделять все задачи при выборе темы' value={selOnLoad} onChange={selAllOnLoad}/>
                    <OutlineButton className='!py-2 my-2 max-2xl:my-1 !w-[250px] !text-base max-2xl:!text-sm' onClick={()=> selectHandler()}>{selAll ? 'Снять выделение' : 'Выделить все задачи'}</OutlineButton>
                </div>
            }
            <div className="mb-4 flex flex-wrap justify-start w-[775px] max-2xl:w-[540px] max-h-[calc(100vh-420px)] max-2xl:max-h-[calc(100vh-375px)] overflow-auto">
                    {materials.map(material=>
                        <div key={material._id} onClick={()=> groupId ? selectMaterialHandler(material._id) : null} className={["border-2 border-black mr-2 mb-2 basis-[calc(25%-12px)] max-2xl:basis-[calc(33.333%-12px)] relative before:absolute before:top-0 before:left-0 before:bg-transparent before:w-full before:h-full before:z-10 cursor-pointer", !groupId && '[&>button]:hover:flex'].join(' ')}>
                            {selMaterials.includes(material._id) &&
                                <div className="bg-black bg-opacity-50 absolute w-full h-full z-10 text-white flex justify-center items-center">Добавлено в урок</div>
                            }
                            {(theme && !groupId) &&
                                <>
                                    <button onClick={()=> {setMaterialId(material._id); setMaterial(material); setModal3(true)}} className="hidden absolute top-0 right-10 bg-white p-2 rounded-md shadow-lg text-blue-600 text-lg z-10 justify-center items-center" title='Remove'><AiOutlineEdit/></button>
                                    <button onClick={()=> {setMaterialId(material._id); setModal2(true)}} className="hidden absolute top-0 right-0 bg-white p-2 rounded-md shadow-lg text-red-600 text-lg z-10 justify-center items-center" title='Remove'><BsFillTrashFill/></button>
                                </>           
                            }
                            <Chessboard 
                                animationDuration={0}
                                position={material.data.tags.FEN}
                                customPieces={material.custom.length > 0 && {
                                    "bP": (props) => CustomPieceRenderer(props, material?.custom)
                                }}
                            />
                        </div>
                    )}
            </div>
            {((user.role === 'DIRECTOR' || user.role === 'ZDIRECTOR') && theme && !groupId) &&
                <OutlineButton className='py-1 !w-[400px] max-2xl:!py-2 max-2xl:!w-[380px]  !text-base' onClick={()=> setModal(true)}>Добавить материал</OutlineButton>
            }
            {(theme && groupId) &&
                <AuthErrorModal modal={eModal} setModal={setEModal} error={modalError}/>
            }
            <AddProgramMaterialModal theme_id={theme} modal={modal} setModal={setModal}/>
            
            {modal3 &&
                <AddProgramMaterialModal material={material} edit={true} theme_id={theme} modal={modal3} setModal={setModal3}/>
            }

            {(theme && !groupId && modal2) &&
                <RemoveMaterialModal modal={modal2} setModal={setModal2} material_id={materialId}/>
            }
        </div>
    )
}

export default Materials;