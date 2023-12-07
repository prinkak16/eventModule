import React from 'react'
import Loader from "react-js-loader";


const Loader=()=>{
    return(
            <Loader
                type="bubble-ping"
                bgColor={"#FFFFFF"}
                title="Loading.."
                color={"#FFFFFF"}
                size={100}
            />
    )
}

export  default  Loader;