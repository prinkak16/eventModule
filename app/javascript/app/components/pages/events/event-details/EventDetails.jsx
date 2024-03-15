import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {ApiClient} from "../../../../services/RestServices/BaseRestServices";
import EventDetailsCard from './event-details-card/parent-card-view/EventDetailsCard'
import EventChildCard from '../event-details/event-details-card/child-card-view/EventChildCard'
import {Button} from "@mui/material";
import {useLocation} from "react-router";
import './event-details.scss'
import {toast} from "react-toastify";
import ReportEmailModal from "../../../shared/ReportsModel/ReportEmailModal";
import DraggableList from "./drag-and-drop-components/DraggableList";
import {hideUnhideEvents} from "../../../../services/CommonServices/commonServices";
import CircularProgress from "@mui/material/CircularProgress";
import ReactLoader from "../../../shared/loader/Loader";
import ConfirmationModal from "../../../shared/ConfirmationModal/ConfirmationModal";


const EventDetails = () => {
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const [loader,setLoader]=useState(false);
    const [parentEvent, setParentEvent] = useState({});
    const [childEvents, setChildEVents] = useState([]);
    const [isChildEvent, setIsChildEvent] = useState(false)
    const [reportEventId, setReportEventId] = useState("");
    const [reportModal, setReportModal] = useState(false);
    const [hideButtonLoader,setHideButtonLoader]=useState(false);
    //states relate to hide-unhide-modal
    const [hideUnhideData, setHideUnhideData] = useState({
        title: "",
        message: "",
        body: "",
        confirmationButtonText: "",
        note: "",
        event_id: "",
        is_hidden: ""
    });
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationStatus, setConfirmationStatus] = useState(false);
    const {id} = useParams();

    useEffect(() => {
        if (confirmationStatus) {
            hideAndUnhideEvent();
        }
    }, [confirmationStatus]);

    useEffect(() => {
        getEventDetails();
    }, [pathname]);

    const getEventDetails = async () => {
        setLoader(true);
        try {
            const {data} = await ApiClient.get('event/event_data', {params: {id}})
            if (data?.success) {
                setParentEvent(data?.data)
                setChildEVents(data?.child_data);
                setIsChildEvent(data?.is_child);
                window.scrollTo({top: 0});
            } else {
                toast.error("Failed to get events details")
            }

        } catch (e) {
            toast.error(e?.message);

        }finally {
            setLoader(false);
        }


    }
// handle drag function
const onDragEnd = ({ destination, source }) => {
    // Dropped outside the list
    if (!destination) return;

    const updatedChildEvents = [...childEvents];

    //getting the element which is getting dragged
    const targetEvent=updatedChildEvents[source?.index];

    //remove the element from its initial position
    updatedChildEvents?.splice(source?.index,1);

    //inserting the element to its target position
    updatedChildEvents?.splice(destination?.index,0,targetEvent);

    //list of updated positions of the event
    const updatedPositionsOfChildEvents=updatedChildEvents?.map((event)=>event?.id);

    updateChildrenEventsPosition({data:updatedPositionsOfChildEvents});

    //updating the list of child events
    setChildEVents(updatedChildEvents);
};

const updateChildrenEventsPosition=async (body)=>{
    try {
        const {data}=await ApiClient.post('/event/update_position',body);
        if(!data?.success){
            toast.error('Failed during position update')
        }
    }catch (e) {
        toast.error('Failed during position update')
    }
}
const hideAndUnhideEvent=async ()=>{
    const body= {is_hidden:!hideUnhideData?.is_hidden, event_id:hideUnhideData?.event_id}
    setHideButtonLoader(true)
    try{
        const {data}=await hideUnhideEvents(body);
        if(data?.success){
            toast.success(data?.message);
            getEventDetails();
        }else{
            toast.error(data?.message);
        }
    }catch (e){
      toast.error(e?.message);
    }finally {
        setHideButtonLoader(false)
        setConfirmationStatus(false)
    }
}
    const handleClick = (event_action) => {
        if (event_action === 'create_event') {
            navigate(`/events/create/${id}`);
        } else {
            window.location.href = parentEvent?.create_form_url;
        }
    }

    const enableHideConfirmationModal = (body) => {
        const title = body?.is_hidden ? "Unhide Event" : "Hide Event";
        const message = body?.is_hidden ? "Are you sure you want to unhide the event ?" : "Are you sure you want to hide the event";
        const confirmationButtonText = body?.is_hidden ? "Unhide" : "Hide";
        const note = body?.is_hidden ? "Unhiding this event will show its sub-events to users" : "Hiding this event will hide its sub-events from users"
        setHideUnhideData((prevData) => ({
            ...prevData,
            message: message,
            title: title,
            confirmationButtonText: confirmationButtonText,
            event_id: body?.event_id,
            is_hidden: body?.is_hidden,
            note: note
        }))
        setShowConfirmationModal(true)
    }


    return (
        <div className={"event-details-main-container"}>
            <ConfirmationModal title={hideUnhideData?.title} message={hideUnhideData?.message} note={hideUnhideData?.note}
                               showConfirmationModal={showConfirmationModal}
                               setShowConfirmationModal={setShowConfirmationModal}
                               setConfirmationStatus={setConfirmationStatus}
                               confirmationButtonText={hideUnhideData?.confirmationButtonText}/>
            {loader?<ReactLoader/>:<>
            <ReportEmailModal reportModal={reportModal} setReportModal={setReportModal} reportEventId={reportEventId}/>
            <div className={"heading"}>Event Details</div>
            <EventDetailsCard event={parentEvent}/>
            {parentEvent?.has_sub_event && <>
                {parentEvent?.status?.name?.toLowerCase() !== 'expired' &&
                    <div className={"add-event-button-container"}>
                        <Button onClick={() => handleClick('create_event')} className={"add-event-button"}
                                variant={"contained"}>+ Add Sub Event</Button>
                        <Button disabled={hideButtonLoader} onClick={() => {
                            const body = {
                                event_id: parentEvent?.id,
                                is_hidden: parentEvent?.is_hidden
                            }
                            enableHideConfirmationModal(body)
                        }} className={`add-event-button ${hideButtonLoader&&'loader-button-style'}`}
                                variant={"contained"}>{hideButtonLoader?<CircularProgress className={"loader-style"}/>: (parentEvent?.is_hidden?"UnHide event":"Hide event")}</Button>


                    </div>
                }

                <div className={"heading"}>Sub Events</div>
                <div>
                    {childEvents?.length === 0 && <h5 className={"no-sub-event-style"}>No sub event is created yet</h5>}
                </div>

                {childEvents?.length > 0&&
                <DraggableList items={childEvents} onDragEnd={onDragEnd} />
                }

            </>
            }
            {!parentEvent?.has_sub_event && <>

                    <div className={"add-event-button-container"} style={{display:"flex", gap:"20px"}}>
                        {parentEvent?.status?.name?.toLowerCase() !== 'expired' &&
                            <Button onClick={() => handleClick('go_to_form')} className={"add-event-button"}
                                variant={"contained"}>Go to form</Button>
                        }

                        <Button onClick={() => {
                            setReportEventId(id)
                            setReportModal(true)
                        }} className={"add-event-button"}
                                variant={"contained"}>Download Report</Button>

                        <Button disabled={hideButtonLoader} onClick={() => {
                            const body = {
                                event_id: parentEvent?.id,
                                is_hidden: parentEvent?.is_hidden
                            }
                            enableHideConfirmationModal(body)
                        }} className={`add-event-button ${hideButtonLoader&&'loader-button-style'}`}
                                variant={"contained"}> {hideButtonLoader?<CircularProgress className={"loader-style"}/>: (parentEvent?.is_hidden?"UnHide event":"Hide event")} </Button>
                    </div>

                <div className={"heading"}>Form View</div>
                <div className={"iframe-container"}>
                    <iframe src={parentEvent?.preview_url} height="700px" width="100%" title="Iframe Example"/>
                </div>
            </>
            }
</>
            }
        </div>
    )
}

export default EventDetails;