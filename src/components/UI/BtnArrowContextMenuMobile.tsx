import {FC, useState} from 'react'
import groupPNG from '../../assets/menu-icons/groups-black.png'
import groupflag from '../../assets/menu-icons/groupflag.png'
import star from '../../assets/menu-icons/star.png'
import chatArrowLeft  from '../../assets/menu-icons/chatArrowLeft.png'
import copy from '../../assets/menu-icons/copy.png'
import chatArrowRight from '../../assets/menu-icons/chatArrowRight.png'
import smaylik from '../../assets/menu-icons/smaylik.png'
import {IoIosArrowDown} from "@react-icons/all-files/io/IoIosArrowDown";

interface BTNProps {
    btnType: string;
}
const BtnArrowContextMenuMobile: FC<BTNProps> = ({btnType}) => {
    const [modal, setModal] = useState<boolean>(false)
    return (
      <div className='relative' onClick={()=>setModal(!modal)}>
          {btnType === "group" && <div className={`${modal ? " z-20 " : "hidden "} absolute z-10 top-0 left-0 w-full  bg-white rounded-3xl pt-2 border border-gray-400 pb-2`}>
              <div className='text-center active:bg-amber-300'>
                  <img src={groupPNG}/>
              </div>
              <div className='text-center active:bg-amber-300'>
                  <img className='pl-[4px] w-7' src={groupflag}/>
              </div>
              <div className='text-center active:bg-amber-300'>
                  <img src={star}/>
              </div>
          </div>}
          {btnType === "chat" && <div
              className={`${modal ? " z-20 " : "hidden "} absolute z-10 top-0 left-0 w-full  bg-white rounded-3xl pt-8 border border-gray-400 pb-1`}>
              <div className='text-center active:bg-amber-300 pt-1 border-t border-t-[#C4C4C4] p-1'>
                  <img className='' src={chatArrowLeft}/>
              </div>
              <div className='text-center active:bg-amber-300 pt-1 border-t border-t-[#C4C4C4] p-1'>
                  <img className='' src={copy}/>
              </div>
              <div className='text-center active:bg-amber-300 pt-1 border-t border-t-[#C4C4C4] p-1'>
                  <img className='' src={chatArrowRight}/>
              </div>
              <div className='text-center active:bg-amber-300 pt-1 border-t border-t-[#C4C4C4] p-1'>
                  <img className='' src={smaylik}/>
              </div>
          </div>}

          <div
              className={`${modal ? "bg-gradient-appricot z-30 " : " "} text-xl relative z-10 py-1  px-1 rounded-3xl hover:bg-gradient-appricot`}>
              <IoIosArrowDown />
          </div>
      </div>
    )
}

export default BtnArrowContextMenuMobile;
