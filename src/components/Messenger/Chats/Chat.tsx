import { FC } from 'react'
import { IChat  } from '../../../models/IChat';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import format from 'date-fns/format';
import { IContextChat } from '../../../models/IContext';
import { IoIosArrowDown } from '@react-icons/all-files/io/IoIosArrowDown'
import BtnContextMenuMobile from '../../UI/BtnContextMenuMobile.tsx'
import knopka from '../../../assets/menu-icons/knopka.png'
import mute1 from '../../../assets/menu-icons/mute1.png'

interface ChatProps {
    data: IChat;
    context: IContextChat;
    setContext: (obj: IContextChat) => void;
    type?: string;
}

const Chat: FC<ChatProps>= ({data, type, context, setContext}) => {
    const { userid } = useParams();
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        setContext({...context, active: true, x: e.clientX, y: e.clientY, chat_id: data._id, type: type});
    }
    return (
        <Link onContextMenu={e => handleClick(e)} to={'/messenger/chat/' + data._id}
              className={['[&>.arr-menu]:hover:flex p-5 flex w-full items-center relative hover:bg-amber-50 xl:hover:bg-gray-700 border-y-2 border-white xl:border-none ', userid === data._id ? 'bg-gray-700' : null].join(' ')}>
            <div
                className={['w-12 h-12 min-w-[48px] mr-3 relative ', data.isOnline ? 'before:absolute before:w-4 before:h-4 before:bg-green-400 before:rounded-full before:bottom-0 before:right-0 before:border-[3px] before:border-gray-800' : null].join(' ')}>
                <img className='rounded-full bg-black w-[inherit] h-[inherit]' src={data.avatar} alt="avatar"/>
            </div>
            <div className="flex flex-col items-start overflow-hidden">
                <h2 className='relative text-black xl:text-white font-medium mb-1 max-w-[100%] xl:max-w-[240px] pr-10'>{data.name + ' ' + data.sname}
                    <span className='absolute xl:hidden right-0  top-0 text-green-400'>
                        <svg width="32" height="21" viewBox="0 0 32 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0 4.3125C0 3.76022 0.447715 3.3125 1 3.3125H24.1429C24.6951 3.3125 25.1429 3.76022 25.1429 4.3125V17.5235C25.1429 18.0758 24.6951 18.5235 24.1429 18.5235H0.999999C0.447714 18.5235 0 18.0758 0 17.5235V4.3125Z"
                            fill="currentColor"/>
                        <path
                            d="M31.5388 10.4365C31.7969 10.707 31.7969 11.1325 31.5388 11.403L24.9564 18.3005C24.5204 18.7574 23.75 18.4488 23.75 17.8172V4.02229C23.75 3.39074 24.5204 3.08213 24.9564 3.53902L31.5388 10.4365Z"
                            fill="currentColor"/>
                        </svg>
                    </span>
                </h2>
                {data.lastmsg &&
                    <p className='text-gray-500 text-sm max-w-[270px] pr-5 whitespace-nowrap overflow-hidden text-ellipsis'>{data.lastmsg.msg}</p>
                }
            </div>
            {data.lastmsg &&
                <span
                    className="hidden xl:inline text-sm text-gray-500 absolute right-2 top-4">{format(new Date(data.lastmsg.time), 'H:mm')}</span>
            }
            {data.unreaded > 0 &&
                <span
                    className='bg-apricot rounded-full text-sm flex items-center justify-center min-w-[20px] text-gray-800 font-semibold h-5 absolute bottom-[22px] right-4'>{data.unreaded}</span>
            }

            <div className='arr-menu xl:hidden flex align-middle gap-3 ml-auto xl:absolute right-4 bottom-8 text-xl'
                 onClick={e => handleClick(e)}>
                <div className='hidden xl:block'><IoIosArrowDown/></div>
                <div className='flex align-middle gap-2 xl:hidden'>
                    {true ? <img className=' w-8 h-10 pt-2 hover:scale-110' src={mute1} alt='звук'/> : ""}
                    {true ? <img className=' w-8 h-10 pt-2 hover:scale-110' src={knopka} alt='кнопка'/> : ""}
                    {true ? <div className=' w-8 h-8 my-2 hover:scale-110 bg-green-500 rounded-full flex justify-center align-middle text-white'>3</div> : ""}
                </div>
                <div className='xl:hidden block h-full'>

                    <BtnContextMenuMobile btnType={"chat"}/>
                </div>
            </div>
        </Link>
    )
}

export default Chat;