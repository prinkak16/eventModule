import React from "react";
import "./form.module.scss";
import { CalenderIcon, ClockIcon, LocationIcon } from "../../../assests/svg";
import moment from "moment";
import { DefaultImage } from "../../../assests/png"
import { useNavigate } from "react-router";
import EllipsesComponent from "../../../utils/EllipsesComponent";
const imgDefault =
  "https://storage.googleapis.com/public-saral/public_document/upload-img.jpg";
const nextBtn =
  "https://storage.googleapis.com/public-saral/public_document/button.png";


const FormEventCard = ({ event }) => {

  const navigate = useNavigate();
  const submissionHandler = (event_id) => {
    navigate(`/forms/submissions/${event_id}`);
  };
  return (
    <div
      className="form-list-card"
      onClick={() => submissionHandler(event?.id)}
    >
      <div className="form-list-fir ">
        <img
          className="form-photo"
          src={event.image_url ? event.image_url : DefaultImage}
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

            <h2 className="heading">
              <EllipsesComponent text= {event.name} />

             </h2>
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
        <div className={event.status.class_name}>
          <span>{event.status.name}</span>
        </div>
      </div>
    </div>
  );
};

export default FormEventCard;
