import React from 'react';
import {useEffect} from "react";

const ViewEvents=()=>{
    useEffect(() => {
        console.log('reached in view page ')
    }, []);
    return(
        <div>
            view events
        </div>
    )
}

export default ViewEvents;