import { useEffect, useState, useRef } from 'react'
import ChessboardArrows from '../../../utils/ChessboardArrows';
import "../../../utils/chessboard-arrows.css";


const Test = () => {
    const ref = useRef();
    useEffect(() => {
        ref.current = new ChessboardArrows()
        ref.current.ChessboardArrows('board_wrapper', 2, 'rgb(0, 104, 255)');   
    }, [])
    
    return (
        <div id='board_wrapper' className='w-[500px] h-[500px]'>
            <canvas id="primary_canvas" width="392" height="392" ></canvas>
            <canvas id="drawing_canvas"  width="392" height="392" ></canvas>
            <div className="board"></div>
        </div>
    )
}

export default Test;