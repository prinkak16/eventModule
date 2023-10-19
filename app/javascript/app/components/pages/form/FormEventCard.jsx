import React from "react";
import "./form.module.scss";
import { CalenderIcon, ClockIcon, LocationIcon } from "../../../assests/svg";
import moment from "moment";

const imgDefault =
  "https://storage.googleapis.com/public-saral/public_document/upload-img.jpg";
const nextBtn =
  "https://storage.googleapis.com/public-saral/public_document/button.png";

const FormEventCard = ({ event }) => {
  return (
    <div
      className="form-list-card  cursor"
      onClick={() => tabClickHandler(event?.id)}
    >
      <div className="form-list-fir ">
        <img
          className="event-photo"
          src={event.image_url ? event.image_url : imgDefault}
        />
      </div>
      <div className="form-list-sec">
        <div className="list-name">
          <div className="green-line"></div>
          <div className="level-event-container">
            <div>
              <span style={{ color: " #66666699" }}>Level : </span>
              <span style={{ color: "#FF9559" }}>{event.data_level}</span>
            </div>
            <h2 className="heading">{event.name}</h2>
          </div>
        </div>
        <div className="date-time-location-container">
          <div>
            <CalenderIcon className="svg-icon" />
            <span>
              {moment(event?.start_time).format("Do MMMM  YYYY")} -
              {moment(event?.end_time).format("Do MMMM  YYYY")}
            </span>
          </div>
          <div>
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
          <div>
            <LocationIcon className="svg-icon" />
          </div>
        </div>
      </div>
      <div className="form-list-third">
        <div className={event.status.class_name}>
          <span>{event.status.name}</span>
        </div>
      </div>
    </div>
  );
};

export default FormEventCard;
