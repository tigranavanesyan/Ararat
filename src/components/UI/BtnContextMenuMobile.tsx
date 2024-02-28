import {FC, useState} from 'react'
import groupPNG from '../../assets/menu-icons/groups-black.png'
import groupflag from '../../assets/menu-icons/groupflag.png'
import star from '../../assets/menu-icons/star.png'
import knopka from '../../assets/menu-icons/knopka.png'
import mute from '../../assets/menu-icons/mute.png'
import archiveFolder from '../../assets/menu-icons/archiveFolder.png'
import plus from '../../assets/menu-icons/plus.png'

interface BTNProps {
    btnType: string;
}
const BtnContextMenuMobile: FC<BTNProps> = ({btnType}) => {
    const [modal, setModal] = useState<boolean>(false)
    return (
      <div className='relative' onClick={()=>setModal(!modal)}>
          {btnType === "group" && <div className={`${modal ? " z-20 " : "hidden "} absolute z-10 top-0 left-0 w-full  bg-white rounded-3xl pt-12 border border-gray-400 pb-2`}>
              <div className='text-center active:bg-amber-300 border-t border-t-[#C4C4C4]'>
                  <img src={groupPNG}/>
              </div>
              <div className='text-center active:bg-amber-300 border-t border-t-[#C4C4C4]'>
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
  )
}

export default  BtnContextMenuMobile;
