import React, {createContext, useContext, useEffect, useState} from 'react';

//creating the context
const Event = createContext();

const EventContext = ({children}) => {
    const [eventName, setEventName] = useState(null);
    const [isSubmissionPage, setIsSubmissionPage] = useState(false);
    const [eventDeleteId, setEventDeleteId] = useState(-1);
    const [globalSelectedLanguage, setGlobalSelectedLanguage] = useState('en');

    useEffect(()=>{

    },[]);


    return (
        <Event.Provider value={{
            eventName,
            setEventName,
            isSubmissionPage,
            setIsSubmissionPage,
            globalSelectedLanguage,
            setGlobalSelectedLanguage
        }}>
            {children}
        </Event.Provider>
    )

}

export default EventContext;

//below code is same as , importing the context in every component then using it ,using useContext
export const EventState = () => {
    return useContext(Event);
}