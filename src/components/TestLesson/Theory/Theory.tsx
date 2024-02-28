import { FC } from 'react'
import Title from '../../UI/Title';
import { IMaterial } from '../../../models/Program/IMaterial';
import {AiOutlineArrowDown} from '@react-icons/all-files/ai/AiOutlineArrowDown'
import {AiOutlineArrowUp} from '@react-icons/all-files/ai/AiOutlineArrowUp'
interface TheoryProps {
    theory: IMaterial;
    rightPanelMode: string,
    setRightPanelMode: (value: string) => void;
}

const Theory: FC<TheoryProps> = ({theory, rightPanelMode, setRightPanelMode}) => {
    return (
        <div className='flex flex-col'>
            <Title name='Теория'/>
            {(rightPanelMode === 'theory' || rightPanelMode === 'none') &&
                <div className="border-2 border-[#CCC] -mt-6 p-5 pt-8 rounded-b-2xl border-t-0 relative">
                    <div className={["flex flex-col overflow-auto", rightPanelMode !== 'theory' ? 'h-[200px] max-2xl:h-[150px]': 'h-[calc(100vh-500px)] max-2xl:h-[calc(100vh-350px)]'].join(' ')}>
                        {theory.data?.gameComment?.comment}
                        {theory.data.moves&&
                            theory.data.moves.length > 0 &&
                            theory.data.moves.map(move=>
                                <p>{move.commentAfter}</p>
                            )
                        }
                    </div>
                    <button onClick={() => setRightPanelMode(rightPanelMode === 'theory' ? 'none' : 'theory')} className="text-green-500 text-5xl absolute bottom-5 right-10">{rightPanelMode === 'theory' ? <AiOutlineArrowUp/> : <AiOutlineArrowDown/>}</button>
                </div>
            }
            
        </div>
    )
}

export default Theory;