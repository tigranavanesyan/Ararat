import {FC, useState} from 'react'
import groupPNG from '../../assets/menu-icons/groups-black.png'
import groupflag from '../../assets/menu-icons/groupflag.png'
import star from '../../assets/menu-icons/star.png'
import knopka from '../../assets/menu-icons/knopka.png'
import mute from '../../assets/menu-icons/mute.png'
import archiveFolder from '../../assets/menu-icons/archiveFolder.png'
import plus from '../../assets/menu-icons/plus.png'
import smile from '../../assets/menu-icons/smaylik.png'
import FlagSVG from '../../assets/menu-icons/FlagSVG.tsx'

interface BTNProps {
    btnType: string;
}
const BtnContextMenuMobile: FC<BTNProps> = ({btnType}) => {
    const [modal, setModal] = useState<boolean>(false)
    const [addGroupModal, setAddGroupModal] = useState<boolean>(false)
    const [addGroupModal2, setAddGroupModal2] = useState<boolean>(false)
    const [addGroupModal3, setAddGroupModal3] = useState<boolean>(false)
    return (
        <>
            {btnType === "group" && <div
                className={`${addGroupModal || addGroupModal2 ? " z-20 " : "hidden "}  flex justify-center align-middle absolute h-full top-0 left-0 bg-gray-500/50  w-full`}>
                <div
                    className='rounded-2xl relative flex flex-col w-[80%]  align-middle justify-center self-center border-2 border-gray-400 bg-white p-8'>
                    <span onClick={() => setAddGroupModal(false)}
                          className=' absolute top-4 right-4 cursor-pointer text-red-400 p-2'>X</span>
                    <div className='text-[rgb(53, 53, 53) text-xl text-center mb-3'>Создать анонимную группу</div>
                    <div className='flex flex-col gap-3'>
                        <label>Название:</label>
                        <input type='text' className='outline-none border rounded-[50px] px-3 py-1 border-gray-400'/>
                        <label>Описание:</label>
                        <input type='text' className='outline-none border rounded-[50px] px-3 py-1  border-gray-400'/>
                        <button
                                className='bg-black text-white p-2 rounded-[50px]'>
                            Создать группу
                        </button>
                    </div>
                    <div
                        className={`${addGroupModal2 ? " z-20 " : "hidden "}  flex justify-center align-middle absolute h-full top-0 left-0 bg-gray-500/50  w-full`}>
                        <div
                            className='rounded-2xl relative flex flex-col w-full  align-middle justify-center self-center border-2 border-gray-400 bg-white p-8'>
                            <span onClick={() => setAddGroupModal2(false)}
                                  className=' absolute top-4 right-4 cursor-pointer text-red-400 p-2'>X</span>
                            <div className='text-[rgb(53, 53, 53) text-xl text-center mb-3'>Группа ярлыков</div>
                            <div className='flex flex-col gap-3'>
                                <div className='flex justify-between'>
                                    <div className='flex gap-2'>
                                        <div className='text-red-400'>
                                            <FlagSVG/>
                                        </div>
                                        <div>Группа ярлыков-1</div>
                                    </div>
                                    <input type='checkbox'/>
                                </div>
                                <div className='flex justify-between'>
                                    <div className='flex gap-2'>
                                        <div className='text-green-400'>
                                            <FlagSVG/>
                                        </div>
                                        <div>Группа ярлыков-2</div>
                                    </div>
                                    <input type='checkbox'/>
                                </div>
                                <div className='flex justify-between'>
                                    <div className='flex gap-2'>
                                        <div className='text-yellow-400'>
                                            <FlagSVG/>
                                        </div>
                                        <div>Группа ярлыков-3</div>
                                    </div>
                                    <input type='checkbox' checked/>
                                </div>
                                <div className='flex justify-between'>
                                    <div className='flex gap-2'>
                                        <div className='text-blue-400'>
                                            <FlagSVG/>
                                        </div>
                                        <div>Группа ярлыков-4</div>
                                    </div>
                                    <input type='checkbox'/>
                                </div>
                                <div className='flex justify-between'>
                                    <div className='flex gap-2 align-middle cursor-pointer' onClick={() => setAddGroupModal3(true)}>
                                        <div className='w-6 bg-gradient-silver rounded-full p-1 flex align-middle'>
                                            <img className='w-full pt-1' src={plus} alt='icon'/>
                                        </div>
                                        <div>Новый ярлык</div>
                                    </div>
                                </div>
                                <div className='flex justify-between gap-2'>
                                    <button className='bg-gradient-menu text-white w-full rounded-full p-2'>
                                        Отмена
                                    </button>
                                    <button className='bg-gradient-appricot w-full rounded-full p-2'>
                                        Сохранить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`${addGroupModal3 ? " z-20 " : "hidden "}  flex justify-center align-middle absolute h-full top-0 left-0 bg-gray-500/50  w-full`}>
                        <div
                            className='rounded-2xl relative flex flex-col w-[80%]  align-middle justify-center self-center border-2 border-gray-400 bg-white p-8'>
                            <span onClick={() => setAddGroupModal3(false)}
                                  className=' absolute top-4 right-4 cursor-pointer text-red-400 p-2'>X</span>
                            <div className='text-[rgb(53, 53, 53) text-xl text-center mb-3'>Добавить новый ярлык</div>
                            <div className='flex flex-col gap-3'>
                                <div className='flex justify-between gap-2 align-middle'>
                                    <div className='text-[#FF00C7]'>
                                        <FlagSVG width={50} height={40} color='#FF00C7'/>
                                    </div>
                                    <input type='text' className='w-full outline-none border-[#cccccc] border-b-2' placeholder='Новый ярлык'/>
                                    <img src={smile} alt='smile'/>
                                </div>
                                <div className='flex justify-between gap-2'>
                                    <button className='bg-gradient-menu text-white w-full rounded-full p-2'>
                                        Отмена
                                    </button>
                                    <button className='bg-gradient-appricot w-full rounded-full p-2'>
                                        Сохранить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            <div className='relative' onClick={() => setModal(!modal)}>
                {btnType === "group" && <div
                    className={`${modal ? " z-20 " : "hidden "} absolute z-10 top-0 left-0 w-full  bg-white rounded-3xl pt-12 border border-gray-400 pb-2`}>
                    <div onClick={() => setAddGroupModal(true)}
                         className='text-center active:bg-amber-300 border-t border-t-[#C4C4C4]'>
                        <img src={groupPNG}/>
                    </div>
                    <div  onClick={() => setAddGroupModal2(true)} className='text-center active:bg-amber-300 border-t border-t-[#C4C4C4]'>
                        <img className='pl-[4px] w-7' src={groupflag}/>
                    </div>
                    <div className='text-center active:bg-amber-300 border-t border-t-[#C4C4C4]'>
                        <img src={star}/>
                    </div>
                </div>}
                {btnType === "chat" && <div
                    className={`${modal ? " z-20 " : "hidden "} absolute z-10 top-0 left-0 w-full  bg-white rounded-3xl pt-12 border border-gray-400 pb-2`}>
                    <div className='text-center active:bg-amber-300 pt-1 border-t border-t-[#C4C4C4]'>
                        <img className='pl-[4px] w-7' src={groupflag}/>
                    </div>
                    <div className='text-center active:bg-amber-300 pt-1 border-t border-t-[#C4C4C4]'>
                        <img className='' src={knopka}/>
                    </div>
                    <div className='text-center active:bg-amber-300 pt-1 border-t border-t-[#C4C4C4]'>
                        <img className='' src={mute}/>
                    </div>
                    <div className='text-center active:bg-amber-300 pt-1 border-t border-t-[#C4C4C4]'>
                        <img className='' src={archiveFolder}/>
                    </div>
                    <div className='text-center active:bg-amber-300 pt-1 border-t border-t-[#C4C4C4]'>
                        <img className='' src={plus}/>
                    </div>
                </div>}

                <div
                    className={`${modal ? "bg-gradient-appricot z-30 " : " "} relative z-10 flex flex-col gap-1 justify-between align-middle py-2 px-3 rounded-3xl hover:bg-gradient-appricot`}>
                    <div className='w-2 h-2 rounded-full bg-black'></div>
                    <div className='w-2 h-2 rounded-full bg-black'></div>
                    <div className='w-2 h-2 rounded-full bg-black'></div>
                </div>
            </div>
        </>

    )
}

export default BtnContextMenuMobile;
