import React from "react";
import "./event-submission-card.scss";
import {ApiClient} from "../../../services/RestServices/BaseRestServices";
import {useParams} from "react-router";
import moment from "moment";
import {DeleteIcon, EditIcon} from "../../../assests/svg";
import {IconButton, Tooltip} from "@mui/material";

const EventSubmissionCard = ({data,event}) => {

  const eventEditHandler=async (event_id,submission_id) =>{
    console.log('edit is called')
    const {data}=await ApiClient.get(`/user/submit_event/${event_id}/${submission_id}`);
    if(data.success){
      window.location.href=data?.data?.redirect_url;
    }

  }
  const deleteEventHandler=async ()=>{
    console.log('delte is called')

  }

  return(<div className="event-submission-card-container">
    <div className="event-submission-card-details">
      <div className="report-time">Reported on ({ moment(data?.created_at).add(10, 'days').calendar()}) {moment(data?.created_at).format('LT')
      }</div>
      <div className="event-name">{event?.name}</div>
      <div className="event-location">
          <div className="event-location-header">Location</div>
        <div className="event-location-data">{event?.states}</div>
      </div>



    </div>
    <div className="event-submission-card-icon">
      <div>
        <Tooltip onClick={()=>eventEditHandler(data?.event_id,data?.submission_id)}>
          <IconButton>
            <EditIcon/>
          </IconButton>
        </Tooltip>
        <div>Edit</div>
      </div>

              <div>
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
