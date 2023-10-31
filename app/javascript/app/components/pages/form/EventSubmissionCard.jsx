import React from "react";
import "./event-submission-card.scss";
import {ApiClient} from "../../../services/RestServices/BaseRestServices";
import {useParams} from "react-router";
import moment from "moment";
import {DeleteIcon, EditIcon} from "../../../assests/svg";
import {IconButton, Tooltip} from "@mui/material";
import EllipsesComponent from "../../../utils/EllipsesComponent";

const EventSubmissionCard = ({data,event,setIsLoading,index}) => {

  const eventEditHandler=async (event_id,submission_id) =>{
    setIsLoading(true)
    try{
      const {data}=await ApiClient.get(`/user/submit_event/${event_id}/${submission_id}`);
      if(data.success){
        window.location.href=data?.data?.redirect_url;

      }
    }
    catch (e) {
      setIsLoading(false)
         console.log(error)
    }


  }
  const deleteEventHandler=async ()=>{
    console.log('delte is called')

  }

  return(<div className="event-submission-card-container">
    <div className="event-submission-card-details">
      <div className="report-time"> {index+1}  &nbsp;  Reported on ({ moment(data?.created_at).format('DD/MM/YYYY') 
      }) {moment(data?.created_at).format('LT')
      }</div>
      <div className="event-name">{event?.name}</div>
      <div className="event-location">
          <div className="event-location-header">Location</div>
        <Tooltip title={event?.states}>
          <div className="event-location-data">
            <EllipsesComponent    text=
            {event?.states} /></div>

        </Tooltip>
      </div>



    </div>
    <div className="event-submission-card-action-icon">
      <div className="event-submission-card-action-icon-child">
        <Tooltip onClick={()=>eventEditHandler(data?.event_id,data?.submission_id)}>
          <IconButton>
            <EditIcon/>
          </IconButton>
        </Tooltip>
        <div>Edit</div>
      </div>

              <div className="event-submission-card-icon-child">
                <Tooltip onClick={()=>deleteEventHandler()}>
                  <IconButton>
                    <DeleteIcon/>
                  </IconButton>
                </Tooltip>
                <div>Delete</div>
              </div>


    </div>

  </div>
)
};

export default EventSubmissionCard;
