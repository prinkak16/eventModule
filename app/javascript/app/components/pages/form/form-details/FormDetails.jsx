import React, {useEffect, useState} from 'react';
import {ApiClient} from "../../../../services/RestServices/BaseRestServices";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import ReactLoader from "../../../shared/loader/Loader";
import FormEventCard from "../FormEventCard";
import {ImageNotFound} from "../../../../assests/png";
import './form-details.scss'
import FormSubmission from "../FormSubmission";
import FormEventMobileCard from "../mobile_view/FormEventMobileCard";


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
                setParentEvent(data?.data);
                setChildrenEvents(data?.child_data);
                window.scrollTo({top: 0});

            }else{
                toast.error("Failed to get sub events");
            }

        }catch (e) {
            toast.error(e?.message);
        }


        setIsLoading(false);
    }

  
    useEffect(() => {
               getEventAndEventChildren();
    }, [id]);
    return(
        <div className={"form-event-details-main-container"}>
          
            {isLoading?<ReactLoader/>:!parentEvent?.has_sub_event?<FormSubmission/>: <div className={"form-event-details-inner-container"}>
                <div className="event-image-container">
                    <img src={parentEvent?.image_url ? parentEvent?.image_url : ImageNotFound}
                         className="event-image"/>
                </div>

                <h5>Sub Events</h5>
                <div className={"child-card-container"}>

                    {childrenEvents?.length===0&&<h4>No Sub event found</h4>}
                    {childrenEvents?.map((item,index) => {
                        if (innerWidth > 450) {
                            return <FormEventCard event={item} key={index}/>
                        } else {
                            return <FormEventMobileCard event={item} key={index}/>
                        }
                    })}
                </div>
            </div>}


        </div>
    )
}

export default FormDetails;