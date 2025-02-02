import React, {useEffect} from "react";
import "./event-submission-card.scss";
import {ApiClient} from "../../../services/RestServices/BaseRestServices";
import moment from "moment";
import {DeleteIcon, EditIcon, LocationIcon} from "../../../assests/svg";
import {IconButton, Tooltip} from "@mui/material";
import EllipsesComponent from "../../../utils/EllipsesComponent";
import {Verified} from "@mui/icons-material";
import {useTranslation} from "react-i18next";

const EventSubmissionCard = ({
                                 data,
                                 event,
                                 setIsLoading,
                                 index,
                                 deleteEventHandler,
                                 setShowConfirmationModal,
                                 setEventDeleteId
                             }) => {
    const { t } = useTranslation();


    const eventEditHandler = async (event_id, submission_id) => {
        setIsLoading(true)
        try {
            const {data} = await ApiClient.get(`/user/submit_event/${event_id}/${submission_id}`);
            if (data.success) {
                window.location.href = data?.data?.redirect_url;
            }
        } catch (e) {
            setIsLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        setIsLoading(false);
    }, []);


    return (<div className="event-submission-card-container">
            <div className="event-submission-card-details">
                <div className="report-time-verified-icon-container">
                        <div className="report-time">
                            <div>
                                {index + 1}
                            </div>
                            <div>
                                <div>
                                    {t("Reported on")} :
                                    ({moment(data?.reported_on).format('DD/MM/YYYY')
                                })&nbsp;
                                    {moment(data?.reported_on).format('LT')
                                    }
                                </div>
                               <div className="report-time">  {t("Updated at")} :
                                        ({moment(data?.updated_on).format('DD/MM/YYYY')
                                        })&nbsp;
                                        {moment(data?.updated_on).format('LT')
                                        }
                                    </div>

                            </div>

                        </div>

                    {data?.status === "NA" ? null :
                        <div className="verified-icon-container">
                            <Verified className="verified-icon"
                                      style={{color: data?.status === "COMPLETED" ? "#61BE7A" : "grey"}}/>
                        </div>}
                </div>

                <div className="event-location">
                    <span className="event-location-icon-container"><LocationIcon className={"location-icon"}/></span>
                    <div className="event-location-data">{
                        data?.locations?.filter(Boolean)?.join(' , ')}
                    </div>
                </div>
                <div className="submission-image-group-container">
                    {data?.images.length > 0 && <span className={"photo-title"}>{t("Photos")}</span>}
                    <div
                        className="submission-image-container"> {data?.images.length > 0 && data?.images?.slice(0, 2).map((item) =>
                        <div><img src={item} alt="Loading..."
                                  className="submission-image"/></div>)}</div>


                </div>


            </div>
            {event?.status?.name?.toLowerCase() === 'active' &&
                <div className="event-submission-card-action-icon">
                    <div className="event-submission-card-action-icon-child" onClick={() =>
                        eventEditHandler(data?.event_id, data?.submission_id)
                    }>
                        <IconButton>
                            <EditIcon/>
                        </IconButton>
                        <div>{t("Edit")}</div>

                    </div>

                    <div className="event-submission-card-action-icon-child" onClick={() => {
                        setEventDeleteId(data?.id)
                        setShowConfirmationModal(true)
                    }}>
                        <IconButton>
                            <DeleteIcon/>
                        </IconButton>
                        <div>{t("Delete")}</div>

                    </div>


                </div>
            }

        </div>
    )
};

export default EventSubmissionCard;
