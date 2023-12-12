import React from 'react'
import Loader from "react-js-loader";


const ReactLoader=()=>{
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

export  default  ReactLoader;