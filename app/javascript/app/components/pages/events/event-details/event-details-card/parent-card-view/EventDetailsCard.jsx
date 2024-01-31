import React from "react";
import "./event-details-card.scss";
import {motion} from "framer-motion";

import {
    CalenderIcon,
    ClockIcon,
    IntermediateEventIcon,
    LeafEventIcon,
    LocationIcon,
    PrimaryEventIcon
} from "../../../../../../assests/svg";
import moment from "moment";
import {ImageNotFound} from "../../../../../../assests/png"
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";


const EventDetailsCard = ({event}) => {
    const {id} = useParams();

    const navigate = useNavigate();

    const submissionHandler = (event_id, event_status) => {
        if (String(id) === String(event_id)) {
            navigate(`/events/edit/${event_id}`);
        } else {
            navigate(`/events/${event_id}`);
        }

    };


    const RenderEventIcon = (event_level) => {
        if (event_level?.toLowerCase() === 'parent') {
            return <span className={"event-details-primary-icon-container"}><PrimaryEventIcon/></span>
        } else if (event_level?.toLowerCase() === 'intermediate') {
            return <span className={"event-details-intermediate-icon-container"}><IntermediateEventIcon/></span>
        } else {
            return <span className={"event-details-leaf-icon-container"}><LeafEventIcon/></span>
        }

    }


    const zoomVariants = {
        initial: {scale: 1},
        hover: {scale: 1.02},
    };


    return (

        <motion.div
            variants={zoomVariants}
            initial="initial"
            whileHover="hover"
            className="event-details-list-card"
            onClick={() => submissionHandler(event?.id, event?.status?.name?.toLowerCase())}
        >

            <div className="event-details-list-first-part">
                <img
                    className="event-photo"
                    src={event?.image_url ? event?.image_url : ImageNotFound}
                />
            </div>
            <div className="event-details-list-sec-part">
                <div className="list-name">
                    <div className="green-line"></div>
                    <div className="level-event-container">
                        <div>
                            <span style={{color: " #66666699"}}>Level : </span>
                            <span style={{color: "#FF9559"}}>{event?.data_level}</span>
                        </div>

                        <div className="heading">
                            {event?.name}

                        </div>
                    </div>
                </div>

                <div className="event-details-date-time-location-container">
                    <div className="date-time-location-inner-container">
                        <CalenderIcon className="svg-icon"/>
                        <span>
              {moment(event?.start_date).format("DD MMMM YYYY")} -
                            {moment(event?.end_date).format("Do MMMM YYYY")}
            </span>
                    </div>
                    <div className="date-time-location-inner-container">
                        <ClockIcon className="svg-icon"/>
                        <span>
              {moment(event?.start_datetime, "YY-MM-DD hh:mm:ss A").format(
                  "hh:mm a"
              )}
                            -
                            {moment(event?.end_datetime, "YY-MM-DD hh:mm:ss A").format(
                                "hh:mm a"
                            )}
            </span>
                    </div>
                    <div className="date-time-location-inner-container">
                        <LocationIcon className="svg-icon"/>
                        <span>{event?.states}</span>
                    </div>
                </div>
            </div>

            <div className="event-details-list-third-part">
                <div className={`${event?.status?.class_name} active-button-style`}>
                    <span>{event?.status?.name}</span>
                </div>
                <div>{RenderEventIcon(event?.event_level)}</div>

            </div>
        </motion.div>


    )

};

export default EventDetailsCard;
