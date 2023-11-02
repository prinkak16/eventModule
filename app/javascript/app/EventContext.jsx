 import React from 'react';

import {createContext, useContext, useState} from "react";

//creating the context
const Event= createContext();

const EventContext=({children})=>{
    const [eventName,setEventName]=useState("");
    return(
        <Event.Provider value={{eventName,setEventName}}>
            {children}
        </Event.Provider>
    )

}

export default  EventContext;

//below code is same as , importing the context in every component then using it ,using useContext
export const EventState=()=>{
    return useContext(Event);
}