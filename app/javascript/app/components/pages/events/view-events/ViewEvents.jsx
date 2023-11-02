import React from 'react';
import {useEffect} from "react";
import {useParams} from "react-router";

const ViewEvents=()=>{
    const params=useParams();
    console.log('params is ',params)
    useEffect(() => {
        console.log('reached in view page ')
    }, []);
    return(
        <div className="view-event-container">
            view events
        </div>
    )
}

export default ViewEvents;