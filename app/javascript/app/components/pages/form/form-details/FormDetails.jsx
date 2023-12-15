import React, {useEffect, useState} from 'react';
import {ApiClient} from "../../../../services/RestServices/BaseRestServices";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import ReactLoader from "../../../shared/loader/Loader";
import FormEventCard from "../FormEventCard";


const FormDetails=()=>{
    const {id}=useParams();
    const [childrenEvents,setChildrenEvents]=useState([]);
    const [isLoading,setIsLoading]=useState(false);
    const getEventAndEventChildren=async ()=>{
        setIsLoading(true);
        try {
            const {data}=await  ApiClient.get(`event/user_children`,{params:{id}});
            if(data?.success){
                console.log('child of event and its data',data);
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
               getEventAndEventChildren();
    }, []);
    return(
        <>
          
            {isLoading?<ReactLoader/>:childrenEvents?.length===0?<div>No sub event found</div>: <div>
                <div>Sub Events</div>
                <div>
                    {childrenEvents?.map((item) => <FormEventCard event={item}/>)}
                </div>
            </div>}


        </>
    )
}

export default FormDetails;