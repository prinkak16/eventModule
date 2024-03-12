import React, {useEffect, useMemo, useState} from 'react'
import {useLocation, useNavigate, useParams} from "react-router";
import {ApiClient} from "../../../services/RestServices/BaseRestServices";
import './form-event-submission.scss'
import {Box} from "@mui/material";
import {ImageNotFound} from '../../../assests/png'
import EventSubmissionCard from "./EventSubmissionCard";

import {EventState} from "../../../context/EventContext";
import ConfirmationModal from "../../shared/ConfirmationModal/ConfirmationModal";
import ReactLoader from "../../shared/loader/Loader";
import Button from "@mui/material/Button";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";


const FormSubmission = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [eventDetails, setEventDetails] = useState({});
    const [eventSubmissionsData, setEventsubmissionsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const {id} = useParams();
    const {setEventName, setIsSubmissionPage,globalSelectedLanguage} = EventState();
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [eventDeleteId, setEventDeleteId] = useState(-1);
    const [confirmationStatus, setConfirmationStatus] = useState(false);
    const [disableReportButton,setDisableReportButton]=useState(false);

    useMemo(() => {
        document.addEventListener("visibilitychange", function() {
            if (document.visibilityState === 'visible') {
               getUserSubmission();
            }
        });
    }, []);

    const getUserSubmission=async ()=>{
            setIsLoading(true)
            try {
                const {data} = await ApiClient.get(`/user/submissions/${id}`);
                if (data?.success) {
                    setEventDetails(data?.data?.events[0] ?? {})
                    setEventsubmissionsData(data?.data?.submissions)
                    if (data?.data?.events?.length > 0) {
                        setEventName(data?.data?.events[0]?.name);
                    }

                }

            } catch (error) {
                toast.error('Failed to get user submissions')
            }finally {
                setIsLoading(false);
            }


    }

    useEffect(() => {
         getUserSubmission();
        return () => {
            setIsLoading(false)
        }

    }, []);
    const reportEventHandler = async () => {
        setIsLoading(true)
        setDisableReportButton(true);
        try {
            const {data} = await ApiClient.get(`user/submit_event/${id}`);
            if (data?.success) {
                window.location.href = data?.data?.redirect_url;
                // setDisableReportButton(false)
            }

        } catch (e) {
            toast.error(e?.message);
            //will only enable the report button if api is failed
            setDisableReportButton(false);
            setIsLoading(false);

        }finally {
            // setIsLoading(false);
        }

    }

    const deleteEventHandler = async () => {
        try {
            const {data} = await ApiClient.get(`user/destroy/submission/${eventDeleteId}`);
            if (data?.success) {
                const filteredList = eventSubmissionsData?.filter((item) => item?.id !== eventDeleteId);
                setEventsubmissionsData(filteredList);
            }
            setConfirmationStatus(false);

        } catch (e) {
            console.log(e);
        }

    }

    useEffect(() => {
        if (confirmationStatus) {
            deleteEventHandler();
        }
    }, [confirmationStatus]);



    return (<Box className="form-event-submission-container">
        <ConfirmationModal title={"Delete Reporting"} message="Are you sure you want to delete the reporting?" showConfirmationModal={showConfirmationModal}
                           setShowConfirmationModal={setShowConfirmationModal}
                           setConfirmationStatus={setConfirmationStatus}/>
        {isLoading ? <ReactLoader/> : <>
            <div className="event-image-container">
                <img src={eventDetails?.image_url ? eventDetails?.image_url : ImageNotFound}
                     className="event-image"/>


            </div>
            <div className="form-event-submissions">
                {eventSubmissionsData?.length === 0 && <h3>{t("No reporting has been submitted")}</h3>}
                {eventSubmissionsData.length > 0 &&
                    <div className="event-total-report">{t("Total Reported")} : {eventSubmissionsData.length}</div>}
                {eventSubmissionsData?.map((item, index) => <EventSubmissionCard index={index} data={item}
                                                                                 setShowConfirmationModal={setShowConfirmationModal}
                                                                                 key={index}
                                                                                 event={eventDetails}
                                                                                  setIsLoading={setIsLoading}
                                                                                 setEventDeleteId={setEventDeleteId}

                />)}
            </div>
            {eventDetails?.status?.name?.toLowerCase() === 'active'&&
            <div className="report-button-container">
                <Button variant={"contained"} disabled={disableReportButton|| eventDetails?.status?.name?.toLowerCase() !== 'active'}
                        className="report-event-button" onClick={reportEventHandler}>{t("Report Event")}</Button>

            </div>
            }
        </>}
    </Box>);
}

export default FormSubmission
