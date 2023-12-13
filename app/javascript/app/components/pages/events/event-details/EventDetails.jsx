import React, {useEffect, useState} from 'react';
import {useParams,useNavigate} from "react-router-dom";
import {ApiClient} from "../../../../services/RestServices/BaseRestServices";
import EventDetailsCard from './event-details-card/EventDetailsCard'
import {Button} from "@mui/material";

const EventDetails=()=>{
    const navigate=useNavigate();
    const [parentEvent,setParentEvent]=useState({});
    const [childEvents,setChildEVents]=useState([]);
    const [isChildEvent,setIsChildEvent]=useState(false)
    const {id}=useParams();

    const getEventDetails=async ()=>{
        const {data}=await  ApiClient.get('event/event_data',{params:{id}})
        setParentEvent(data?.data)
        setChildEVents(data?.child_data);
        setIsChildEvent(data?.is_child);
        console.log('event details ',data);
        
    }

    useEffect(() => {  
        getEventDetails();
    }, []);

    const handleClick=()=>{
        navigate(`/events/create/${id}`);
    }
    return(
        <>
            <EventDetailsCard event={parentEvent} />
            <Button onClick={handleClick}>+ Add Sub Event</Button>
            {childEvents?.length>0&&childEvents?.map((childEvent)=><EventDetailsCard event={childEvent}/>)}
            
        </>
    )
}

export default EventDetails;