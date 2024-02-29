import React from "react";

function FlagSVG(props:React.SVGProps<SVGSVGElement>) {

    return (
        <svg width="32" height="21" viewBox="0 0 32 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M0 4.3125C0 3.76022 0.447715 3.3125 1 3.3125H24.1429C24.6951 3.3125 25.1429 3.76022 25.1429 4.3125V17.5235C25.1429 18.0758 24.6951 18.5235 24.1429 18.5235H0.999999C0.447714 18.5235 0 18.0758 0 17.5235V4.3125Z"
                fill="currentColor"/>
            <path
                d="M31.5388 10.4365C31.7969 10.707 31.7969 11.1325 31.5388 11.403L24.9564 18.3005C24.5204 18.7574 23.75 18.4488 23.75 17.8172V4.02229C23.75 3.39074 24.5204 3.08213 24.9564 3.53902L31.5388 10.4365Z"
                fill="currentColor"/>
        </svg>
    );
}

export default FlagSVG;
