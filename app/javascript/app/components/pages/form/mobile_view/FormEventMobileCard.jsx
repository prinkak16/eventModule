import React from 'react'
import './form-event-mobile-card.scss'
import {DefaultImage} from '../../../../assests/png/index'
import {LocationIcon} from '../../../../assests/svg/index'
import moment from "moment";
import EllipsesComponent from "../../../../utils/EllipsesComponent";
import Tooltip from "@mui/material/Tooltip";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";

const FormEventMobileCard = ({event, index}) => {
     const {t}=useTranslation();
    const navigate = useNavigate();

    const submissionHandler = (event_id) => {
        navigate(`/forms/${event_id}`);
    };

    return (
        <div className="form-event-mobile-card-container" onClick={() => submissionHandler(event?.id)}>
            <div className="background-image-container">
                <img src={event?.image_url ? event?.image_url : DefaultImage} alt="loading..."
                     className="background-image"/>
            </div>
            <div className="form-event-mobile-card">
                <div className="form-event-name-location-container">
                    <Tooltip title={event?.name}>

                        <div className="event-name">
                            <EllipsesComponent text={event?.name}/>

                        </div>

                    </Tooltip>
                </div>
                <div className="form-event-level-date-time-container">

                    <div className="form-event-level-container">
                            <span style={{color: "#FF9559"}} className="data">
                                <EllipsesComponent text={event?.data_level}/>
                            </span>


                        <span className="title">{t("Level")}</span>


                    </div>
                    <div className="form-event-date-container">
                            <span className="data">
                                <EllipsesComponent text=
                                                       {moment(event?.start_date).format("DD MMM YY")}
                                />
                            </span>
                        <span className="title">{t("Start Date")}</span>

                    </div>

                    <div className={event?.status?.class_name} style={{margin: 0}}>
                        {event?.status?.name}
                    </div>

                </div>
            </div>

        </div>
    )
}

export default FormEventMobileCard;