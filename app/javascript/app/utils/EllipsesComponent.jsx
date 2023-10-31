import React from 'react';
import './Ellipsis.scss'


const EllipsesComponent=({text})=>{
    return(

        <div className="ellipsis">
            {text}
        </div>
    )   ;
}

export default EllipsesComponent;