import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router";
import {ApiClient} from "../../../services/RestServices/BaseRestServices";
import './form-event-submission.scss'
import {Box, Paper} from "@mui/material";
import {DefaultImage} from '../../../assests/png'
import EventSubmissionCard from "./EventSubmissionCard";
import Loader from "react-js-loader";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {EventState} from "../../../EventContext";
import ConfirmationModal from "../../shared/ConfirmationModal/ConfirmationModal";


const FormSubmission = () => {
    const navigate = useNavigate();
    const [eventDetails, setEventDetails] = useState({});
    const [eventSubmissionsData, setEventsubmissionsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const {event_id} = useParams();
    const {setEventName,setIsSubmissionPage}=EventState();
    const [showConfirmationModal,setShowConfirmationModal]=useState(false);
    const [eventDeleteId,setEventDeleteId]=useState(-1);
    const [confirmationStatus,setConfirmationStatus]=useState(false);

    useEffect(() => {                                     
        (async () => {
            setIsLoading(true)
            try {
                const {data} = await ApiClient.get(`/user/submissions/${event_id}`);
                if (data?.success) {
                    setEventDetails(data?.data?.events[0] ?? {})
                    setEventsubmissionsData(data?.data?.submissions)
                    setIsLoading(false)
                    if(data?.data?.events?.length>0) {
                        setEventName(data?.data?.events[0]?.name);
                    }

                }
            } catch (error) {
                setIsLoading(false)
                console.log(error)
            }

            setIsLoading(false);

        })();

        return ()=>{
            setIsLoading(false)
        }

    }, []);

    useEffect(() => {
        console.log('events are ', eventDetails)
    }, [eventDetails]);

    useEffect(() => {
        setIsSubmissionPage(true);
    }, []);
    const reportEventHandler = async () => {
        setIsLoading(true)
        try {
            const {data} = await ApiClient.get(`user/submit_event/${event_id}`);
            console.log('data', data);
            if (data?.success) {
                setIsLoading(false)
                window.location.href = data?.data?.redirect_url;
            }
        } catch (e) {
            console.log(e)
        }

    }

    const deleteEventHandler = async () => {
        try {
            const {data} = await ApiClient.get(`user/destroy/submission/${eventDeleteId}`);
            if (data?.success) {
                const filteredList = eventSubmissionsData?.filter((item) => item?.id !== eventDeleteId  );
                setEventsubmissionsData(filteredList);
            }
            setConfirmationStatus(false);

        } catch (e) {
            console.log(e);
        }

    }

    useEffect(() => {
          if(confirmationStatus){
              deleteEventHandler();
          }
    }, [confirmationStatus]);


    return (<Box className="form-event-submission-container" >
         <ConfirmationModal message="Are you sure want to delete ?"  showConfirmationModal={showConfirmationModal} setShowConfirmationModal={setShowConfirmationModal}  setConfirmationStatus={setConfirmationStatus} />
        {isLoading ? <Loader
            type="bubble-ping"
            bgColor={"#FFFFFF"}
            title="Loading.."
            color={"#FFFFFF"}
            size={100}
        /> : <>
           {/* <div className="event-name-heading-container">


                <div className="form-event-back-button" onClick={() => navigate('/form')}>


                    <Tooltip>
                        <IconButton>
                            <ArrowBackIosIcon/>

                        </IconButton>
                    </Tooltip>

                </div>

            </div>*/}
            <div className="event-image-container">
                <img src={eventDetails?.image_url ? eventDetails?.image_url : DefaultImage}
                     className="event-image"/>

            </div>
            <div className="form-event-submissions">
                {eventSubmissionsData?.length === 0 && <h3>No Event is submitted yet</h3>}
                {eventSubmissionsData.length > 0 &&
                    <div className="event-total-report">Total Reported : {eventSubmissionsData.length}</div>}
                {eventSubmissionsData?.map((item, index) => <EventSubmissionCard index={index} data={item}
                                                                                 setShowConfirmationModal={setShowConfirmationModal}
                                                                                 key={index}
                                                                                 event={eventDetails}
                                                                                 setIsLoading={setIsLoading}
                                                                                 setEventDeleteId={setEventDeleteId}

                                                                                />)}
            </div>
            <div className="report-button-container">
                <button className="report-event-button" onClick={reportEventHandler}>Report Event</button>

            </div>
        </>}
    </Box>);
}

export default FormSubmission
