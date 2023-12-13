import React from "react";
import "./event-details-card.scss";
import { CalenderIcon, ClockIcon, LocationIcon } from "../../../../../assests/svg/index";
import moment from "moment";
import { ImageNotFound} from "../../../../../assests/png/index"
import { useNavigate } from "react-router";



const EventDetailsCard = ({ event }) => {
    console.log('event in event car is ',event);

    const navigate = useNavigate();
    const submissionHandler = (event_id) => {
        navigate(`/events/${event_id}`);
    };
    return (
        <div
            className="form-list-card"
            onClick={() => submissionHandler(event?.id)}
        >
            <div className="form-list-fir ">
                <img
                    className="form-photo"
                    src={event?.image_url ? event?.image_url : ImageNotFound}
                />
            </div>
            <div className="form-list-sec">
                <div className="list-name">
                    <div className="green-line"></div>
                    <div className="level-event-container">
                        <div>
                            <span style={{ color: " #66666699" }}>Level : </span>
                            <span style={{ color: "#FF9559" }}>{event?.data_level}</span>
                        </div>

                        <div className="heading">
                            {event?.name}

                        </div>
                    </div>
                </div>

                <div className="date-time-location-container">
                    <div className="date-time-location-inner-container">
                        <CalenderIcon className="svg-icon" />
                        <span>
              {moment(event?.start_date).format("DD MMMM YYYY")} -
                            {moment(event?.end_date).format("Do MMMM YYYY")}
            </span>
                    </div>
                    <div className="date-time-location-inner-container">
                        <ClockIcon className="svg-icon" />
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
                        <LocationIcon className="svg-icon" />
                        <span>{event?.states}</span>
                    </div>
                </div>
            </div>

            <div className="form-list-third">
                <div className={event?.status?.class_name}>
                    <span>{event?.status?.name}</span>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsCard;
