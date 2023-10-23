import React from 'react'
import {useParams} from "react-router";
import {useEffect,useState} from "react";
import {ApiClient} from "../../../services/RestServices/BaseRestServices";
import './form-event-submission.scss'
import {Box, Paper} from "@mui/material";
import {DefaultImage} from '../../../assests/png'
import EventSubmissionCard from "./EventSubmissionCard";
const FormSubmission = () => {
    const [eventDetails,setEventDetails]  =useState({})
    const [eventSubmissionsData,setEventsubmissionsData]=useState([]);

    const {event_id}=useParams();

    useEffect(() => {
        (async ()=>{
            const {data}=await  ApiClient.get(`/user/submissions/${event_id}`);
            if(data?.success){
                setEventDetails(data?.data?.events[0]??{})
                setEventsubmissionsData(data?.data?.submissions)
            }
        })()  ;

    }, []);

    useEffect(() => {
        console.log('events are ',eventDetails)
    }, [eventDetails]);
    const editEventSubmissionHandler=()=>{

    }
    const reportEventHandler=async ()=>{
        const {data}=await ApiClient.get(`user/submit_event/${event_id}`);
        console.log('data',data);
        if(data?.success){
            window.location.href=data?.data?.redirect_url;
        }
        
    }
  return (
    <Box className="form-event-submission-container" component={Paper}>
        <div className="event-name-heading">
            <h2>{eventDetails?.name} </h2>
        </div>
        <img src={eventDetails?.image_url?eventDetails?.image_url:DefaultImage}  className="event-image"  />
         <div className="form-event-submissions">
             {eventSubmissionsData?.length===0&&<h2>No Event is submitted yet</h2>}
             <div className="event-total-report">Total Reported : {eventSubmissionsData.length}</div>
             {eventSubmissionsData?.map((item,index)=><EventSubmissionCard data={item} key={index} event={eventDetails}/>)}
         </div>
        <div className="report-button-container">
            <button className="report-event-button" onClick={reportEventHandler}>Report Event</button>

        </div>

    </Box>
  )
}

export default FormSubmission
