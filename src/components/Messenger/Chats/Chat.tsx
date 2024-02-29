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
import FlagSVG from "../../../assets/menu-icons/FlagSVG.tsx";

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
              className={['[&>.arr-menu]:hover:flex p-2 xl:p-5 flex w-full items-center relative hover:bg-amber-50 xl:hover:bg-gray-700 border-y-2 border-white xl:border-none ', userid === data._id ? 'bg-gray-700' : null].join(' ')}>
            <div
                className={['w-12 h-12 min-w-[48px] mr-3 relative ', data.isOnline ? 'before:absolute before:w-4 before:h-4 before:bg-green-400 before:rounded-full before:bottom-0 before:right-0 before:border-[3px] before:border-gray-800' : null].join(' ')}>
                <img className='rounded-full bg-black w-[inherit] h-[inherit]' src={data.avatar} alt="avatar"/>
            </div>
            <div className="flex flex-col items-start overflow-hidden">
                <h2 className='relative text-black xl:text-white font-medium mb-1 max-w-[100%] xl:max-w-[240px] pr-10'>{data.name + ' ' + data.sname}
                    <span className='absolute xl:hidden right-0  top-0 text-green-400'>
                       <FlagSVG/>
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
                    className='bg-apricot hidden rounded-full text-sm xl:flex items-center justify-center min-w-[20px] text-gray-800 font-semibold h-5 absolute bottom-[22px] right-4'>{data.unreaded}</span>
            }

            <div className='arr-menu xl:hidden flex justify-end ml-auto pl-14 align-middle gap-3 xl:absolute right-4 bottom-8 text-xl'
                 onClick={e => handleClick(e)}>
                <div className='hidden xl:block'><IoIosArrowDown/></div>
                <div className='flex shrink-0 align-middle gap-2 xl:hidden'>
                    {true ? <img className=' w-8 h-10 pt-2 hover:scale-110' src={mute1} alt='звук'/> : ""}
                    {true ? <img className=' w-8 h-10 pt-2 hover:scale-110' src={knopka} alt='кнопка'/> : ""}
                    {data.unreaded ? <div className=' w-8 h-8 my-2 hover:scale-110 bg-green-500 rounded-full flex justify-center align-middle text-white'>{data.unreaded}</div> : ""}
                </div>
                <div className='xl:hidden block h-full'>

                    <BtnContextMenuMobile btnType={"chat"}/>
                </div>
            </div>
        </Link>
    )
}

export default Chat;