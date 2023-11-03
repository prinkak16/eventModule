import React from "react";
import "./event-submission-card.scss";
import {ApiClient} from "../../../services/RestServices/BaseRestServices";
import {useParams} from "react-router";
import moment from "moment";
import {DeleteIcon, EditIcon} from "../../../assests/svg";
import {IconButton, Tooltip} from "@mui/material";
import EllipsesComponent from "../../../utils/EllipsesComponent";
import {Verified} from "@mui/icons-material";

const EventSubmissionCard = ({data,event,setIsLoading,index,deleteEventHandler,setShowConfirmationModal,setEventDeleteId}) => {

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


  return(<div className="event-submission-card-container">
    <div className="event-submission-card-details">
        <div className="report-time-verified-icon-container">
            <div className="report-time"> {index+1}  &nbsp;  Reported on ({ moment(data?.reported_on).format('DD/MM/YYYY')
            }) {moment(data?.reported_on).format('LT')
            }</div>
            <div className="verified-icon-container">
                <Verified className="verified-icon" style={{color:data?.status==="COMPLETED"?"#61BE7A":"grey"}}/>
            </div>
        </div>

      <div className="event-name">
        <EllipsesComponent text=

        {event?.name}  />
      </div>
        <div className="event-location-image-group-container">
            <div className="event-location">
                <div className="event-location-header">Location:&nbsp;({event?.data_level})</div>
                <Tooltip title={data?.locations?.join(' , ')}>
                    <div className="event-location-data">
                        <EllipsesComponent    text=
                                                  {data?.locations?.join(' , ')} /></div>

                </Tooltip>
            </div>
            <div className="submission-image-group-container">
                {data?.images.length>0&&data?.images?.slice(0,2).map((item)=><div className="submission-image-container"> <img src={item} alt="Loading..." className="submission-image"/></div>)}
            </div>

        </div>





    </div>
         
    <div className="event-submission-card-action-icon">
      <div className="event-submission-card-action-icon-child" onClick={()=>
          eventEditHandler(data?.event_id, data?.submission_id)
      } >
          <IconButton>
            <EditIcon/>
          </IconButton>
          <div>Edit</div>

      </div>

              <div className="event-submission-card-action-icon-child" onClick={()=> {
                  setEventDeleteId(data?.id)
                  setShowConfirmationModal(true)
              }} >
                  <IconButton>
                    <DeleteIcon/>
                  </IconButton>
                  <div>Delete</div>

              </div>


    </div>

  </div>
)
};

export default EventSubmissionCard;
