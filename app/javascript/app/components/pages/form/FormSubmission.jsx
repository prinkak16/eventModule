import React from 'react'
import {useParams} from "react-router";
import {useEffect,useState} from "react";
import {ApiClient} from "../../../services/RestServices/BaseRestServices";
import './form-event-submission.scss'
import {Box, Paper} from "@mui/material";
import {DefaultImage} from '../../../assests/png'
import EventSubmissionCard from "./EventSubmissionCard";
import Loader from "react-js-loader";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const FormSubmission = () => {
    const [eventDetails,setEventDetails]  =useState({})
    const [eventSubmissionsData,setEventsubmissionsData]=useState([]);
    const [isLoading,setIsLoading]                         =useState(false)  ;

    const {event_id}=useParams();

    useEffect(() => {
        (async ()=>{
            setIsLoading(true)
            try{
                const {data}=await  ApiClient.get(`/user/submissions/${event_id}`);
                if(data?.success){
                    setEventDetails(data?.data?.events[0]??{})
                    setEventsubmissionsData(data?.data?.submissions)
                    setIsLoading(false)

                }
            }
            catch (error) {
                setIsLoading(false)
                                console.log(error)
            }
           
        })()  ;

    }, []);

    useEffect(() => {
        console.log('events are ',eventDetails)
    }, [eventDetails]);
    const editEventSubmissionHandler=()=>{

    }
    const reportEventHandler=async ()=>{
        setIsLoading(true)
        try{
            const {data}=await ApiClient.get(`user/submit_event/${event_id}`);
            console.log('data',data);
            if(data?.success){
                setIsLoading(false)
                window.location.href=data?.data?.redirect_url;
            }

        }
           catch (e) {
            setIsLoading(false)
               console.log(error)
           }
        
    }
  return (
    <Box className="form-event-submission-container" component={Paper}>
        {isLoading&&  <Loader
            type="bubble-ping"
            bgColor={"#FFFFFF"}
            title="Loading.."
            color={"#FFFFFF"}
            size={100}
        />}
        {!isLoading&&   <>
        <div className="event-name-heading-container">
            {/*     <div className="back-button">
                 <ArrowBackIcon/>
            </div>
           */ }

            <h2 className="event-name-heading">{eventDetails?.name} </h2>
        </div>
        <img src={eventDetails?.image_url?eventDetails?.image_url:DefaultImage}  className="event-image"  />
         <div className="form-event-submissions">
             {eventSubmissionsData?.length===0&&<h2>No Event is submitted yet</h2>}
             {eventSubmissionsData.length>0&&<div className="event-total-report">Total Reported : {eventSubmissionsData.length}</div>}
             {eventSubmissionsData?.map((item,index)=><EventSubmissionCard index={index} data={item} key={index} event={eventDetails} setIsLoading={setIsLoading}/>)}
         </div>
        <div className="report-button-container">
            <button className="report-event-button" onClick={reportEventHandler}>Report Event</button>

        </div>
        </>
}
    </Box>
  )
}

export default FormSubmission
