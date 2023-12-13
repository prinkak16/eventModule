import React, {useEffect, useState} from 'react';
import {useParams,useNavigate} from "react-router-dom";
import {ApiClient} from "../../../../services/RestServices/BaseRestServices";
import EventDetailsCard from './event-details-card/EventDetailsCard'
import {Button} from "@mui/material";
import {useLocation} from "react-router";
import './event-details.scss'

const EventDetails=()=>{
    const {pathname}=useLocation();
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

    }

    useEffect(() => {  
        getEventDetails();
    }, [pathname]);

    const handleClick=()=>{
        navigate(`/events/create/${id}`);
    }
    
    return(
        <div className={"event-details-main-container"}>
            <div className={"heading"}>Event Details</div>
            <EventDetailsCard event={parentEvent} />
            <div className={"add-event-button-container"}>
                {!isChildEvent&&<Button onClick={handleClick} className={"add-event-button"} variant={"contained"}>+ Add Sub Event</Button>}

            </div>
            <div className={"heading"}>Sub Events</div>
            {childEvents?.length===0&&<h4>No sub event is created</h4>}
            {childEvents?.length>0&&childEvents?.map((childEvent,index)=><EventDetailsCard event={childEvent} key={index} />)}
            
        </div>
    )
}

export default EventDetails;