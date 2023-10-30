import React from 'react'
import './form-event-mobile-card.scss'
import {DefaultImage} from '../../../../assests/png/index'
import {LocationIcon}  from '../../../../assests/svg/index'
import moment from "moment";
import EllipsesComponent from "../../../../utils/EllipsesComponent";
import Tooltip from "@mui/material/Tooltip";
const FormEventMobileCard=({event,index})=>{

    return(
        <div className="form-event-mobile-card-container">
            <div className="background-image-container">
                <img src={event?.image_url ? event?.image_url:DefaultImage} alt="loading..." className="background-image"/>
            </div>
            <div className="form-event-mobile-card">
                  <div className="form-event-name-location-container">
                      <Tooltip title={event?.name}>

                          <div className="event-name">
                              <EllipsesComponent text={event?.name} />

                          </div>

                      </Tooltip>
                      <Tooltip title={event?.states}>

                      <div className="states-name" style={{display:"flex",maxWidth:"45%"}}>
                          <div>
                              <LocationIcon/>

                          </div>
                          <EllipsesComponent text={event?.states}/>
                      </div>
                      </Tooltip>
                  </div>
                <div className="form-event-level-date-time-container">
                    <div style={{flexGrow:5,display:"flex"}}>
                        <div className="form-event-level-container">
                            <span style={{color:"#FF9559"}} className="data">
                                <EllipsesComponent text={event?.data_level}/>
                            </span>


                            <span className="title">Level</span>


                        </div>
                        <div className="form-event-date-container">
                            <span className="data">{moment(event?.start_date).format("MMM Do YY")}</span>

                            <span className="title">Date</span>

                        </div>
                        <div className="form-event-time-container">



                                <EllipsesComponent text={moment(event?.start_datetime,"YY-MM-DD hh:mm:ss A").format('h:mm a')} /> 



                            <span className="title">Time</span>
                        </div>
                    </div>


                        <div className={event?.status?.class_name} style={{margin:0}}>
                            {event?.status?.name}
                        </div>

                </div>
            </div>
           
        </div>
    )
}

export default FormEventMobileCard;