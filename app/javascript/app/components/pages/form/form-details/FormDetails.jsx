import React, {useEffect, useState} from 'react';
import {ApiClient} from "../../../../services/RestServices/BaseRestServices";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import ReactLoader from "../../../shared/loader/Loader";
import FormEventCard from "../FormEventCard";
import {ImageNotFound} from "../../../../assests/png";
import './form-details.scss'


const FormDetails=()=>{
    const {id}=useParams();
    const [childrenEvents,setChildrenEvents]=useState([]);
    const [isLoading,setIsLoading]=useState(false);
    const [parentEvent,setParentEvent]=useState({});
    const getEventAndEventChildren=async ()=>{
        setIsLoading(true);
        try {
            const {data}=await  ApiClient.get(`event/user_children`,{params:{id}});
            if(data?.success){
                console.log('child of event and its data',data);
                setParentEvent(data?.data);
                setChildrenEvents(data?.child_data);
            }else{
                toast.error("Failed to get sub events");
            }

        }catch (e) {
            toast.error(e?.message);
        }


        setIsLoading(false);
    }

    useEffect(() => {
        console.log('parent event is ',parentEvent);
    }, [parentEvent]);

    useEffect(() => {
               getEventAndEventChildren();
    }, []);
    return(
        <div className={"form-event-details-main-container"}>
          
            {isLoading?<ReactLoader/>:childrenEvents?.length===0?<div>No sub event found</div>: <div>
                <div className="event-image-container">
                    <img src={parentEvent?.image_url ? parentEvent?.image_url : ImageNotFound}
                         className="event-image"/>

                </div>

                <div>Sub Events</div>
                <div>
                    {childrenEvents?.map((item) => <FormEventCard event={item}/>)}
                </div>
            </div>}


        </div>
    )
}

export default FormDetails;