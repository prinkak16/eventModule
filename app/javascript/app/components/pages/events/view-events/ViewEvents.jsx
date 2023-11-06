import React from 'react';
import {useEffect} from "react";
import {useParams} from "react-router";
import './view-event.scss'

const ViewEvents=()=>{
    const params=useParams();
    console.log('params is ',params)
    useEffect(() => {
        console.log('reached in view page ')
    }, []);
    return(
        <div className="view-event-container">
            <h1>Coming soon</h1>    
        </div>
    )
}

export default ViewEvents;